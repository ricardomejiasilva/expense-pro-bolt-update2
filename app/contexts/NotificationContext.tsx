import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import type { Notification, NotificationContextType, ReceiptTransaction } from 'models/types';
import { fetchReceiptNotifications } from 'utils/apis';
import { useAppContext } from './AppContext';
import { getReceiptsForCardholder } from 'utils/appContextUtils';

const NotificationContext = createContext<NotificationContextType>({
    notificationCount: 0,
    setNotificationCount: () => {},
    cards: [],
    setCards: () => {},
    lastWeekCards: [],
    setLastWeekCards: () => {},
    notificationReceipts: [],
    setNotificationReceipts: () => {},
    expoPushToken: '',
    setExpoPushToken: () => {},
    expoNotification: null,
    error: null,
    isPending: false,
    notificationType: null,
    setNotificationType: () => {},
    notifications: [],
    loadNotifications: () => Promise.resolve(),
});

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [expoNotification, setExpoNotification] = useState<Notifications.Notification | null>(
        null
    );
    const [error, setError] = useState<Error | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationCount, setNotificationCount] = useState<number>(0);
    const [cards, setCards] = useState<Notification[]>([]);
    const [lastWeekCards, setLastWeekCards] = useState<Notification[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [notificationType, setNotificationType] = useState<number | null>(null); // check if set state is used
    const [notificationReceipts, setNotificationReceipts] = useState<ReceiptTransaction[]>([]);
    const { token, selectedReceiptTransaction, pCards } = useAppContext();

    useEffect(() => {
        if (!selectedReceiptTransaction) {
            setNotificationType(null);
            setIsPending(false);
            return;
        }

        const matchingNotification = notifications.find(
            (notification) => notification.receiptTransactionId === selectedReceiptTransaction.id
        );

        if (matchingNotification) {
            setNotificationType(matchingNotification.type);
            setIsPending(matchingNotification.isPending || false);
        } else {
            setNotificationType(null);
            setIsPending(false);
        }
    }, [selectedReceiptTransaction, notifications]);

    const transformNotifications = (notifications: Notification[]): Notification[] => {
        return notifications.map((notification) => ({
            ...notification,
            isSelected: false,
        }));
    };

    const loadNotifications = async () => {
        try {
            const response = await fetchReceiptNotifications();

            if (response.status !== 200 || !response.data) {
                console.error('Failed to fetch notifications:', response.error, response.status);
                return;
            }
            setNotifications(response.data);

            // Transform notifications
            const transformedNotifications = transformNotifications(response.data);

            // Get time ranges
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const oneMonthAgo = new Date();
            oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

            // Extract relevant Cardholder IDs
            const notificationCardholderIds = new Set(
                transformedNotifications.map((n) => n.cardholderId)
            );

            const matchingCardholderIds = pCards
                .filter((pcard) => notificationCardholderIds.has(pcard.cardholderId))
                .map((pcard) => pcard.cardholderId);

            // Fetch receipts for these cardholders in parallel
            const fetchedReceipts: ReceiptTransaction[] = (
                await Promise.all(
                    matchingCardholderIds.map(async (cardholderId) => {
                        try {
                            return await getReceiptsForCardholder(cardholderId);
                        } catch (error) {
                            console.error(
                                `Error fetching receipts for Cardholder ${cardholderId}:`,
                                error
                            );
                            return [];
                        }
                    })
                )
            ).flat();

            setNotificationReceipts(fetchedReceipts);

            // Filter notifications that match receipt transactions
            const receiptTransactionIds = new Set(fetchedReceipts.map((r) => r.id));

            const filteredNotifications = transformedNotifications.filter((notif) =>
                receiptTransactionIds.has(notif.receiptTransactionId)
            );

            // Separate recent and older notifications
            const recentCards = filteredNotifications.filter(
                (card) => new Date(card.dateCreated) >= oneWeekAgo
            );
            const olderCards = filteredNotifications.filter((card) => {
                const cardDate = new Date(card.dateCreated);
                return cardDate < oneWeekAgo && cardDate >= oneMonthAgo;
            });

            // Set filtered notifications
            setCards(recentCards);
            setLastWeekCards(olderCards);
        } catch (error) {
            console.error('Network request failed:', error);
        }
    };

    useEffect(() => {
        if (token) {
            loadNotifications();
        }
    }, [pCards]);

    useEffect(() => {
        const unreadCount = [...cards, ...lastWeekCards].reduce(
            (acc, card) => acc + (!card.isRead ? 1 : 0),
            0
        );
        setNotificationCount(unreadCount);
    }, [cards, lastWeekCards]);

    return (
        <NotificationContext.Provider
            value={{
                notificationCount,
                setNotificationCount,
                cards,
                setCards,
                lastWeekCards,
                setLastWeekCards,
                expoPushToken,
                setExpoPushToken,
                expoNotification,
                error,
                isPending,
                notificationType,
                setNotificationType,
                notificationReceipts,
                setNotificationReceipts,
                notifications,
                loadNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
