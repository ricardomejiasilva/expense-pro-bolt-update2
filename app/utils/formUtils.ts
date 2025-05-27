import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadFullReceipt } from './apis';
import {
    type ExpenseCategory,
    type Receipt,
    type ApiResponse,
    type AppContextType,
    type IFormContext,
    type OcrContextType,
    type ToastContextType,
    type ReceiptTransaction,
} from 'models/types';
import { type FullReceipt, type IUploadReceiptDataObject } from 'models/fullReceipt';
import { convertDateMdyToYmd } from './convertDateUtils';
import { handleAttachReceipt } from './appContextUtils';
import { getCleanFilePath } from './getCleanFilePath';

export const validateAndSanitizeFormFields = async (
    formContext: IFormContext,
    categories: ExpenseCategory[]
): Promise<{ isError: boolean }> => {
    const fieldsToValidate = [
        { field: formContext.supplier, setField: formContext.setSupplier },
        { field: formContext.amount, setField: formContext.setAmount },
        { field: formContext.mdyDate, setField: formContext.setMdyDate },
        {
            field: formContext.description,
            setField: formContext.setDescription,
        },
    ];

    const matchedCategory = categories.find(
        (category) => category.id === formContext.selectedCategory.value
    );

    if (matchedCategory?.name.toLowerCase() === 'job cost') {
        fieldsToValidate.push({
            field: formContext.projectName,
            setField: formContext.setProjectName,
        });
    }

    if (matchedCategory?.name.toLowerCase() === 'meals') {
        // If meal category is selected, add meal field to fieldsToValidate
        fieldsToValidate.push({
            field: formContext.meal,
            setField: formContext.setMeal,
        });
    }

    let globalIsError = false;

    fieldsToValidate.forEach(({ field, setField }) => {
        if (field.value.trim() === '') {
            setField({ value: field.value, isError: true });
            globalIsError = true;
        }
    });

    return { isError: globalIsError };
};

export const submitReceiptForm = async (
    ocrImage: string | null,
    receiptData: IUploadReceiptDataObject,
    selectedReceiptTransaction?: ReceiptTransaction | null
): Promise<ApiResponse<FullReceipt>> => {
    // If there is a new receipt in the OCR state, remove filePath from receiptData
    if (ocrImage && receiptData.filePath) {
        delete receiptData.filePath;
    }

    try {
        const isAttaching = await AsyncStorage.getItem('isAttachingReceipt');
        if (isAttaching === 'true') {
            await AsyncStorage.removeItem('isAttachingReceipt');
        }

        // Get transactionId if we're attaching a receipt
        const transactionId =
            selectedReceiptTransaction && !selectedReceiptTransaction.receipt
                ? selectedReceiptTransaction.transaction.id
                : undefined;

        return await uploadFullReceipt(ocrImage, receiptData, transactionId);
    } catch (error) {
        console.error('Error uploading receipt:', error);
        return {
            status: 500,
            error: 'An error occurred. Please try again later.',
        };
    }
};

const generateReceiptDataObject = (
    appContext: AppContextType,
    formContext: IFormContext,
    ocrContext: OcrContextType
) => {
    const { selectedReceiptTransaction, selectedPCard } = appContext;
    const { ocrState } = ocrContext;

    if (!selectedPCard || selectedPCard.cardholderId === undefined) {
        throw new Error('Cardholder ID is not available.');
    }

    const selectedReceipt = selectedReceiptTransaction?.receipt ?? null;

    const receiptData: IUploadReceiptDataObject = {
        // if selectedReceiptTransaction is not null, populate the receipt values, then override the rest
        ...selectedReceipt,
        // map formContext values to receiptData
        supplier: formContext.supplier.value,
        totalAmount: parseFloat(formContext.amount.value.replace(/,/g, '')), // ensure commas are removed
        purchaseDate: convertDateMdyToYmd(formContext.mdyDate.value),
        description: formContext.description.value,
        mealAttendanceCount: parseInt(formContext.meal.value) || null,
        taxCharged: formContext.isSelectedTax.value,
        shippedAnotherState: formContext.isSelectedShipped.value,
        multipleCompaniesCharged: formContext.isSelectedCharge.value,
        expenseCategoryId: formContext.selectedCategory.value || null,
        projectName: formContext.projectName.value,
        // other required params
        cardholderId: selectedPCard.cardholderId,
        receiptConfidence: ocrState.data?.receiptConfidence ?? 1,
    };

    // Replace the base URL with "receipts/" when filePath exists
    if (selectedReceipt && selectedReceipt.filePath) {
        const cleanFilePath = getCleanFilePath(selectedReceipt.filePath);
        receiptData.filePath = `receipts/${cleanFilePath}`;
    }

    return receiptData;
};

