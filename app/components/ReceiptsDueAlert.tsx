import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import Alert from './Alert';
import Colors from 'config/Colors';
import { FontFamily } from 'config/Fonts';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { getReceiptDueDate, getReceiptStatusCounts } from 'utils/receipthelpers';
import { useAppContext } from 'contexts/AppContext';
import { ReceiptStatus } from 'models/fullReceipt';

const ReceiptsDueAlert: React.FC = ({}) => {
    const { receiptTransactions } = useAppContext();
    const receiptStatusCounts = useMemo(
        () => getReceiptStatusCounts(receiptTransactions),
        [receiptTransactions]
    );

    if (
        !receiptStatusCounts[ReceiptStatus.Missing] ||
        receiptStatusCounts[ReceiptStatus.Missing] === 0
    ) {
        return null;
    }

    return (
        <Alert
            tabScreen
            title={`Receipts due ${getReceiptDueDate()}`}
            description={
                <Text>
                    You have{' '}
                    <Text style={styles.count}>{receiptStatusCounts[ReceiptStatus.Missing]}</Text>{' '}
                    {receiptStatusCounts[ReceiptStatus.Missing] === 1
                        ? 'transaction'
                        : 'transactions'}{' '}
                    missing receipts
                </Text>
            }
        />
    );
};

const styles = StyleSheet.create({
    count: {
        color: Colors.blacktext,
        fontFamily: FontFamily.bold,
        fontSize: RFPercentage(1.6),
    },
});

export default ReceiptsDueAlert;
