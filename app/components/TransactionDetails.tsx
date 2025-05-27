import React from 'react';
import { View, StyleSheet } from 'react-native';
import { convertDateYmdToMdy } from 'utils/convertDateUtils';
import { RFPercentage } from 'react-native-responsive-fontsize';
import StackedText from './StackedText';
import StackedTextGroup from './StackedTextGroup';
import { useAppContext } from 'contexts/AppContext';

const TransactionDetails: React.FC = () => {
    const { selectedReceiptTransaction } = useAppContext();

    const items = selectedReceiptTransaction
        ? [
              { label: 'Supplier', value: selectedReceiptTransaction.supplier ?? '' },
              {
                  label: 'Total',
                  value: selectedReceiptTransaction.totalAmount
                      ? `$${selectedReceiptTransaction.totalAmount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`
                      : '',
              },
              {
                  label: 'Transaction date',
                  value: selectedReceiptTransaction.purchaseDate
                      ? convertDateYmdToMdy(selectedReceiptTransaction.purchaseDate)
                      : '',
              },
          ]
        : [];

    return (
        <View style={styles.container}>
            <StackedTextGroup>
                {items.map((item, index) => (
                    <StackedText key={index} label={item.label} value={item.value} />
                ))}
            </StackedTextGroup>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '92%',
        marginHorizontal: 'auto',
        marginVertical: RFPercentage(1.9),
        borderRadius: RFPercentage(0.7),
        paddingHorizontal: RFPercentage(1.9),
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
    },
});

export default TransactionDetails;