export interface IHandleReceiptFormSubmit {
    formContext: IFormContext;
    appContext: AppContextType;
    ocrContext: OcrContextType;
    toastContext: ToastContextType;
    image: string | null; // null if editing existing receipt
    loadNotifications?: () => Promise<void>;
    onSuccess: (receiptObject: FullReceipt | null) => void;
}

export const handleReceiptFormSubmit = async (
    receiptFormSubmitParams: IHandleReceiptFormSubmit
): Promise<boolean> => {
    const { formContext, appContext, ocrContext, toastContext, image } = receiptFormSubmitParams;
    const { setIsSubmitting, setErrorMessage } = formContext;
    const { selectedPCard, quietlyRefreshPCardReceipts, selectedReceiptTransaction } = appContext;
    const { ocrState } = ocrContext;
    const { showToast } = toastContext;

    setIsSubmitting(true);
    setErrorMessage(null);

    if (!selectedPCard || selectedPCard.cardholderId === undefined) {
        // Provide error message if cardholderId is not available
        setIsSubmitting(false);
        setErrorMessage(
            'There was an issue with your cardholder details. Please logout, log back in, and try again.'
        );
        return false;
    }

    if (!image && !appContext.selectedReceiptTransaction) {
        // Provide error message if there is no image for a new receipt
        setIsSubmitting(false);
        setErrorMessage('There is no image attached. Please attach an image and try again.');
        return false;
    }

    // Verify that all required fields are filled, if not set isError to true
    const validationResponse = await validateAndSanitizeFormFields(
        formContext,
        appContext.categories
    );

    if (validationResponse.isError) {
        // Provide error message if any required fields are not filled
        setIsSubmitting(false);
        showToast('Please check the form fields and try again.', 'error', false);
        return false;
    }

    const purchaseDate = new Date(convertDateMdyToYmd(formContext.mdyDate.value));
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    if (purchaseDate < sixtyDaysAgo) {
        setIsSubmitting(false);
        showToast('Please check the form fields and try again.', 'error', false);
        return false;
    }

    const newReceipt = generateReceiptDataObject(appContext, formContext, ocrContext);

    // Submit receipt form to API
    const response = await submitReceiptForm(
        ocrState?.ocrImage,
        newReceipt,
        selectedReceiptTransaction
    );

    if (response.status === 200) {
        const receiptData = response.data;

        if (!receiptData || !receiptData.id) {
            setIsSubmitting(false);
            setErrorMessage('The receipt data is invalid. Please try again later.');
            return false;
        }

        if (selectedReceiptTransaction && !selectedReceiptTransaction?.receipt) {
            // If the selectedReceiptTransaction is missing a receipt, attach the new receipt to it
            await handleAttachReceipt(
                selectedReceiptTransaction.transaction.id,
                receiptData.id,
                quietlyRefreshPCardReceipts,
                () => {
                    handleReceiptFormSubmitSuccess({
                        receiptFormSubmitParams,
                        newReceiptObject: receiptData,
                    });
                },
                () => {
                    setErrorMessage('Error attaching receipt. Please try again later.');
                }
            );
        }

        handleReceiptFormSubmitSuccess({
            receiptFormSubmitParams,
            newReceiptObject: receiptData,
        });

        return true;
    } else {
        setIsSubmitting(false);
        setErrorMessage(
            response.error ?? 'There was an issue submitting your receipt. Please try again later.'
        );
        return false;
    }
};

interface HandleReceiptFormSubmitSuccessProps {
    receiptFormSubmitParams: IHandleReceiptFormSubmit;
    newReceiptObject: FullReceipt;
}

export const handleReceiptFormSubmitSuccess = ({
    receiptFormSubmitParams,
    newReceiptObject,
}: HandleReceiptFormSubmitSuccessProps) => {
    const { formContext, appContext, ocrContext, onSuccess, loadNotifications } =
        receiptFormSubmitParams;

    const { quietlyRefreshPCardReceipts, clearSelectedReceiptTransaction } = appContext;
    const { resetOcrState } = ocrContext;
    const { setIsSubmitting, resetFormContext } = formContext;

    // Navigate to Receipts screen
    onSuccess(newReceiptObject);

    // Reset form context and ocr state
    setIsSubmitting(false);
    resetOcrState();
    resetFormContext();
    clearSelectedReceiptTransaction();

    // Refresh pCardReceipts state in the background, as this operation can be slow...
    quietlyRefreshPCardReceipts();

    // Refresh notifications to update pending alerts if loadNotifications is provided
    if (loadNotifications) {
        loadNotifications();
    }
};

export const formatAmount = (amount: number | null): string => {
    if (amount === null || amount === undefined) return '';
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
