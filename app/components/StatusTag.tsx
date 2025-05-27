import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import { ReceiptTransaction } from 'models/types';
import { ReceiptStatus, ReceiptStatusColors, ReceiptStatusLabels } from 'models/receiptStatus';

interface TagProps {
    item: ReceiptTransaction;
    overridePending?: boolean;
}

const StatusTag: React.FC<TagProps> = ({ item, overridePending = false }) => {
    const status: ReceiptStatus =
        overridePending && item.receiptStatus === ReceiptStatus.Missing
            ? ReceiptStatus.Pending
            : item.receiptStatus;

    if (status === ReceiptStatus.Submitted) {
        return null;
    }

    const [bgColor, borderColor, textColor] = ReceiptStatusColors[status];
    const label = ReceiptStatusLabels[status];

    return (
        <View style={[styles.container, { backgroundColor: bgColor, borderColor: borderColor }]}>
            <Text style={[styles.text, { color: textColor }]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: RFPercentage(1),
        padding: RFPercentage(0.5),
        paddingHorizontal: RFPercentage(0.9),
        borderWidth: RFPercentage(0.16),
        borderRadius: 4,
        alignItems: 'center',
    },
    text: {
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
    },
});

export default StatusTag;
