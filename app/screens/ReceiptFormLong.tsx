import React, { useEffect, useState } from 'react';
import { handleUploadSelection } from 'utils/uploadUtils';
import { handleReceiptFormSubmit } from 'utils/formUtils';
import { useFormContext } from 'contexts/FormContext';
import { useAppContext } from 'contexts/AppContext';
import { type AppContextType, type IFormContext } from 'models/types';
import { type FullReceipt } from 'models/fullReceipt';
import { useOcrContext } from 'contexts/OcrContext';
import { useToastContext } from 'contexts/ToastContext';
import ImageUploader from 'components/ImageUploader';
import UploadModal from 'components/modals/UploadModal';
import CalendarModal from 'components/modals/CalendarModal';
import EditableFormSection from 'components/EditableFormSection';
import MissingImageButton from 'components/MisssingImageButton';
import Alert from 'components/Alert';
import AddReceiptLayout from 'components/layouts/AddReceiptLayout';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReceiptFormLong = ({ navigation, route }: any) => {
    const formContext: IFormContext = useFormContext();
    const appContext: AppContextType = useAppContext();
    const { shortForm } = appContext;
    const ocrContext = useOcrContext();
    const { ocrState } = ocrContext;
    const toastContext = useToastContext();
    const { showToast } = toastContext;
    const { image: initialImage, selectedCategory } = route.params;
    const [image, setImage] = useState(ocrState.ocrImage ?? initialImage);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [extraInput, setExtraInput] = useState(false);
    const [isAttachingReceipt, setIsAttachingReceipt] = useState<boolean | null>(null);

    useEffect(() => {
        const getStorageItem = async () => {
            const isAttaching = await AsyncStorage.getItem('isAttachingReceipt');
            if (isAttaching) {
                setIsAttachingReceipt(isAttaching === 'true');
            }
        };
        getStorageItem();
    }, []);

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
        showToast(`Receipt successfully added.`, 'success', false);
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

    return (
        <AddReceiptLayout
            headerText="Add Receipt"
            step={3}
            subheadText="Enter Receipt Details"
            forwardButtonLabel="Submit Receipt"
            backButtonLabel="Back"
            forwardButtonOnPress={handleSubmit}
            isLoading={formContext.isSubmitting}
            selectedCategory={selectedCategory}
            alertMessage={!!formContext.errorMessage}
            extraInput={extraInput}
            backButtonOnPress={() => navigation.goBack()}
        >
            <ScrollView
                automaticallyAdjustKeyboardInsets={true}
                contentContainerStyle={[
                    {
                        alignItems: 'center',
                        paddingBottom: RFPercentage(7),
                    },
                ]}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{ width: '100%' }}
                keyboardShouldPersistTaps="handled"
            >
                {formContext.errorMessage && (
                    <Alert description={formContext.errorMessage} isDismissable={false} />
                )}

                <KeyboardAvoidingView
                    style={{ flex: 1, width: '100%' }}
                    behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
                    keyboardVerticalOffset={
                        extraInput && formContext.errorMessage
                            ? RFPercentage(-55)
                            : extraInput && !formContext.errorMessage
                            ? RFPercentage(-48)
                            : RFPercentage(-40)
                    }
                >
                    {/* image replace */}
                    {image ? (
                        <ImageUploader
                            image={image}
                            setImage={setImage}
                            updateTransactionDataWithOcrData={true}
                        />
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <MissingImageButton setIsUploadModalVisible={setIsUploadModalVisible} />
                        </View>
                    )}

                    {/* auto filled detail area  */}
                    <EditableFormSection
                        setExtraInput={setExtraInput}
                        navigation={navigation}
                        currentCategory={selectedCategory}
                    />
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
                            shortForm,
                            setImage
                        )
                    }
                />
            </ScrollView>
        </AddReceiptLayout>
    );
};

export default ReceiptFormLong;
