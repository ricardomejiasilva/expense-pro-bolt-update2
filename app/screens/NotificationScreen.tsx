import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNotification } from 'contexts/NotificationContext';
import { Notification, RootStackParamList } from 'models/types';
import { FontFamily } from 'config/Fonts';
import { readReceiptNotifications } from 'utils/apis';
import { useAppContext } from 'contexts/AppContext';
import Colors from 'config/Colors';
import Icons from 'config/Icons_temp';

import CloseIcon from 'components/svg/CloseIcon';
import Screen from 'components/Screen';
import PrimaryButton from 'components/PrimaryButton';
import Header from 'components/Header';
import NotificationCard from 'components/NotificationCard';
import DisappearingScrollView from 'components/animations/DisappearingScrollView';

type NotificationScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'TransactionScreen'
>;

interface NotificationScreenProps {
    navigation: NotificationScreenNavigationProp;
}

const NotificationScreen = ({ navigation }: NotificationScreenProps) => {
    const {
        notificationCount,
        setNotificationCount,
        cards,
        setCards,
        lastWeekCards,
        setLastWeekCards,
        notificationReceipts,
    } = useNotification();

    const { setSelectedReceiptTransaction, setCardholderId, setIsTransactionModalVisible, pCards } =
        useAppContext();

    const getButtonLabel = () => {
        const selectedCount =
            cards.filter((card) => card.isSelected).length +
            lastWeekCards.filter((card) => card.isSelected).length;

        if (selectedCount === 0 || selectedCount === cards.length + lastWeekCards.length) {
            return 'Mark All as Read';
        }
        return 'Mark Selected as Read';
    };

    const handleCheckBoxPress = (index: number) => {
        const updatedCards = cards.map((card, i) =>
            i === index ? { ...card, isSelected: !card.isSelected } : card
        );
        setCards(updatedCards);
    };

    const handleLastCheckBoxPress = (index: number) => {
        const updatedLastWeekCards = lastWeekCards.map((card, i) =>
            i === index ? { ...card, isSelected: !card.isSelected } : card
        );
        setLastWeekCards(updatedLastWeekCards);
    };

    const handleCardPress = async (item: Notification) => {
        setCardholderId(item.cardholderId);
        const matchingReceipt = notificationReceipts.find(
            (receipt) => receipt.id === item.receiptTransactionId
        );

        if (matchingReceipt) {
            setSelectedReceiptTransaction(matchingReceipt);
            setIsTransactionModalVisible(true);
            navigation.navigate('TransactionModal', {
                screen: 'TransactionModal',
            });
            if (!item.isRead) {
                await markAsRead(item.id);
            }
        } else {
            Alert.alert('Receipt not found.');
        }
    };

    const markAsRead = async (notificationId?: number) => {
        let selectedIds: number[] = [];

        if (notificationId) {
            selectedIds = [notificationId];
        } else {
            const selectedCardIds = cards.filter((card) => card.isSelected).map((card) => card.id);
            const selectedLastWeekIds = lastWeekCards
                .filter((card) => card.isSelected)
                .map((card) => card.id);

            selectedIds = [...selectedCardIds, ...selectedLastWeekIds];

            if (selectedIds.length === 0) {
                selectedIds = [
                    ...cards.map((card) => card.id),
                    ...lastWeekCards.map((card) => card.id),
                ];
            }
        }

        try {
            if (selectedIds.length === 0) return;

            await readReceiptNotifications(selectedIds);

            const updatedCards = cards.map((card) =>
                selectedIds.includes(card.id) ? { ...card, isRead: true, isSelected: false } : card
            );

            const updatedLastWeekCards = lastWeekCards.map((card) =>
                selectedIds.includes(card.id) ? { ...card, isRead: true, isSelected: false } : card
            );

            setCards([...updatedCards]);
            setLastWeekCards([...updatedLastWeekCards]);
            const newCount = Math.max(notificationCount - selectedIds.length, 0);
            setNotificationCount(newCount);
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
        }
    };

    const getLastFourDigits = (cardholderId: number): string => {
        const matchedPCard = pCards.find((pcard) => pcard.cardholderId === cardholderId);
        return matchedPCard ? matchedPCard.lastFourDigits : '****';
    };

    return (
        <Screen style={styles.screen}>
            <View style={styles.modalLine} />
            <View style={styles.container}>
                <View
                    style={{
                        marginTop: RFPercentage(0.5),
                    }}
                >
                    <Text
                        style={{
                            color: '#262626',
                            fontFamily: FontFamily.bold,
                            fontSize: RFPercentage(2.2),
                        }}
                    >
                        Notifications
                    </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{}}>
                    <CloseIcon />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                }}
            >
                <Text style={styles.email}>
                    Email pcard@clarkinc.biz if you have further questions.
                </Text>
            </View>
            {cards.length === 0 && lastWeekCards.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={Icons.Noevent}
                        style={{
                            width: RFPercentage(22),
                            height: RFPercentage(14),
                        }}
                    />
                    <Text
                        style={{
                            marginTop: RFPercentage(5),
                            fontSize: RFPercentage(1.6),
                            color: Colors.blacktext,
                        }}
                    >
                        You currently have no notifications.
                    </Text>
                </View>
            ) : (
                <>
                    <DisappearingScrollView
                        style={{
                            width: '92%',
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        {cards.length > 0 && (
                            <>
                                <View style={{ width: '92%', marginBottom: 4 }}>
                                    <Text style={styles.weekLabel}>This Week</Text>
                                </View>
                                {cards.map((item: Notification, i: number) => (
                                    <NotificationCard
                                        key={`card-${item.id}`}
                                        item={item}
                                        index={i}
                                        onPress={() => handleCardPress(item)}
                                        handlePress={handleCheckBoxPress}
                                        lastFourDigits={getLastFourDigits(item.cardholderId)}
                                    />
                                ))}
                            </>
                        )}

                        {lastWeekCards.length > 0 && (
                            <>
                                <View style={{ width: '92%' }}>
                                    <Text
                                        style={[styles.weekLabel, { marginTop: RFPercentage(1) }]}
                                    >
                                        Last Week
                                    </Text>
                                </View>
                                {lastWeekCards.map((item: Notification, i: number) => (
                                    <NotificationCard
                                        key={`lastweek-${item.id}`}
                                        item={item}
                                        index={i}
                                        onPress={() => handleCardPress(item)}
                                        handlePress={handleLastCheckBoxPress}
                                        lastFourDigits={getLastFourDigits(item.cardholderId)}
                                    />
                                ))}
                            </>
                        )}
                        <View style={{ height: RFPercentage(14) }} />
                    </DisappearingScrollView>
                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            text={getButtonLabel()}
                            onPress={markAsRead}
                            containerStyle={styles.button}
                        />
                    </View>
                </>
            )}
        </Screen>
    );
};

export default NotificationScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    modalLine: {
        width: 74,
        height: 3,
        backgroundColor: Colors.uploadGray,
        marginTop: RFPercentage(1.4),
    },
    container: {
        width: '92%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: RFPercentage(1.6),
    },
    emptyContainer: {
        width: '92%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderRadius: RFPercentage(1),
        paddingVertical: RFPercentage(23),
        paddingHorizontal: RFPercentage(4),
        marginTop: RFPercentage(2),
    },
    email: {
        marginTop: RFPercentage(0.5),
        marginBottom: RFPercentage(3),
        color: Colors.notificationText,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.5),
        width: '92%',
    },
    weekLabel: {
        color: Colors.notificationText,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.5),
    },
    buttonContainer: {
        backgroundColor: Colors.white,
        width: '100%',
        paddingVertical: RFPercentage(1),
        paddingBottom: RFPercentage(3),
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        alignItems: 'center',
    },
    button: {
        marginVertical: RFPercentage(1),
        width: '92%',
        alignItems: 'center',
    },
});
