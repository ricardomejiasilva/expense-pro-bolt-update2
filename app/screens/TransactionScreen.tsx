import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, Animated, Easing } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import Icons from 'config/Icons_temp';
import Screen from '../components/Screen';
import AppLine from '../components/AppLine';
import Header from '../components/Header';
import PCardSelection from '../components/PCardSelection';
import AttachReceiptModal from '../components/modals/AttachReceiptModal';
import TransactionCard from '../components/TransactionCard';
import ReceiptsDueAlert from 'components/ReceiptsDueAlert';
import UploadModal from '../components/modals/UploadModal';
import { handleUploadSelection } from '../utils/uploadUtils';

import { ReceiptTransaction, RootStackParamList } from 'models/types';
import { useAppContext } from 'contexts/AppContext';
import TransactionSkeleton from 'components/SkeletonLoader/TransactionSkeleton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DisappearingScrollView from 'components/animations/DisappearingScrollView';

type BottomTabRouteProp = RouteProp<RootStackParamList, 'BottomTab'>;

interface TransactionScreenProps {
    bottomTabParams?: BottomTabRouteProp['params'];
}

const TransactionScreen: React.FC<TransactionScreenProps> = ({ bottomTabParams }) => {
    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();

    const {
        receiptTransactions,
        setSelectedReceiptTransaction,
        isPCardReceiptLoading,
        isTransactionModalVisible,
        setIsTransactionModalVisible,
        attachReceiptModalVisible,
        setAttachReceiptModalVisible,
        activePeriod,
        isUploadModalVisible,
        setIsUploadModalVisible,
        shortForm,
        isAttachingReceipt,
    } = useAppContext();

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const getDateRangeText = () => {
        if (!activePeriod) return 'Loading...';

        const startDate = new Date(`${activePeriod.lastPeriodStartDate}T00:00:00`);
        const endDate = new Date(`${activePeriod.currentPeriodEndDate}T00:00:00`);

        return `${startDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })} - ${
            endDate.getMonth() === startDate.getMonth()
                ? endDate.getDate()
                : endDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
        }`;
    };

    useEffect(() => {
        if (isTransactionModalVisible || attachReceiptModalVisible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [isTransactionModalVisible, attachReceiptModalVisible]);

    const handleTransactionPress = (transaction: ReceiptTransaction) => {
        setSelectedReceiptTransaction(transaction);
        setIsTransactionModalVisible(true);
        navigation.navigate('TransactionModal', {
            screen: 'TransactionModal',
        });
    };

    const handleAttachReceiptPress = (transaction: ReceiptTransaction) => {
        setSelectedReceiptTransaction(transaction);
        setAttachReceiptModalVisible(true);
    };

    return (
        <Screen style={styles.screen}>
            <Header />
            <PCardSelection />

            <AppLine />

            <ReceiptsDueAlert />

            <View
                style={{
                    width: '92%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: RFPercentage(1.8),
                }}
            >
                <Text
                    style={{
                        color: '#262626',
                        fontFamily: FontFamily.bold,
                        fontSize: RFPercentage(2.2),
                    }}
                >
                    Posted Transactions
                </Text>

                <View style={styles.dateTag}>
                    <Text
                        style={{
                            color: Colors.darkgray,
                            fontFamily: FontFamily.regular,
                            fontSize: RFPercentage(1.9),
                        }}
                    >
                        {getDateRangeText()}
                    </Text>
                </View>
            </View>

            {/* card */}
            <View style={{ marginTop: RFPercentage(1.6) }} />
            {isPCardReceiptLoading ? (
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <TransactionSkeleton />
                </View>
            ) : receiptTransactions.some((item) => item.transaction) ? (
                <DisappearingScrollView
                    contentContainerStyle={{
                        alignItems: 'center',
                        paddingBottom: RFPercentage(5),
                    }}
                    showsVerticalScrollIndicator={false}
                    style={{ width: '100%' }}
                >
                    {receiptTransactions
                        .filter((item) => item.transaction)
                        .map((item, i) => (
                            <TransactionCard
                                key={i}
                                transaction={item}
                                handleTransactionPress={handleTransactionPress}
                                handleAttachReceiptPress={handleAttachReceiptPress}
                            />
                        ))}
                </DisappearingScrollView>
            ) : (
                <View style={styles.emptyContainer}>
                    <Image
                        source={Icons.Noevent}
                        style={{
                            width: RFPercentage(16),
                            height: RFPercentage(10),
                        }}
                    />
                    <Text
                        style={{
                            marginTop: RFPercentage(1),
                            fontSize: RFPercentage(1.6),
                            color: Colors.blacktext,
                        }}
                    >
                        You currently have no
                    </Text>
                    <Text style={styles.emptySubText}>posted transactions this period.</Text>
                </View>
            )}

            <AttachReceiptModal
                isModalVisible={attachReceiptModalVisible}
                setIsModalVisible={setAttachReceiptModalVisible}
            />

            <UploadModal
                isModalVisible={isUploadModalVisible}
                setIsModalVisible={setIsUploadModalVisible}
                handleUploadSelection={(item) =>
                    handleUploadSelection(
                        item,
                        setIsUploadModalVisible,
                        navigation,
                        shortForm,
                        null,
                        isAttachingReceipt
                    )
                }
            />
        </Screen>
    );
};

export default TransactionScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    dateTag: {
        marginLeft: RFPercentage(1),
        backgroundColor: 'rgb(235, 235, 235)',
        paddingVertical: RFPercentage(0.2),
        paddingHorizontal: RFPercentage(0.9),
        borderRadius: 4,
        alignItems: 'center',
    },
    emptyContainer: {
        width: '92%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: RFPercentage(0.15),
        borderColor: Colors.lightWhite,
        borderRadius: RFPercentage(1),
        height: '67%',
        paddingHorizontal: RFPercentage(4),
    },
    emptySubText: {
        marginTop: RFPercentage(0.9),
        marginBottom: RFPercentage(6),
        textAlign: 'center',
        fontSize: RFPercentage(1.6),
        color: Colors.blacktext,
    },
});
