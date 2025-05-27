import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Animated,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import { handleUploadSelection } from '../utils/uploadUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from 'config/Colors';

import Screen from 'components/Screen';
import Header from 'components/Header';
import AppLine from 'components/AppLine';
import PrimaryButton from 'components/PrimaryButton';
import SecondaryButton from 'components/SecondaryButton';
import CalendarModal from 'components/modals/CalendarModal';
import UploadModal from 'components/modals/UploadModal';
import ImageUploader from 'components/ImageUploader';
import TransactionDetails from 'components/TransactionDetails';
import AutofilledSection from 'components/AutofilledInputs';
import DescriptionInput from 'components/DescriptionInput';
import MissingImageButton from 'components/MisssingImageButton';
import AppLoadingWithOverlay from 'components/AppLoadingWithOverlay';
import Alert from 'components/Alert';
import { useFormContext } from 'contexts/FormContext';
import { useAppContext } from 'contexts/AppContext';
import { handleReceiptFormSubmit } from 'utils/formUtils';
import { type Receipt, type AppContextType, type IFormContext } from 'models/types';
import { useOcrContext } from 'contexts/OcrContext';
import { useToastContext } from 'contexts/ToastContext';
import MealCountShort from 'components/MealCountShort';
import { type FullReceipt } from 'models/fullReceipt';

const ReceiptForm = ({ navigation, route }: any) => {
    const formContext: IFormContext = useFormContext();
    const appContext: AppContextType = useAppContext();
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isAttachingReceipt, setIsAttachingReceipt] = useState<boolean | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const isFirstRender = useRef(true);
    const { meal, setMeal, description, setDescription } = formContext;
    const ocrContext = useOcrContext();
    const { ocrState, resetOcrState } = ocrContext;
    const toastContext = useToastContext();
    const { showToast } = toastContext;
    const alertMessage = !!formContext.errorMessage;

    let { image: initialImage } = route.params || {};

    const [image, setImage] = useState(ocrState.ocrImage ?? initialImage);

    const handleSuccess = (_receiptObject: FullReceipt | null) => {
        if (isAttachingReceipt) {
            navigation.navigate('BottomTab', {
                screen: 'TransactionScreen',
            });
        } else {
            navigation.navigate('BottomTab', {
                screen: 'Receipts',
            });
        }
        showToast('Receipt successfully added.', 'success', false);
    };

    const handleSubmit = async () => {
        await handleReceiptFormSubmit({
            formContext,
            appContext,
            ocrContext,
            toastContext,
            image,
            onSuccess: handleSuccess,
        });
    };

    const handleCancel = async () => {
        const isAttaching = await AsyncStorage.getItem('isAttachingReceipt');

        if (isAttaching === 'true') {
            await AsyncStorage.removeItem('isAttachingReceipt');
        }
        resetOcrState();
        formContext.resetFormContext();
        appContext.clearSelectedReceiptTransaction();
        navigation.goBack();
    };

    useEffect(() => {
        const getStorageItem = async () => {
            const isAttaching = await AsyncStorage.getItem('isAttachingReceipt');
            if (isAttaching) {
                setIsAttachingReceipt(isAttaching === 'true');
            }
        };
        getStorageItem();
    }, []);

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (e) => {
            // Scroll to the bottom where DescriptionInput is likely located
            scrollViewRef.current?.scrollTo({
                y: alertMessage
                    ? e.endCoordinates.height + RFPercentage(10)
                    : e.endCoordinates.height + 40,
                animated: true,
            });
        });

        return () => {
            keyboardWillShow.remove();
        };
    }, []);

    return (
        <Screen style={styles.screen}>
            <Header />

            {formContext.isSubmitting && <AppLoadingWithOverlay />}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, width: '100%' }}
            >
                <Animated.ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{
                        alignItems: 'center',
                        paddingBottom: RFPercentage(7),
                    }}
                    showsVerticalScrollIndicator={false}
                    style={{ width: '100%' }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={{
                            width: '92%',
                            marginVertical: RFPercentage(1.3),
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.blacktext,
                                fontFamily: FontFamily.bold,
                                fontSize: RFPercentage(2.2),
                            }}
                        >
                            {isAttachingReceipt ? 'Attach Receipt' : 'Add Receipt'}
                        </Text>
                    </View>
                    <AppLine />

                    {isAttachingReceipt ? (
                        <TransactionDetails />
                    ) : (
                        <View
                            style={{
                                width: '92%',
                                marginVertical: RFPercentage(1.9),
                            }}
                        >
                            <Text
                                style={{
                                    color: Colors.blacktext,
                                    fontFamily: FontFamily.bold,
                                    fontSize: RFPercentage(1.9),
                                }}
                            >
                                Enter Receipt Details
                            </Text>
                        </View>
                    )}

                    {formContext.errorMessage && (
                        <Alert description={formContext.errorMessage} isDismissable={false} />
                    )}

                    {/* image replace */}
                    {image ? (
                        <ImageUploader
                            image={image}
                            setImage={setImage}
                            updateTransactionDataWithOcrData={true}
                        />
                    ) : (
                        <MissingImageButton setIsUploadModalVisible={setIsUploadModalVisible} />
                    )}

                    {/* auto filled detail area  */}
                    <AutofilledSection setIsCalendarVisible={setIsCalendarVisible} />

                    {/* meal area */}
                    <MealCountShort meal={meal} setMeal={setMeal} />

                    <DescriptionInput description={description} setDescription={setDescription} />

                    {/* buttons */}
                    <PrimaryButton
                        text="Submit Receipt"
                        containerStyle={[
                            styles.button,
                            {
                                marginBottom: RFPercentage(1.9),
                                marginTop: RFPercentage(0.9),
                            },
                        ]}
                        onPress={handleSubmit}
                    />
                    <SecondaryButton
                        text="Cancel"
                        onPress={handleCancel}
                        containerStyle={styles.button}
                    />
                </Animated.ScrollView>
            </KeyboardAvoidingView>
            <CalendarModal
                isModalVisible={isCalendarVisible}
                setIsModalVisible={setIsCalendarVisible}
            />
            <UploadModal
                isModalVisible={isUploadModalVisible}
                setIsModalVisible={setIsUploadModalVisible}
                handleUploadSelection={(item) =>
                    handleUploadSelection(
                        item,
                        setIsUploadModalVisible,
                        navigation,
                        false,
                        setImage
                    )
                }
            />
        </Screen>
    );
};

export default ReceiptForm;
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingBottom: RFPercentage(4),
    },
    button: {
        width: '92%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: RFPercentage(1.6),
        color: Colors.blacktext,
        fontFamily: 'System',
        marginTop: RFPercentage(0.8),
    },
    inputContainer: {
        width: '92%',
        marginTop: RFPercentage(1.9),
        backgroundColor: Colors.white,
        borderWidth: RFPercentage(0.1),
        borderRadius: RFPercentage(1),
        borderColor: Colors.borderColor,
        paddingVertical: RFPercentage(1.4),
        paddingHorizontal: RFPercentage(1.9),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mealLabelContainer: {
        width: '65%',
    },
    mealInputContainer: {
        flexDirection: 'row',
        width: '25%',
        backgroundColor: Colors.white,
        borderWidth: RFPercentage(0.1),
        borderColor: Colors.gray,
        paddingHorizontal: RFPercentage(1.6),
        alignItems: 'center',
        borderRadius: RFPercentage(1),
        justifyContent: 'flex-start',
        height: 40,
    },
    labelText: {
        fontSize: RFPercentage(1.6),
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
    },
    errorText: {
        color: Colors.red,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
        marginTop: RFPercentage(0.9),
    },
});
