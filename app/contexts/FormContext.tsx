import React, { createContext, ReactNode, useContext, useState } from 'react';
import { formatAmount } from 'utils/formUtils';
import type { IFormContext, ReceiptTransaction } from 'models/types';
import { convertDateObjectToYmd, convertDateYmdToMdy } from 'utils/convertDateUtils';
import { useAppContext } from './AppContext';

export const defaultFormContext: IFormContext = {
    supplier: { value: '', isError: false },
    amount: { value: '', isError: false },
    mdyDate: { value: '', isError: false }, // "mdy" is an abbreviation for "month day year" (e.g. mm-dd-yyyy)
    description: { value: '', isError: false },
    meal: { value: '', isError: false },
    projectName: { value: '', isError: false },
    isSelectedTax: { value: false, isError: false },
    isSelectedShipped: { value: false, isError: false },
    isSelectedCharge: { value: false, isError: false },
    calendarDate: { value: convertDateObjectToYmd(new Date()), isError: false },
    selectedCategory: { value: 0, isError: false },
    isSubmitting: false,
    errorMessage: null,
    isEditingReceiptDetails: false,
    setSupplier: () => {},
    setAmount: () => {},
    setMdyDate: () => {},
    setDescription: () => {},
    setMeal: () => {},
    setProjectName: () => {},
    setIsSelectedTax: () => {},
    setIsSelectedShipped: () => {},
    setIsSelectedCharge: () => {},
    setCalendarDate: () => {},
    setSelectedCategory: () => {},
    setIsSubmitting: () => {},
    setErrorMessage: () => {},
    updateFormValuesFromReceiptTransaction: () => {},
    resetFormContext: () => {},
    resetAutofilledFormFields: () => {},
    setIsEditingReceiptDetails: () => {},
};

const FormContext = createContext<IFormContext>(defaultFormContext);

export const useFormContext = () => useContext(FormContext);

interface FormProviderProps {
    children: ReactNode;
}
// prettier-ignore
export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
    const [supplier, setSupplier] = useState<IFormContext["supplier"]>(defaultFormContext.supplier);
    const [amount, setAmount] = useState<IFormContext["amount"]>(defaultFormContext.amount);
    const [mdyDate, setMdyDate] = useState<IFormContext["mdyDate"]>(defaultFormContext.mdyDate);
    const [description, setDescription] = useState<IFormContext["description"]>(defaultFormContext.description);
    const [meal, setMeal] = useState<IFormContext["meal"]>(defaultFormContext.meal);
    const [projectName, setProjectName] = useState<IFormContext["projectName"]>(defaultFormContext.projectName);
    const [isSelectedTax, setIsSelectedTax] = useState<IFormContext["isSelectedTax"]>(defaultFormContext.isSelectedTax);
    const [isSelectedShipped, setIsSelectedShipped] = useState<IFormContext["isSelectedShipped"]>(defaultFormContext.isSelectedShipped);
    const [isSelectedCharge, setIsSelectedCharge] = useState<IFormContext["isSelectedCharge"]>(defaultFormContext.isSelectedCharge);
    const [calendarDate, setCalendarDate] = useState<IFormContext["calendarDate"]>(defaultFormContext.calendarDate);
    const [selectedCategory, setSelectedCategory] = useState<IFormContext["selectedCategory"]>(defaultFormContext.selectedCategory);
    const [isSubmitting, setIsSubmitting] = useState<IFormContext["isSubmitting"]>(defaultFormContext.isSubmitting);
    const [errorMessage, setErrorMessage] = useState<IFormContext["errorMessage"]>(defaultFormContext.errorMessage);
    const [isEditingReceiptDetails, setIsEditingReceiptDetails] = useState<IFormContext["isEditingReceiptDetails"]>(false);

    const updateFormValuesFromReceiptTransaction = (item: ReceiptTransaction) => {
        setSupplier({ value: item.receipt.supplier ?? defaultFormContext.supplier.value, isError: false });
        setAmount({ value: formatAmount(item.receipt.totalAmount) ?? defaultFormContext.amount.value, isError: false });
        setMdyDate({ value: convertDateYmdToMdy(item.receipt.purchaseDate) ?? defaultFormContext.mdyDate.value, isError: false });
        setDescription({ value: item.receipt.description ?? defaultFormContext.description.value, isError: false });
        setMeal({ value: item.receipt.mealAttendanceCount ? String(item.receipt.mealAttendanceCount) : defaultFormContext.meal.value, isError: false });
        setProjectName({ value: item.receipt.projectName ?? defaultFormContext.projectName.value, isError: false });
        setIsSelectedTax({ value: item.receipt.taxCharged ?? defaultFormContext.isSelectedTax.value, isError: false });
        setIsSelectedShipped({ value: item.receipt.shippedAnotherState ?? defaultFormContext.isSelectedShipped.value, isError: false });
        setIsSelectedCharge({ value: item.receipt.multipleCompaniesCharged ?? defaultFormContext.isSelectedCharge.value, isError: false });
        setCalendarDate({ value: item.receipt.purchaseDate ?? defaultFormContext.calendarDate.value, isError: false });
        setSelectedCategory({ value: item.receipt.expenseCategoryId ?? defaultFormContext.selectedCategory.value, isError: false });
    };

    const resetFormContext = () => {
        setSupplier(defaultFormContext.supplier);
        setAmount(defaultFormContext.amount);
        setMdyDate(defaultFormContext.mdyDate);
        setDescription(defaultFormContext.description);
        setMeal(defaultFormContext.meal);
        setProjectName(defaultFormContext.projectName);
        setIsSelectedTax(defaultFormContext.isSelectedTax);
        setIsSelectedShipped(defaultFormContext.isSelectedShipped);
        setIsSelectedCharge(defaultFormContext.isSelectedCharge);
        setCalendarDate(defaultFormContext.calendarDate);
        setSelectedCategory(defaultFormContext.selectedCategory);
        setIsSubmitting(defaultFormContext.isSubmitting);
        setErrorMessage(defaultFormContext.errorMessage);
        setIsEditingReceiptDetails(false);
    };

    const resetAutofilledFormFields = () => {
        setSupplier(defaultFormContext.supplier);
        setAmount(defaultFormContext.amount);
        setMdyDate(defaultFormContext.mdyDate);
    }

    const value = {
        supplier,
        setSupplier,
        amount,
        setAmount,
        mdyDate,
        setMdyDate,
        description,
        setDescription,
        meal,
        setMeal,
        projectName,
        setProjectName,
        isSelectedTax,
        setIsSelectedTax,
        isSelectedShipped,
        setIsSelectedShipped,
        isSelectedCharge,
        setIsSelectedCharge,
        calendarDate,
        setCalendarDate,
        selectedCategory,
        isSubmitting,
        setIsSubmitting,
        isEditingReceiptDetails,
        setIsEditingReceiptDetails,
        errorMessage,
        setErrorMessage,
        setSelectedCategory,
        updateFormValuesFromReceiptTransaction,
        resetFormContext,
        resetAutofilledFormFields,
    };

    return (
        <FormContext.Provider value={value}>{children}</FormContext.Provider>
    );
};
