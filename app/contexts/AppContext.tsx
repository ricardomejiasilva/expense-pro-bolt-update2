import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import {
    ActivePeriod,
    AppContextType,
    Category,
    ExpenseCategory,
    ExpensePCard,
    ReceiptTransaction,
    UserAccount,
} from 'models/types';
import {
    setTokenToStorage,
    loadTokenFromStorage,
    verifyUserAccount,
    fetchExpenseCategoriesList,
    fetchPCardholders,
    getReceiptsForCardholder,
    getActivePeriod,
} from 'utils/appContextUtils';
import Icons from 'config/Icons_temp';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setTokenState] = useState<string>('');
    const [shortForm, setShortForm] = useState(false);
    const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [categoriesAndIcons, setCategoriesAndIcons] = useState<Category[]>([]);
    const [pCards, setPCards] = useState<ExpensePCard[]>([]);
    const [selectedPCard, setSelectedPCard] = useState<ExpensePCard | null>(null);
    const [activePeriod, setActivePeriod] = useState<ActivePeriod | null>(null);
    const [selectedReceiptTransaction, setSelectedReceiptTransaction] =
        useState<ReceiptTransaction | null>(null);
    const [pCardReceipts, setPCardReceipts] = useState<ReceiptTransaction[]>([]);
    const [isPCardReceiptLoading, setIsPCardReceiptLoading] = useState(false);
    const [cardholderId, setCardholderId] = useState(0);
    const [receiptTransactions, setReceiptTransactions] = useState<ReceiptTransaction[]>([]);
    const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
    const [attachReceiptModalVisible, setAttachReceiptModalVisible] = useState(false);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [isAttachingReceipt, setIsAttachingReceipt] = useState(false);
    const [hasLoadingScreenAnimationAlreadyRun, setHasLoadingScreenAnimationAlreadyRun] =
        useState(false);

    const isFetchingReceipts = useRef(false);

    const setToken = (newToken: string, expiresAt?: string) => {
        setTokenToStorage(newToken, setTokenState, expiresAt);
    };

    useEffect(() => {
        loadTokenFromStorage(setTokenState);
        setIsPCardReceiptLoading(true);
    }, []);

    useEffect(() => {
        if (token) {
            verifyUserAccount(setUserAccount, setShortForm);
            fetchExpenseCategoriesList(setCategories);
        }
    }, [token]);

    const categoryIconMap: Record<string, any> = {
        Advertising: Icons.YoutubeLogo,
        'Building/Warehouse': Icons.Buildings,
        'Employee Expense': Icons.Users,
        Freight: Icons.Truck,
        Gas: Icons.Gas,
        IT: Icons.Desktop,
        'Job Cost': Icons.Briefcase,
        Meals: Icons.ForkKnife,
        Travel: Icons.Travel,
        Other: Icons.Other,
    };

    useEffect(() => {
        const mappedCategories = categories.map((category) => ({
            ...category,
            icon: categoryIconMap[category.name] || Icons.Other,
        }));
        setCategoriesAndIcons(mappedCategories);
    }, [categories]);

    useEffect(() => {
        if (userAccount) {
            fetchPCardholders(setPCards, setSelectedPCard);
        } else {
            console.log('User account is null or undefined, please login.');
        }
    }, [userAccount]);

    useEffect(() => {
        if (cardholderId) {
            const matchingPCard = pCards.find((card) => card.cardholderId === cardholderId);
            if (matchingPCard) {
                setSelectedPCard(matchingPCard);
            }
        }
    }, [cardholderId, pCards, selectedReceiptTransaction]);

    const refreshPCardReceipts = useCallback(
        async (setIsLoading = true) => {
            if (!selectedPCard) return;
            if (isFetchingReceipts.current) return;

            isFetchingReceipts.current = true;
            setIsPCardReceiptLoading(setIsLoading);

            try {
                await getReceiptsForCardholder(
                    selectedPCard.cardholderId,
                    setPCardReceipts,
                    setReceiptTransactions
                );
            } catch (error) {
                console.error('Error fetching receipts:', error);
            } finally {
                isFetchingReceipts.current = false;
                setIsPCardReceiptLoading(false);
            }
        },
        [selectedPCard]
    );

    useEffect(() => {
        if (selectedPCard) {
            refreshPCardReceipts();
            getActivePeriod(selectedPCard.cardholderId, setActivePeriod);
        }
    }, [selectedPCard]);

    const quietlyRefreshPCardReceipts = () => {
        refreshPCardReceipts(false);
    };

    const clearSelectedReceiptTransaction = () => {
        setSelectedReceiptTransaction(null);
    };

    return (
        <AppContext.Provider
            value={{
                token,
                setToken,
                userAccount,
                setUserAccount,
                categories,
                setCategories,
                categoriesAndIcons,
                shortForm,
                setShortForm,
                pCards,
                selectedPCard,
                setSelectedPCard,
                pCardReceipts,
                setPCardReceipts,
                quietlyRefreshPCardReceipts,
                cardholderId,
                setCardholderId,
                selectedReceiptTransaction,
                setSelectedReceiptTransaction,
                isPCardReceiptLoading,
                setIsPCardReceiptLoading,
                receiptTransactions,
                clearSelectedReceiptTransaction,
                isTransactionModalVisible,
                setIsTransactionModalVisible,
                attachReceiptModalVisible,
                setAttachReceiptModalVisible,
                isUploadModalVisible,
                setIsUploadModalVisible,
                isAttachingReceipt,
                setIsAttachingReceipt,
                activePeriod,
                setActivePeriod,
                hasLoadingScreenAnimationAlreadyRun,
                setHasLoadingScreenAnimationAlreadyRun,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
