import { ActivePeriod, ExpenseCategory, ExpensePCard, Notification, ReceiptTransaction, UserAccount } from 'models/types';
import { IOcrReceipt } from 'models/ocr';

export const mockUserAccount: UserAccount = {
  email: 'demo@example.com',
  employeeNumber: 12345,
  firstName: 'Demo',
  lastName: 'User',
  name: 'Demo User',
  windowsUsername: 'demouser',
  expenseProEmployeeId: 1
};

export const mockPCards: ExpensePCard[] = [
  {
    cardholderId: 1,
    employeeId: 12345,
    username: 'demouser',
    legalName: 'Demo User',
    lastName: 'User',
    firstName: 'Demo',
    email: 'demo@example.com',
    employeeNumber: 12345,
    managerEmployeeNumber: 67890,
    managerEmail: 'manager@example.com',
    managerFirstName: 'Manager',
    managerLastName: 'Demo',
    accountingCodeName: 'DEMO-001',
    accountingCodeDescription: 'Demo Account',
    accountingCodeId: 1,
    costCenters: 'DEMO-CC',
    companyId: 1,
    companyName: 'Demo Company',
    departmentId: 1,
    departmentName: 'Demo Department',
    locations: 'Demo Location',
    isNonEvaUser: false,
    lastFourDigits: '1234'
  }
];

export const mockActivePeriod: ActivePeriod = {
  currentCompanyStatementPeriodId: 1,
  currentPeriodStartDate: '2024-03-01',
  currentPeriodEndDate: '2024-03-31',
  lastCompanyStatementPeriodId: 2,
  lastPeriodStartDate: '2024-02-01',
  lastPeriodEndDate: '2024-02-29'
};

export const mockReceiptTransactions: ReceiptTransaction[] = [
  {
    id: 1,
    transaction: {
      id: 1,
      supplier: 'Office Supplies Co',
      totalAmount: 156.78,
      taxAmount: 12.34,
      purchaseDate: '2024-03-15'
    },
    receipt: {
      id: 1,
      filePath: 'https://images.pexels.com/photos/4195324/pexels-photo-4195324.jpeg',
      cardholderId: 1,
      supplier: 'Office Supplies Co',
      expenseCategoryId: 17,
      totalAmount: 156.78,
      purchaseDate: '2024-03-15',
      description: 'Office supplies and equipment',
      taxCharged: true,
      shippedAnotherState: false,
      multipleCompaniesCharged: false,
      mealAttendanceCount: null,
      receiptConfidence: 0.95,
      taxAmount: 12.34,
      isMatched: true,
      dateCreated: '2024-03-15T10:00:00Z',
      dateUpdated: '2024-03-15T10:00:00Z',
      isReceiptRequired: true,
      projectName: ''
    },
    matchStatus: 1,
    receiptStatus: 2,
    cardholderId: 1,
    supplier: 'Office Supplies Co',
    totalAmount: 156.78,
    taxAmount: 12.34,
    purchaseDate: '2024-03-15'
  },
  {
    id: 2,
    transaction: {
      id: 2,
      supplier: 'Restaurant Demo',
      totalAmount: 85.50,
      taxAmount: 6.84,
      purchaseDate: '2024-03-14'
    },
    receipt: null,
    matchStatus: 1,
    receiptStatus: 1,
    cardholderId: 1,
    supplier: 'Restaurant Demo',
    totalAmount: 85.50,
    taxAmount: 6.84,
    purchaseDate: '2024-03-14'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    isRead: false,
    title: 'Missing Receipt',
    message: 'Please upload receipt for transaction from Restaurant Demo',
    employeeId: 12345,
    receiptId: 2,
    cardholderId: 1,
    isPending: false,
    dateCreated: '2024-03-14T15:00:00Z',
    dateUpdated: '2024-03-14T15:00:00Z',
    type: 1,
    receiptTransactionId: 2
  }
];

export const mockOcrResponse: IOcrReceipt = {
  merchantName: 'Office Supplies Co',
  merchantPhoneNumber: '555-0123',
  merchantAddress: '123 Demo St',
  total: 156.78,
  transactionDate: '2024-03-15',
  transactionTime: '10:00:00',
  subTotal: 144.44,
  tax: 12.34,
  tip: 0,
  currency: 'USD',
  category: 'Other',
  merchantAliases: null,
  items: [],
  taxDetails: null,
  merchantNameConfidence: 3,
  transactionTotalConfidence: 3,
  transactionDateConfidence: 3,
  taxConfidence: 3,
  receiptConfidence: 0.95
};