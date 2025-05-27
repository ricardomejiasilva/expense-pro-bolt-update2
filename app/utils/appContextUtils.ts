import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    attachExistingReceipt,
    checkUser,
    fetchCardholderActivePeriodInformation,
    fetchExpenseCategories,
    fetchExpenseProCardholders,
    fetchReceiptTransactions,
} from 'utils/apis';
import { ExpenseCategory, ExpensePCard, ReceiptTransaction, UserAccount } from 'models/types';
import { IMAGE_URL } from './constants';
import { hasFlag, UserFlags } from 'models/userFlags';
import { getCleanFilePath } from './getCleanFilePath';

export const setTokenToStorage = async (
    newToken: string,
    setTokenState: (token: string) => void,
    expiresAt?: string
) => {
    try {
        if (newToken) {
            const tokenData = JSON.stringify({
                cookie: newToken,
                expiresAt:
                    expiresAt ||
                    new Date(
                        Date.now() + 13 * 24 * 60 * 60 * 1000 // Default: 13 days
                    ).toISOString(),
            });
            await AsyncStorage.setItem('userCookie', tokenData);
            setTokenState(newToken);
        } else {
            await AsyncStorage.removeItem('userCookie');
            setTokenState('');
        }
    } catch (error) {
        console.error('Failed to set token in AsyncStorage:', error);
    }
};

export const loadTokenFromStorage = async (setTokenState: (token: string) => void) => {
    try {
        const storedData = await AsyncStorage.getItem('userCookie');
        if (storedData) {
            const { cookie, expiresAt } = JSON.parse(storedData);

            if (cookie && expiresAt) {
                const expirationDate = new Date(expiresAt);
                if (expirationDate > new Date()) {
                    setTokenState(cookie);
                } else {
                    await AsyncStorage.removeItem('userCookie');
                }
            }
        }
    } catch (error) {
        console.error('Failed to load token from AsyncStorage:', error);
    }
};

export const handleAttachReceipt = async (
    transactionId: number,
    receiptId: number,
    quietlyRefreshPCardReceipts: () => void,
    onSuccess: () => void,
    onError: () => void
) => {
    const response = await attachExistingReceipt(transactionId, receiptId);

    if (response.error) {
        onError();
    } else {
        quietlyRefreshPCardReceipts();
        onSuccess();
    }
};

export const verifyUserAccount = async (
    setUserAccount: (account: UserAccount) => void,
    setShortForm: (value: boolean) => void
) => {
    try {
        const cookieHeader = await AsyncStorage.getItem('cookieHeader');
        if (!cookieHeader) {
            throw new Error('Authentication cookie not found');
        }
        const response = await checkUser();
        if (response.status === 200 && response.data) {
            setUserAccount(response.data.account);
            if (hasFlag(response.data.flags, UserFlags.ShortForm)) {
                setShortForm(true);
            } else {
                setShortForm(false);
            }
        } else {
            throw new Error('Failed to verify user');
        }
    } catch (error) {
        console.error('Verification failed:', error);
    }
};

export const getActivePeriod = async (
    cardholderId: number,
    setActivePeriod: (data: any) => void
) => {
    try {
        const response = await fetchCardholderActivePeriodInformation(cardholderId);
        if (response.error) {
            console.error('Error fetching active period:', response.error);
            return;
        }
        setActivePeriod(response.data);
    } catch (error) {
        console.error('Unexpected error:', error);
    }
};

export const getReceiptsForCardholder = async (
    cardholderId: number,
    setPCardReceipts?: (transactions: ReceiptTransaction[]) => void,
    setReceiptTransactions?: (transactions: ReceiptTransaction[]) => void
): Promise<ReceiptTransaction[]> => {
    try {
        const response = await fetchReceiptTransactions(cardholderId);

        if (response.error) {
            console.error('getReceiptsForCardholder - Error:', response.error);
            if (setPCardReceipts) setPCardReceipts([]);
            if (setReceiptTransactions) setReceiptTransactions([]);
            return [];
        }

        if (response.data) {
            const receiptTransactions: ReceiptTransaction[] = response.data.map(
                (transaction: any) => {
                    if (transaction.receipt && transaction.receipt.filePath) {
                        const cleanFilePath = getCleanFilePath(transaction.receipt.filePath);
                        if (IMAGE_URL.startsWith('https://expensepro')) {
                            transaction.receipt.filePath = `${IMAGE_URL}${cleanFilePath}`;
                        } else {
                            transaction.receipt.filePath = `${IMAGE_URL}receipts/${cleanFilePath}`;
                        }
                    }
                    return transaction;
                }
            );

            if (setReceiptTransactions) setReceiptTransactions(receiptTransactions);

            const transactionsWithReceipts: ReceiptTransaction[] = receiptTransactions.filter(
                (transaction: ReceiptTransaction) => transaction.receipt
            );

            if (setPCardReceipts) setPCardReceipts(transactionsWithReceipts);

            return receiptTransactions;
        }

        return [];
    } catch (error) {
        console.error('getReceiptsForCardholder - Unexpected error:', error);
        if (setPCardReceipts) setPCardReceipts([]);
        if (setReceiptTransactions) setReceiptTransactions([]);
        return [];
    }
};

export const fetchAllReceipts = async (
    pCards: ExpensePCard[],
    setAllReceipts: (receipts: ReceiptTransaction[]) => void,
    setIsAllReceiptLoading: (loading: boolean) => void
) => {
    if (pCards.length === 0) {
        setAllReceipts([]);
        setIsAllReceiptLoading(false);
        return;
    }

    try {
        setIsAllReceiptLoading(true);

        const receiptPromises = pCards.map(
            (card) =>
                new Promise<ReceiptTransaction[]>((resolve) => {
                    getReceiptsForCardholder(
                        card.cardholderId,
                        (transactionsWithReceipts) => {
                            resolve(transactionsWithReceipts);
                        },
                        () => {}
                    );
                })
        );

        const allReceiptsNested = await Promise.all(receiptPromises);
        const allReceiptTransactions = allReceiptsNested.flat();

        setAllReceipts(allReceiptTransactions);
        setIsAllReceiptLoading(false);
    } catch (error) {
        console.error('Error fetching all receipts:', error);
        setIsAllReceiptLoading(false);
    }
};

export const fetchExpenseCategoriesList = async (
    setCategories: (categories: ExpenseCategory[]) => void
) => {
    try {
        const response = await fetchExpenseCategories();
        if (response.error) {
            throw new Error(`Fetch Category error: ${response.error}`);
        }
        setCategories(response.data || []);
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }
};

export const fetchPCardholders = async (
    setPCards: (pcards: ExpensePCard[]) => void,
    setSelectedPCard: (selectedPCard: ExpensePCard | null) => void
) => {
    try {
        const response = await fetchExpenseProCardholders();
        if (response.error) {
            console.error('Error fetching cardholders:', response.error);
        } else {
            const cardholders = response.data ?? [];
            setPCards(cardholders);
            setSelectedPCard(cardholders.length > 0 ? cardholders[0] : null);
        }
    } catch (error) {
        console.error('Unexpected error fetching cardholders:', error);
    }
};
