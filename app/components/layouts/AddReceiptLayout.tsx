import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import Screen from 'components/Screen';
import Header from 'components/Header';
import AppLine from 'components/AppLine';
import PrimaryButton from 'components/PrimaryButton';
import SecondaryButton from 'components/SecondaryButton';
import StepIndicator from 'components/Steps';
import AppLoadingWithOverlay from 'components/AppLoadingWithOverlay';
import TransactionDetails from 'components/TransactionDetails';
import { useAppContext } from 'contexts/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddReceiptLayoutProps {
    headerText: string;
    step: number;
    subheadText: string;
    children: React.ReactNode;
    forwardButtonLabel: string;
    forwardButtonOnPress: () => any;
    backButtonLabel: string;
    backButtonOnPress: () => any;
    isLoading?: boolean;
    selectedCategory?: number;
    extraInput?: boolean;
    alertMessage?: boolean;
}

const AddReceiptLayout: React.FC<AddReceiptLayoutProps> = ({
    headerText,
    step,
    subheadText,
    children,
    forwardButtonLabel = 'Next',
    forwardButtonOnPress,
    backButtonLabel = 'Back',
    backButtonOnPress,
    isLoading = false,
}) => {
    const { selectedReceiptTransaction } = useAppContext();
    const [isAttachingReceipt, setIsAttachingReceipt] = useState(false);

    useEffect(() => {
        const getStorageItem = async () => {
            const isAttaching = await AsyncStorage.getItem('isAttachingReceipt');
            if (isAttaching) {
                setIsAttachingReceipt(isAttaching === 'true');
            }
        };
        getStorageItem();
    }, []);

    return (
        <Screen style={styles.screen}>
            <Header />

            {/* loading state */}
            {isLoading && <AppLoadingWithOverlay />}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, width: '100%' }}
            >
                {/* header and subhead */}
                <View style={[styles.header, { marginBottom: isAttachingReceipt ? 0 : null }]}>
                    <View>
                        <Text
                            style={{
                                color: Colors.blacktext,
                                fontFamily: FontFamily.bold,
                                fontSize: RFPercentage(2.2),
                            }}
                        >
                            {isAttachingReceipt ? 'Attach Receipt' : headerText}
                        </Text>
                    </View>

                    <StepIndicator step={step} />
                </View>

                {!isAttachingReceipt ? (
                    <>
                        <AppLine />

                        <View
                            style={{
                                width: '92%',
                                marginVertical: RFPercentage(1.6),
                            }}
                        >
                            <View
                                style={{
                                    width: '80%',
                                    paddingLeft: RFPercentage(1.9),
                                }}
                            >
                                <Text
                                    style={{
                                        color: Colors.blacktext,
                                        fontFamily: FontFamily.bold,
                                        fontSize: RFPercentage(1.9),
                                    }}
                                >
                                    {subheadText}
                                </Text>
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={{ width: '100%', alignItems: 'center', marginBottom: 24 }}>
                        <TransactionDetails />
                        <AppLine />
                    </View>
                )}

                {/* child content */}

                {children}

                {/* navigation buttons */}
            </KeyboardAvoidingView>
            <View style={styles.buttonContainer}>
                <SecondaryButton
                    text={backButtonLabel}
                    onPress={backButtonOnPress}
                    containerStyle={styles.button}
                />

                <PrimaryButton
                    text={forwardButtonLabel}
                    onPress={forwardButtonOnPress}
                    containerStyle={styles.button}
                />
            </View>
        </Screen>
    );
};

export default AddReceiptLayout;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    header: {
        width: '100%',
        marginVertical: Platform.OS === 'ios' ? RFPercentage(1.3) : RFPercentage(1.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: RFPercentage(1.9),
        paddingRight: RFPercentage(2.2),
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 0,
        backgroundColor: Colors.white,
        paddingVertical: RFPercentage(1.9),
        paddingHorizontal: RFPercentage(1.9),
        paddingBottom: Platform.OS === 'ios' ? RFPercentage(4.5) : RFPercentage(1.9),
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 5,
        borderTopWidth: Platform.OS === 'android' ? 1 : 0,
        borderTopColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.1)' : 'transparent',
    },
    button: {
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
