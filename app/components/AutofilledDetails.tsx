import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';

import AppLine from './AppLine';
import SidedText from './SidedText';
import StackedText from './StackedText';
import { useFormContext } from 'contexts/FormContext';
import selectCategory from 'models/categories';
import StackedTextGroup from './StackedTextGroup';
import { convertDateYmdToMdy } from 'utils/convertDateUtils';
import { useAppContext } from 'contexts/AppContext';

interface AutofilledDetailsProps {
    long?: boolean;
    expenseCategory?: string;
    description?: string;
}

const AutofilledDetails: React.FC<AutofilledDetailsProps> = ({ long = false }) => {
    const [matchedCategory, setMatchedCategory] = useState<string | null>(null);
    const { supplier, amount, mdyDate, selectedCategory, description } = useFormContext();
    const { selectedReceiptTransaction } = useAppContext();

    useEffect(() => {
        const category = selectCategory.find(
            (category) => category.id === selectedReceiptTransaction?.receipt?.expenseCategoryId
        );
        setMatchedCategory(category ? category.name : null);
    }, [selectedCategory]);

    const displayExtraValues = selectedReceiptTransaction?.receipt?.description || matchedCategory;

    return (
        <View style={styles.container}>
            <Text style={styles.modalTitle}>Receipt Details</Text>
            <StackedText
                label="Supplier"
                value={selectedReceiptTransaction?.receipt?.supplier || supplier.value}
            />

            <StackedTextGroup>
                <StackedText
                    label="Transaction Total"
                    value={
                        `$${selectedReceiptTransaction?.receipt?.totalAmount.toLocaleString(
                            'en-US',
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        )}` || amount.value
                    }
                />
                <StackedText
                    label="Transaction date"
                    value={
                        convertDateYmdToMdy(
                            selectedReceiptTransaction?.receipt?.purchaseDate ?? null
                        ) || mdyDate.value
                    }
                />
            </StackedTextGroup>

            {long && displayExtraValues && (
                <>
                    <View style={{ marginTop: RFPercentage(1) }} />
                    <AppLine />
                    {matchedCategory && (
                        <SidedText label="Expense Category" stacked value={matchedCategory || ''} />
                    )}

                    {selectedReceiptTransaction?.receipt?.description && (
                        <SidedText
                            last
                            stacked
                            label="Short Description of Purchase"
                            value={selectedReceiptTransaction.receipt.description}
                        />
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '92%',
        backgroundColor: '#F5F5F5',
        borderRadius: RFPercentage(0.7),
        padding: RFPercentage(1.9),
        marginTop: RFPercentage(1.9),
        overflow: 'hidden',
    },
    modalTitle: {
        color: Colors.blacktext,
        fontFamily: FontFamily.bold,
        fontSize: RFPercentage(1.6),
        marginBottom: RFPercentage(1),
    },
});

export default AutofilledDetails;
