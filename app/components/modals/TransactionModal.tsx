import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useFormContext } from 'contexts/FormContext';
import { useAppContext } from 'contexts/AppContext';
import { useOcrContext } from 'contexts/OcrContext';
import { useToastContext } from 'contexts/ToastContext';
import { useNotification } from 'contexts/NotificationContext';

import { handleReceiptFormSubmit } from 'utils/formUtils';

import { type RootStackParamList } from 'models/types';
import { type FullReceipt } from 'models/fullReceipt';
import { ReceiptStatus } from 'models/receiptStatus';

import StatusTag from 'components/StatusTag';
import AttachReceiptModal from 'components/modals/AttachReceiptModal';
import CompleteModalSection from 'components/modals/CompleteModalSection';
import Toast from 'components/Toast';
import { useModalContext } from 'contexts/ModalContext';
import ModalLayout from 'components/layouts/ModalLayout';
import TransactionModalMissingContent from './TransactionModalMissingContent';
import TransactionModalPendingContent from './TransactionModalPendingContent';

interface TransactionModalProps {}

const TransactionModal: React.FC<TransactionModalProps> = () => {
    type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TransactionModal'>;
    const navigation = useNavigation<NavigationProp>();
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const appContext = useAppContext();
    const ocrContext = useOcrContext();
    const toastContext = useToastContext();
    const formContext = useFormContext();
    const { loadNotifications } = useNotification();
    const {
        selectedReceiptTransaction,
        shortForm,
        clearSelectedReceiptTransaction,
        attachReceiptModalVisible,
        setAttachReceiptModalVisible,
    } = appContext;
    const {
        resetFormContext,
        updateFormValuesFromReceiptTransaction,
        isEditingReceiptDetails,
        setIsEditingReceiptDetails,
    } = formContext;
    const { ocrState, resetOcrState } = ocrContext;
    const { showToast } = toastContext;
    const { isUploadingMissingReceipt, setIsUploadingMissingReceipt } = useModalContext();
    const receiptStatus = selectedReceiptTransaction?.receiptStatus;

    const initialImage =
        ocrState.ocrImage && !ocrState.isSubmitting
            ? ocrState.ocrImage
            : selectedReceiptTransaction?.receipt?.filePath || null;
    const [image, setImage] = useState(initialImage);

    useEffect(() => {
        const newImage =
            ocrState.ocrImage && !ocrState.isSubmitting
                ? ocrState.ocrImage
                : selectedReceiptTransaction?.receipt?.filePath || null;
        setImage(newImage);
    }, [selectedReceiptTransaction, ocrState.ocrImage, ocrState.isSubmitting]);

    const handleClose = () => {
        if (ocrContext.ignoreResultRef) {
            ocrContext.ignoreResultRef.current = true;
            ocrContext.activeOcrIdRef.current = 0;
        }
        resetOcrState();
        resetFormContext();
        clearSelectedReceiptTransaction();
        navigation.goBack();
        setIsEditingReceiptDetails(false);
        setImage(initialImage);
    };

    const handleEdit = () => {
        if (!isEditingReceiptDetails) {
            selectedReceiptTransaction &&
                updateFormValuesFromReceiptTransaction(selectedReceiptTransaction);
            setIsEditingReceiptDetails(true);
        }
    };

    const handleEditCancel = () => {
        if (isEditingReceiptDetails) {
            setIsEditingReceiptDetails(false);

            if (ocrContext.ignoreResultRef) {
                ocrContext.ignoreResultRef.current = true;
                ocrContext.activeOcrIdRef.current = 0;
            }

            resetOcrState();

            const originalImage = selectedReceiptTransaction?.receipt?.filePath || null;
            setImage(originalImage);
        }
    };

    const handleSuccess = (_receiptObject: FullReceipt | null) => {
        if (isEditingReceiptDetails) {
            setIsEditingReceiptDetails(false);
            handleClose();
            showToast(
                selectedReceiptTransaction
                    ? `Receipt ${selectedReceiptTransaction.id} changes saved.`
                    : `Receipt changes saved.`,
                'success',
                false
            );
            loadNotifications();
        }
    };

    const handleSave = async () => {
        await handleReceiptFormSubmit({
            formContext,
            appContext,
            ocrContext,
            toastContext,
            image: image as string,
            onSuccess: handleSuccess,
            loadNotifications,
        });
    };

    const handleAttach = () => {
        setTimeout(() => {
            setAttachReceiptModalVisible(true);
        }, 100);
    };

    const toggleCategoryEditModal = () => {
        navigation.navigate('CategoryEditModal', {
            screen: 'CategoryEditModal',
        });
    };

    if (!selectedReceiptTransaction || !selectedReceiptTransaction) {
        // TODO: Handle this as an error, as this should not happen
        return null;
    }

    return (
        <ModalLayout
            title="Transaction Details"
            extra={selectedReceiptTransaction && <StatusTag item={selectedReceiptTransaction} />}
            onClose={handleClose}
        >
            <Toast />
            {receiptStatus === ReceiptStatus.Missing ? (
                <TransactionModalMissingContent handleAttach={handleAttach} />
            ) : receiptStatus === ReceiptStatus.Pending ||
              receiptStatus === ReceiptStatus.Submitted ? (
                <TransactionModalPendingContent
                    handleCancel={handleClose}
                    handleEdit={handleEdit}
                    handleEditCancel={handleEditCancel}
                    handleSave={handleSave}
                    isEditingReceiptDetails={isEditingReceiptDetails}
                    formContext={formContext}
                    image={image}
                    setImage={setImage}
                    isUploadModalVisible={isUploadModalVisible}
                    setIsUploadModalVisible={setIsUploadModalVisible}
                    shortForm={shortForm}
                    isUploadingMissingReceipt={isUploadingMissingReceipt}
                    setIsUploadingMissingReceipt={setIsUploadingMissingReceipt}
                    navigation={navigation}
                    toggleCategoryEditModal={toggleCategoryEditModal}
                    receiptStatus={receiptStatus}
                    selectedReceiptTransaction={selectedReceiptTransaction}
                />
            ) : receiptStatus === ReceiptStatus.Complete ? (
                <CompleteModalSection
                    image={selectedReceiptTransaction?.receipt?.filePath}
                    displayAlert={false}
                />
            ) : null}

            <AttachReceiptModal
                isModalVisible={attachReceiptModalVisible}
                setIsModalVisible={setAttachReceiptModalVisible}
            />
        </ModalLayout>
    );
};

export default TransactionModal;
