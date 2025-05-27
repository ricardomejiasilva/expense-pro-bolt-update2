import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    Animated,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useFormContext } from 'contexts/FormContext';
import { useAppContext } from 'contexts/AppContext';
import { useModalContext } from 'contexts/ModalContext';
import { useOcrContext } from 'contexts/OcrContext';
import { useToastContext } from 'contexts/ToastContext';
import { handleReceiptFormSubmit } from 'utils/formUtils';
import { ReceiptStatus } from 'models/receiptStatus';
import { type RootStackParamList, type Notification } from 'models/types';
import { FullReceipt } from 'models/fullReceipt';
import StatusTag from '../StatusTag';
import EditableFormSection from 'components/EditableFormSection';
import AppLoadingWithOverlay from 'components/AppLoadingWithOverlay';
import Alert from 'components/Alert';
import CompleteModalSection from './CompleteModalSection';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import PendingAlert from 'components/PendingAlert';
import RequestAlert from 'components/RequestAlert';
import { useNotification } from 'contexts/NotificationContext';
import Toast from 'components/Toast';
import TransactionDetails from 'components/TransactionDetails';
import MissingImageButton from 'components/MisssingImageButton';
import UploadModal from './UploadModal';
import { handleUploadSelection } from 'utils/uploadUtils';
import ImageUploader from 'components/ImageUploader';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import ModalLayout from 'components/layouts/ModalLayout';
import AppLine from 'components/AppLine';

interface ReceiptModalProps {}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReceiptModal'>;

