import type { Dayjs } from 'dayjs';

export interface FullReceipt {
    id?: number;
    filePath?: string;
    userId: number;
    name?: string;
    status: ReceiptStatus;
    supplier: string;
    expenseCategoryId: number | null;
    description: string;
    totalAmount: number;
    purchaseDate: Date | Dayjs | string;
    taxCharged: boolean;
    shippedAnotherState: boolean;
    multipleCompaniesCharged: boolean;
    mealAttendanceCount: number | null;
    projectName?: string; // field to be added to endpoints in PBI 1233862
    taxAmount: number;
    receiptConfidence: number;
    isMatched?: boolean;
    dateCreated?: string;
    dateUpdated?: string;
    // UI only
    localImageUrl?: string;
}

export interface IUploadReceiptDataObject extends Partial<FullReceipt> {
    // Required params
    supplier: string;
    totalAmount: number;
    description: string;
    cardholderId: number; // PCard cardholderId
    purchaseDate: string; // Transaction date from form !!THIS NEED TO BE THE DATE STRING ONLY (e.g. 2024-12-03)
    receiptConfidence: number;
}

export enum ReceiptStatus {
    None = 0,
    Missing = 1,
    Pending = 2,
    Complete = 3,
    Submitted = 4,
}

export const ReceiptStatusLabels: { [key in ReceiptStatus]: string } = {
    [ReceiptStatus.None]: 'N/A',
    [ReceiptStatus.Missing]: 'Missing Receipt',
    [ReceiptStatus.Pending]: 'Pending',
    [ReceiptStatus.Complete]: 'Complete',
    [ReceiptStatus.Submitted]: 'Submitted',
};

export enum ReceiptNotificationType {
    None = 0,
    UploadReminder = 1,
    ImproveReceipt = 2,
    ExpandDescription = 3,
}

export const ReceiptNotificationLabels: { [key in ReceiptNotificationType]: string } = {
    [ReceiptNotificationType.None]: 'None',
    [ReceiptNotificationType.UploadReminder]: 'Upload Reminder',
    [ReceiptNotificationType.ImproveReceipt]: 'Improve Receipt',
    [ReceiptNotificationType.ExpandDescription]: 'Expand on Description',
};
