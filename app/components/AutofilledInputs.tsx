import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import TitleField from './TitleField';
import { useFormContext } from 'contexts/FormContext';
import OverDueAlert from './OverDueAlert';
import { useOcrContext } from 'contexts/OcrContext';

interface AutofilledInputsProps {
    setIsCalendarVisible: (visible: boolean) => void;
}

const AutofilledInputs: React.FC<AutofilledInputsProps> = ({ setIsCalendarVisible }) => {
    const [isAlertVisible, setIsAlertVisible] = React.useState(false);
    const { supplier, setSupplier, amount, setAmount, mdyDate, setMdyDate } = useFormContext();
    const { ocrState } = useOcrContext();
    const isFormEditable = !ocrState.isSubmitting;
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const formatCurrencyInput = (text: string): string => {
        // Remove any non-numeric characters except the decimal point
        let newValue = text.replace(/[^0-9.]/g, '');

        // Handle multiple decimal points by keeping only the first one
        const parts = newValue.split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1] || '';

        // If there's a decimal point at the end, keep it
        if (text.endsWith('.')) {
            return `${integerPart}.`;
        }

        // Limit decimal part to 2 places
        const limitedDecimal = decimalPart.slice(0, 2);

        return decimalPart ? `${integerPart}.${limitedDecimal}` : integerPart;
    };
    10;

    const formatDisplayValue = (value: string): string => {
        if (!value) return '';

        const [intPart, decimalPart] = value.split('.');
        const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return `$${decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt}`;
    };

    const validateDateWithin60Days = (
        dateStr: string
    ): { isValid: boolean; errorMessage?: string } => {
        if (!dateStr) {
            return { isValid: false, errorMessage: 'Enter date of purchase.' };
        }

        // Assuming dateStr is in MM-DD-YYYY format
        const [month, day, year] = dateStr.split('-').map(Number);
        if (!month || !day || !year || isNaN(month) || isNaN(day) || isNaN(year)) {
            return { isValid: false, errorMessage: 'Invalid date format. Use MM-DD-YYYY.' };
        }

        const inputDate = new Date(year, month - 1, day);
        const currentDate = new Date('2025-03-13');
        const sixtyDaysAgo = new Date(currentDate);
        sixtyDaysAgo.setDate(currentDate.getDate() - 60);

        if (inputDate < sixtyDaysAgo) {
            return { isValid: false, errorMessage: 'Must be within 60 days.' };
        }

        return { isValid: true };
    };

    const handleDateChange = (text: string) => {
        setMdyDate({
            value: text,
            isError: false,
        });
    };

    const handleAmountBlur = () => {
        const num = Number(amount.value);
        if (!isNaN(num) && amount.value) {
            setAmount({ value: num.toFixed(2), isError: false });
        }
    };

    useEffect(() => {
        // Clear any existing timeout
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Set a new timeout to validate after 500ms of no typing
        debounceTimeout.current = setTimeout(() => {
            if (mdyDate.value) {
                const validation = validateDateWithin60Days(mdyDate.value);
                setMdyDate((prev) => ({
                    ...prev,
                    isError: !validation.isValid,
                    errorMessage: validation.errorMessage,
                }));
                setIsAlertVisible(
                    !validation.isValid && validation.errorMessage === 'Must be within 60 days.'
                );
            } else {
                setIsAlertVisible(false);
            }
        }, 800); // Adjust delay as needed (500ms here)

        // Cleanup timeout on unmount or when mdyDate.value changes
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [mdyDate.value, setMdyDate]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Receipt Details (required) -</Text>
                <Text style={styles.subtitle}>Verify information</Text>
            </View>

            <TitleField
                title="Supplier"
                value={supplier.value}
                onChangeText={(text) => {
                    const reachedLimit = text.length >= 255;
                    const trimmed = text.slice(0, 255);

                    setSupplier({
                        value: trimmed,
                        isError: reachedLimit,
                        errorMessage: reachedLimit ? 'Maximum 255 characters allowed.' : undefined,
                    });
                }}
                error={supplier.isError}
                editable={isFormEditable}
            />
            {supplier.isError && (
                <Text style={styles.errorText}>
                    {supplier.errorMessage || 'Enter supplier name.'}
                </Text>
            )}

            <View style={styles.row}>
                <View style={styles.halfWidth}>
                    <Text style={styles.label}>Transaction Total</Text>
                    <View style={[styles.doublefield, amount.isError && styles.errorBorder]}>
                        <TextInput
                            onChangeText={(text) => {
                                const numericValue = formatCurrencyInput(text);
                                setAmount({ value: numericValue, isError: false });
                            }}
                            value={formatDisplayValue(amount.value)}
                            keyboardType="decimal-pad"
                            placeholder="$ 0.00"
                            placeholderTextColor={Colors.placeholder}
                            style={styles.textInput}
                            editable={isFormEditable}
                            onBlur={handleAmountBlur}
                        />
                    </View>
                    {amount.isError && (
                        <Text style={styles.errorText}>Enter transaction total.</Text>
                    )}
                </View>

                <View style={styles.halfWidth}>
                    <Text style={styles.label}>Date of Purchase</Text>
                    <View style={[styles.doublefield, mdyDate.isError && styles.errorBorder]}>
                        <TextInput
                            onChangeText={handleDateChange}
                            value={mdyDate.value}
                            placeholder="01-01-2024"
                            placeholderTextColor={Colors.placeholder}
                            style={styles.textInput}
                            editable={isFormEditable}
                        />
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => isFormEditable && setIsCalendarVisible(true)}
                            style={styles.calendarIcon}
                        >
                            <Feather name="calendar" size={20} color={Colors.gray} />
                        </TouchableOpacity>
                    </View>
                    {mdyDate.isError && (
                        <Text style={styles.errorText}>
                            {mdyDate.errorMessage || 'Enter date of purchase.'}
                        </Text>
                    )}
                </View>
            </View>
            {isAlertVisible && <OverDueAlert setIsAlertVisible={setIsAlertVisible} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '92%',
        backgroundColor: '#F5F5F5',
        borderRadius: RFPercentage(1),
        padding: RFPercentage(1.9),
        marginTop: RFPercentage(1.9),
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        color: Colors.blacktext,
        fontFamily: FontFamily.bold,
        fontSize: RFPercentage(1.6),
    },
    subtitle: {
        marginHorizontal: RFPercentage(0.5),
        color: Colors.darkgray,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
    },
    errorText: {
        color: Colors.red,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
        marginTop: RFPercentage(0.9),
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: RFPercentage(0.5),
    },
    halfWidth: {
        width: '48%',
    },
    label: {
        marginVertical: RFPercentage(1),
        fontSize: RFPercentage(1.5),
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
    },
    doublefield: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderWidth: RFPercentage(0.1),
        borderColor: Colors.gray,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 10 : 5,
        alignItems: 'center',
        borderRadius: 6,
        justifyContent: 'space-between',
    },
    errorBorder: {
        borderColor: Colors.red,
    },
    textInput: {
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.8),
        flex: 1,
    },
    calendarIcon: {
        marginLeft: RFPercentage(1),
    },
});

export default AutofilledInputs;