const ReceiptModal: React.FC<ReceiptModalProps> = () => {
    const navigation = useNavigation<NavigationProp>();
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const appContext = useAppContext();
    const [extraInput, setExtraInput] = useState(false);
    const [isJobCostInputFocused, setIsJobCostInputFocused] = useState(false);
    const [isMealCountFocused, setIsMealCountFocused] = useState(false);
    const formContext = useFormContext();
    const ocrContext = useOcrContext();
    const toastContext = useToastContext();
    const { isPending, notifications, loadNotifications } = useNotification();
    const { resetFormContext } = formContext;
    const { selectedReceiptTransaction, clearSelectedReceiptTransaction, shortForm } = appContext;
    const { ocrState, resetOcrState } = ocrContext;
    const { showToast } = toastContext;
    const { isUploadingMissingReceipt, setIsUploadingMissingReceipt } = useModalContext();

    const displayTransactionDetails =
        selectedReceiptTransaction?.transaction && selectedReceiptTransaction?.receiptStatus !== 3;

    const isNotComplete = selectedReceiptTransaction?.receiptStatus !== ReceiptStatus.Complete;

    const initialImage =
        ocrState.ocrImage && !ocrState.isSubmitting
            ? ocrState.ocrImage
            : selectedReceiptTransaction && selectedReceiptTransaction.receipt
            ? selectedReceiptTransaction.receipt.filePath
            : null;

    const [image, setImage] = useState(ocrState.ocrImage ?? initialImage);

    const alertMessage = !!formContext.errorMessage;

    // Get notifications for current receipt transaction
    const receiptNotifications = notifications
        .filter((n: Notification) => n.receiptTransactionId === selectedReceiptTransaction?.id)
        .sort(
            (a: Notification, b: Notification) =>
                new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        )
        .filter(
            (notification: Notification, index: number, self: Notification[]) =>
                index === self.findIndex((n: Notification) => n.type === notification.type)
        );

    const handleInputFocusChange = (inputType: string, isFocused: boolean) => {
        if (inputType === 'jobCost') {
            setIsJobCostInputFocused(isFocused);
        } else if (inputType === 'mealCount') {
            setIsMealCountFocused(isFocused);
        }
    };

    const getKeyboardOffset = () => {
        if (isJobCostInputFocused) {
            return RFPercentage(-40);
        } else if (isMealCountFocused) {
            return RFPercentage(-36);
        } else if (extraInput && formContext.errorMessage) {
            return RFPercentage(-55);
        } else if (extraInput && !formContext.errorMessage) {
            return RFPercentage(-48);
        } else {
            return RFPercentage(-40);
        }
    };

    const handleClose = () => {
        resetOcrState();
        resetFormContext();
        clearSelectedReceiptTransaction();
        navigation.goBack();
    };

    const handleSuccess = (_receiptObject: FullReceipt | null) => {
        handleClose();
        showToast(
            selectedReceiptTransaction
                ? `Receipt ${selectedReceiptTransaction.id} changes saved.`
                : `Receipt changes saved.`,
            'success',
            false
        );
        loadNotifications();
    };

    const handleSubmit = async () => {
        await handleReceiptFormSubmit({
            formContext,
            appContext,
            ocrContext,
            toastContext,
            image: image as string,
            onSuccess: handleSuccess,
        });
    };

    const renderModalContent = () => {
        if (!selectedReceiptTransaction) {
            return null;
        }

        if (selectedReceiptTransaction.receiptStatus === ReceiptStatus.Complete) {
            return (
                <CompleteModalSection
                    image={image}
                    selectedReceiptTransaction={selectedReceiptTransaction}
                />
            );
        } else {
            return (
                <>
                    {formContext.isSubmitting && <AppLoadingWithOverlay />}
                    <Animated.ScrollView
                        automaticallyAdjustKeyboardInsets={true}
                        ref={scrollViewRef}
                        automaticallyAdjustContentInsets={true}
                        contentContainerStyle={{
                            alignItems: 'center',
                            paddingBottom: RFPercentage(1),
                        }}
                        showsVerticalScrollIndicator={false}
                        style={{ width: '100%', height: '70%' }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <KeyboardAvoidingView
                            style={{ flex: 1, width: '100%' }}
                            behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
                            keyboardVerticalOffset={getKeyboardOffset()}
                        >
                            <View
                                style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {formContext.errorMessage && (
                                    <Alert
                                        description={formContext.errorMessage}
                                        isDismissable={false}
                                    />
                                )}

                                {!image ? (
                                    <MissingImageButton
                                        setIsUploadingMissingReceipt={setIsUploadingMissingReceipt}
                                        setIsUploadModalVisible={setIsUploadModalVisible}
                                    />
                                ) : (
                                    <ImageUploader
                                        image={image}
                                        setImage={(newImage) => setImage(newImage as string)}
                                        updateTransactionDataWithOcrData={true}
                                        runOcrOnMount={false}
                                    />
                                )}

                                <EditableFormSection
                                    navigation={navigation}
                                    fromModal={true}
                                    setExtraInput={setExtraInput}
                                    onInputFocusChange={handleInputFocusChange}
                                />
                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'center',
                                        paddingTop: RFPercentage(1.6),
                                        paddingBottom:
                                            Platform.OS === 'ios'
                                                ? RFPercentage(3.5)
                                                : RFPercentage(0),
                                    }}
                                >
                                    <AppLine />
                                    <PrimaryButton
                                        text="Save Changes"
                                        onPress={handleSubmit}
                                        containerStyle={{
                                            marginTop: RFPercentage(1),
                                            width: '92%',
                                            alignItems: 'center',
                                        }}
                                    />
                                    <SecondaryButton
                                        text="Cancel"
                                        containerStyle={{
                                            width: '92%',
                                            alignItems: 'center',
                                            marginTop: RFPercentage(0.9),
                                        }}
                                        onPress={() => handleClose()}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </Animated.ScrollView>

                    <UploadModal
                        isModalVisible={isUploadModalVisible}
                        setIsModalVisible={setIsUploadModalVisible}
                        handleUploadSelection={(item) =>
                            handleUploadSelection(
                                item,
                                setIsUploadModalVisible,
                                navigation as any,
                                shortForm,
                                setImage
                            )
                        }
                    />
                </>
            );
        }
    };

    return (
        <ModalLayout
            title={`Receipt ${selectedReceiptTransaction?.id}`}
            extra={
                selectedReceiptTransaction && (
                    <StatusTag item={selectedReceiptTransaction} overridePending={true} />
                )
            }
            onClose={handleClose}
        >
            <Toast />
            {isNotComplete && isPending && <PendingAlert mTop={8} />}

            {isNotComplete &&
                !isPending &&
                receiptNotifications.map((notification: Notification, index: number) => (
                    <RequestAlert key={notification.id} type={notification.type} mTop={8} />
                ))}

            {displayTransactionDetails && <TransactionDetails />}
            {renderModalContent()}
        </ModalLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: RFPercentage(1),
        paddingBottom: RFPercentage(5),
        alignItems: 'center',
        height: '92%',
    },
    header: {
        width: '92%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: RFPercentage(1),
        marginBottom: RFPercentage(1.9),
    },
});

export default ReceiptModal;
