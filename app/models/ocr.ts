// Types for the ExpensePro.Models.Ocr.OcrCategory schema
export type OcrCategoryTypes = 'Other' | 'RetailMeal' | 'CreditCard' | 'Gas' | 'Parking' | 'Hotel';

// Types for the ExpensePro.Models.ConfidenceLevel schema
export type ConfidenceLevelTypes = 0 | 1 | 2 | 3;

// Interface for the ExpensePro.Models.Ocr.OcrReceiptItems schema
export interface IOcrReceiptItem {
    content: string | null;
    totalPrice: number;
    description: string | null;
    quantity: number;
    price: number;
    productCode: string | null;
    quantityUnit: string | null;
    category: string | null;
    date: string | null;
    confidenceLevel: ConfidenceLevelTypes;
}

// Interface for the ExpensePro.Models.Ocr.TaxDetails schema
export interface ITaxDetails {
    amount: number;
    confidence: number;
}

// Interface for the ExpensePro.Models.Ocr.OcrReceipt schema
export interface IOcrReceipt {
    merchantName: string | null;
    merchantPhoneNumber: string | null;
    merchantAddress: string | null;
    total: number | null;
    transactionDate: string | null;
    transactionTime: string | null;
    subTotal: number;
    tax: number;
    tip: number;
    currency: string | null;
    category: OcrCategoryTypes;
    merchantAliases: string[] | null;
    items: IOcrReceiptItem[] | null;
    taxDetails: ITaxDetails[] | null;
    merchantNameConfidence: ConfidenceLevelTypes;
    transactionTotalConfidence: ConfidenceLevelTypes;
    transactionDateConfidence: ConfidenceLevelTypes;
    taxConfidence: ConfidenceLevelTypes;
    receiptConfidence: number;
}

// Object for ocrState
export interface IOcrState {
    ocrImage: string | null;
    isSubmitting: boolean;
    isLowConfidence: boolean | null;
    isErrorDisplayed: boolean;
    errorMessage: string | null;
    data: IOcrReceipt | null;
}

export const initialOcrState: IOcrState = {
    ocrImage: null,
    isSubmitting: false,
    isLowConfidence: null,
    isErrorDisplayed: false,
    errorMessage: null,
    data: null,
};
