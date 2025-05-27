import { ImageSourcePropType } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { type IOcrState } from './ocr';

export type Account = {
    account: UserAccount;
    flags: number;
};

export type ActivePeriod = {
    currentCompanyStatementPeriodId: number;
    currentPeriodStartDate: string;
    currentPeriodEndDate: string;
    lastCompanyStatementPeriodId: number;
    lastPeriodStartDate: string;
    lastPeriodEndDate: string;
};

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

export type AppContextType = {
    token: string;
    setToken: (newToken: string, expiresAt?: string) => void;
    userAccount: UserAccount | null;
    categories: ExpenseCategory[];
    categoriesAndIcons: Category[];
    shortForm: boolean;
    setShortForm: (value: boolean) => void;
    pCards: ExpensePCard[];
    selectedPCard: ExpensePCard | null;
    setSelectedPCard: (value: ExpensePCard | null) => void;
    pCardReceipts: ReceiptTransaction[];
    setPCardReceipts: (value: ReceiptTransaction[]) => void;
    quietlyRefreshPCardReceipts: () => void;
    cardholderId: number;
    setCardholderId: (val: number) => void;
    selectedReceiptTransaction: ReceiptTransaction | null;
    setSelectedReceiptTransaction: React.Dispatch<React.SetStateAction<ReceiptTransaction | null>>;
    clearSelectedReceiptTransaction: () => void;
    isPCardReceiptLoading: boolean;
    setIsPCardReceiptLoading: (value: boolean) => void;
    receiptTransactions: ReceiptTransaction[];
    isTransactionModalVisible: boolean;
    setIsTransactionModalVisible: (value: boolean) => void;
    attachReceiptModalVisible: boolean;
    setAttachReceiptModalVisible: (value: boolean) => void;
    isUploadModalVisible: boolean;
    setIsUploadModalVisible: (value: boolean) => void;
    isAttachingReceipt: boolean;
    setIsAttachingReceipt: (value: boolean) => void;
    activePeriod: ActivePeriod | null;
    setActivePeriod: React.Dispatch<React.SetStateAction<ActivePeriod | null>>;
    setUserAccount: (userAccount: UserAccount | null) => void;
    setCategories: (categories: ExpenseCategory[]) => void;
    hasLoadingScreenAnimationAlreadyRun: boolean;
    setHasLoadingScreenAnimationAlreadyRun: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface IToastState {
    isToastVisible: boolean;
    message: string;
    type: 'error' | 'success';
    notification?: boolean;
}

export type ToastContextType = {
    toastState: IToastState;
    setToastState: React.Dispatch<React.SetStateAction<IToastState>>;
    showToast: (
        message: IToastState['message'],
        type: IToastState['type'],
        notification: IToastState['notification']
    ) => void;
    closeToast: () => void;
    toastDisplayDuration: number;
};

export type ModalContextType = {
    isImageDisplayModalVisible: boolean;
    setIsImageDisplayModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isUploadingMissingReceipt: boolean;
    setIsUploadingMissingReceipt: React.Dispatch<React.SetStateAction<boolean>>;
};

export type OcrContextType = {
    ocrState: IOcrState;
    setOcrState: React.Dispatch<React.SetStateAction<IOcrState>>;
    resetOcrState: () => void;
    handleOcrSubmission: (newImage: string, updateFormFields: boolean) => Promise<void>;
    initialOcrState: IOcrState;
    ignoreResultRef: React.MutableRefObject<boolean> | null;
    activeOcrIdRef: React.MutableRefObject<number>;
};

export type Card = {
    id: number;
    title: string;
    description: string;
    isSelected: boolean;
    isRead?: boolean;
    onPress?: (navigation: NativeStackNavigationProp<RootStackParamList>) => void;
};

export type Category = {
    id: number;
    name: string;
    description?: string;
    icon: ImageSourcePropType;
};

export type ExpenseCategory = {
    id: number;
    name: string;
    description?: string;
};

export type ExpensePCard = {
    cardholderId: number;
    employeeId: number;
    username: string;
    legalName: string;
    lastName: string;
    firstName: string;
    email: string;
    employeeNumber: number;
    managerEmployeeNumber: number;
    managerEmail: string;
    managerFirstName: string;
    managerLastName: string;
    accountingCodeName: string;
    accountingCodeDescription: string;
    accountingCodeId: number;
    costCenters: string;
    companyId: number;
    companyName: string;
    departmentId: number;
    departmentName: string;
    locations: string;
    isNonEvaUser: boolean;
    lastFourDigits: string;
};

export interface IFormContextDataItem<T> {
    value: T;
    isError: boolean;
    errorMessage?: string;
}

export type HandleDateSelectionType = {
    calendarDate: IFormContext['calendarDate'];
    setCalendarDate: IFormContext['setCalendarDate'];
    setMdyDate: IFormContext['setMdyDate'];
};

// prettier-ignore
export interface IFormContext {
    supplier: IFormContextDataItem<string>;
    amount: IFormContextDataItem<string>;
    mdyDate: IFormContextDataItem<string>;
    description: IFormContextDataItem<string>;
    meal: IFormContextDataItem<string>;
    projectName: IFormContextDataItem<string>;
    isSelectedTax: IFormContextDataItem<boolean>;
    isSelectedShipped: IFormContextDataItem<boolean>;
    isSelectedCharge: IFormContextDataItem<boolean>;
    calendarDate: IFormContextDataItem<string>;
    selectedCategory: IFormContextDataItem<number>;
    isSubmitting: boolean;
    errorMessage: string | null;
    isEditingReceiptDetails: boolean;
    setSupplier: React.Dispatch<React.SetStateAction<IFormContextDataItem<string>>>;
    setAmount: React.Dispatch<React.SetStateAction<IFormContextDataItem<string>>>;
    setMdyDate: React.Dispatch<React.SetStateAction<IFormContextDataItem<string>>>;
    setDescription: React.Dispatch<React.SetStateAction<IFormContextDataItem<string>>>;
    setMeal: React.Dispatch<React.SetStateAction<IFormContextDataItem<string>>>;
    setProjectName: React.Dispatch<React.SetStateAction<IFormContextDataItem<string>>>;
    setIsSelectedTax: React.Dispatch<React.SetStateAction<IFormContextDataItem<boolean>>>;
    setIsSelectedShipped: React.Dispatch<React.SetStateAction<IFormContextDataItem<boolean>>>;
    setIsSelectedCharge: React.Dispatch<React.SetStateAction<IFormContextDataItem<boolean>>>;
    setCalendarDate: React.Dispatch<React.SetStateAction<IFormContextDataItem<string>>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<IFormContextDataItem<number>>>;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
    setIsEditingReceiptDetails: React.Dispatch<React.SetStateAction<boolean>>;
    updateFormValuesFromReceiptTransaction: (transaction: ReceiptTransaction) => void;
    resetFormContext: () => void;
    resetAutofilledFormFields: () => void;
}

export type Notification = {
    id: number;
    isRead: boolean;
    isSelected?: boolean;
    title: string;
    message: string;
    employeeId: number;
    receiptId: number;
    cardholderId: number;
    isPending: boolean;
    dateCreated: string;
    dateUpdated: string;
    type: ReceiptNotificationType;
    receiptTransactionId: number;
};

export type NotificationContextType = {
    notificationCount: number;
    setNotificationCount: (count: number) => void;
    cards: Notification[];
    setCards: (cards: Notification[]) => void;
    lastWeekCards: Notification[];
    setLastWeekCards: (cards: Notification[]) => void;
    expoPushToken: string | null;
    setExpoPushToken: (token: string) => void;
    expoNotification: Notifications.Notification | null;
    error: Error | null;
    isPending: boolean;
    notificationType: number | null;
    setNotificationType: (type: number | null) => void;
    notificationReceipts: ReceiptTransaction[];
    setNotificationReceipts: (receipts: ReceiptTransaction[]) => void;
    notifications: Notification[];
    loadNotifications: () => Promise<void>;
};

export type PCard = {
    id: number;
    name: string;
    status: string;
};

export type Receipt = {
    id: number;
    filePath: string;
    cardholderId: number;
    supplier: string;
    expenseCategoryId: number;
    totalAmount: number;
    purchaseDate: string;
    description: string;
    taxCharged: boolean;
    shippedAnotherState: boolean;
    multipleCompaniesCharged: boolean;
    mealAttendanceCount: number;
    receiptConfidence: number;
    taxAmount: number;
    isMatched: boolean;
    dateCreated: string;
    dateUpdated: string;
    isReceiptRequired: boolean;
    projectName: string;
};

export enum ReceiptNotificationType {
    None = 0,
    UploadReminder = 1,
    ImproveReceipt = 2,
    ExpandDescription = 3,
}

export type ReceiptTransaction = {
    id: number;
    transaction: Transaction;
    receipt: Receipt;
    matchStatus: number;
    receiptStatus: number;
    cardholderId: number;
    supplier: string;
    totalAmount: number;
    taxAmount: number;
    purchaseDate: string;
};

export type ReceiptType = {
    key: string;
    receipt: string;
    receiptId: string;
    supplier: string;
    amount: number;
    transactionDate: string;
    description: string;
    expenseCategory: string;
    multiCo: boolean;
    shipped: boolean;
    taxCharged: boolean;
    status: string;
    user: string;
    company: string;
};

export type ReceiptUploadFile = {
    uid: string;
    blob: Blob;
    fileName: string;
};

export type RootStackParamList = {
    BottomTab: {
        screen: string;
    };
    LoginScreen: { onLoginSuccess: () => void };
    NotificationScreen: undefined;
    TransactionScreen: {
        selectedTransactionTitle?: string;
        receiptID?: number;
    };
    Receipts: {
        selectedTransactionTitle: string;
        selectedReceiptTransactionTitle?: string;
    };
    ReceiptCategories: { image: string | null };
    ReceiptForm: { image: string | null };
    ReceiptFormLong: { image: string | null };
    ReceiptFormReview: { image: string | null };
    TransactionModal: {};
    ReceiptModal: {};
    CategoryEditModal: {};
};

export type SubmittedReceipt = {
    id: number;
    trendimage: ImageSourcePropType;
    title: string;
    amount: string;
    status: string;
    subtitle: string;
};

export type Transaction = {
    id: number;
    supplier: string;
    totalAmount: number;
    taxAmount: number;
    purchaseDate: string;
};

export type UserAccount = {
    email: string;
    employeeNumber: number;
    firstName: string;
    lastName: string;
    name: string;
    windowsUsername: string;
    expenseProEmployeeId: number;
};

export type Users = {
    id: number;
    name: string;
    role: string[];
    pCards: string[];
    formType: string;
};
