import { Account, ApiResponse, ExpenseCategory, ExpensePCard, Notification, ReceiptTransaction } from 'models/types';
import { type FullReceipt, type IUploadReceiptDataObject } from 'models/fullReceipt';
import { IOcrReceipt } from 'models/ocr';
import { mockUserAccount, mockPCards, mockActivePeriod, mockReceiptTransactions, mockNotifications, mockOcrResponse } from './mockData';

// Mock API response helper
const mockApiResponse = <T>(data: T, delay = 500): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data, status: 200 });
    }, delay);
  });
};

export const checkUser = async () => {
  return mockApiResponse<Account>({ account: mockUserAccount, flags: 8 });
};

export const fetchExpenseCategories = async () => {
  return mockApiResponse<ExpenseCategory[]>([
    { id: 16, name: 'Advertising' },
    { id: 17, name: 'Building/Warehouse' },
    { id: 18, name: 'Employee Expense' },
    { id: 19, name: 'Freight' },
    { id: 20, name: 'Gas' },
    { id: 21, name: 'IT' },
    { id: 22, name: 'Job Cost' },
    { id: 23, name: 'Meals' },
    { id: 24, name: 'Travel' },
    { id: 25, name: 'Other' }
  ]);
};

export const fetchExpenseProCardholders = async () => {
  return mockApiResponse<ExpensePCard[]>(mockPCards);
};

export const fetchCardholderActivePeriodInformation = async () => {
  return mockApiResponse(mockActivePeriod);
};

export const fetchReceiptNotifications = async () => {
  return mockApiResponse<Notification[]>(mockNotifications);
};

export const fetchReceiptTransactions = async () => {
  return mockApiResponse<ReceiptTransaction[]>(mockReceiptTransactions);
};

export const readReceiptNotifications = async () => {
  return mockApiResponse<Notification[]>([]);
};

export const uploadFullReceipt = async (
  receiptImage: string | null,
  receiptData: IUploadReceiptDataObject
): Promise<ApiResponse<FullReceipt>> => {
  const mockReceipt: FullReceipt = {
    id: Math.floor(Math.random() * 1000),
    filePath: receiptImage || 'https://images.pexels.com/photos/4195324/pexels-photo-4195324.jpeg',
    ...receiptData,
    status: 2,
    dateCreated: new Date().toISOString(),
    dateUpdated: new Date().toISOString(),
  };
  return mockApiResponse<FullReceipt>(mockReceipt);
};

export const uploadReceiptSearch = async (): Promise<ApiResponse<IOcrReceipt>> => {
  return mockApiResponse<IOcrReceipt>(mockOcrResponse);
};

export const attachExistingReceipt = async (
  transactionId: number,
  receiptId: number
): Promise<ApiResponse<ReceiptTransaction>> => {
  const mockTransaction = mockReceiptTransactions[0];
  return mockApiResponse<ReceiptTransaction>(mockTransaction);
};