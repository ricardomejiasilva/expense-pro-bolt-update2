import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import { ReceiptTransaction } from 'models/types';
import Colors from 'config/Colors';
import StatusTag from './StatusTag';
import { ReceiptStatus } from 'models/receiptStatus';
import BrokenReceiptOutlined from './svg/BrokenReceiptOutlined';
import { useAppContext } from 'contexts/AppContext';
import PressAnimation from './animations/PressAnimation';
import ReceiptImage from './ReceiptImage';

interface TransactionCardProps {
    transaction: ReceiptTransaction;
    handleTransactionPress: (transaction: ReceiptTransaction) => void;
    handleAttachReceiptPress: (transaction: ReceiptTransaction) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
    transaction,
    handleTransactionPress,
    handleAttachReceiptPress,
}) => {
    const { token } = useAppContext();

    const truncateTitle = (title: string) => {
        if (title.length > 15) {
            return title.substring(0, 15) + '...';
        }
        return title;
    };

    const isReceiptMissing = transaction.receiptStatus === ReceiptStatus.Missing;
    const isPDF = transaction.receipt?.filePath?.toLowerCase().endsWith('.pdf');

    return (
        <PressAnimation
            onPress={() => handleTransactionPress(transaction)}
            wrapperStyle={styles.transactionContainer}
            style={styles.cardContainer}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    maxWidth: '60%',
                }}
            >
                {isReceiptMissing ? (
                    <PressAnimation onPress={() => handleAttachReceiptPress(transaction)}>
                        <Image
                            source={require('../../assets/images/plus-dot.png')}
                            resizeMode="contain"
                            style={{
                                height: 48,
                                width: 48,
                                zIndex: 2,
                            }}
                        />
                    </PressAnimation>
                ) : (
                    <View style={styles.imageContainer}>
                        {transaction.receipt?.filePath ? (
                            <ReceiptImage
                                source={{
                                    uri: transaction.receipt.filePath,
                                    headers: {
                                        Cookie: token ? token : '',
                                    },
                                    cache: 'force-cache',
                                }}
                                resizeMode="contain"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                previewOnly={isPDF}
                                isModal={isPDF}
                                pdfHeight={'100%'}
                            />
                        ) : (
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <BrokenReceiptOutlined />
                                <Text style={styles.text}>Missing Receipt</Text>
                            </View>
                        )}
                    </View>
                )}

                <View style={{ marginLeft: 8 }}>
                    <Text
                        style={{
                            color: '#1E1E1E',
                            fontFamily: FontFamily.bold,
                            fontSize: RFPercentage(1.6),
                        }}
                    >
                        {truncateTitle(transaction.transaction.supplier)}
                    </Text>
                    <Text style={styles.amount}>
                        $
                        {transaction.transaction.totalAmount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </Text>
                </View>
            </View>
            <StatusTag item={transaction} />
        </PressAnimation>
    );
};

export default TransactionCard;

const styles = StyleSheet.create({
    transactionContainer: {
        backgroundColor: Colors.white,
        marginVertical: RFPercentage(0.5),
        padding: 0,
        width: '92%',
    },
    cardContainer: {
        alignItems: 'center',
        backgroundColor: Colors.lightgray,
        borderWidth: 1,
        borderColor: Colors.lightWhite,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: RFPercentage(1.4),
        paddingHorizontal: RFPercentage(1.9),
        ...(Platform.OS === 'ios' && {
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
        }),
    },
    imageContainer: {
        width: 48,
        height: 48,
        backgroundColor: Colors.semiLightGray,
        borderColor: Colors.borderColor,
        borderRadius: 4,
        borderWidth: 1,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: RFPercentage(0.7),
        color: Colors.blacktext,
        marginLeft: RFPercentage(0.3),
    },
    amount: {
        marginTop: RFPercentage(0.8),
        color: Colors.black,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
    },
});
