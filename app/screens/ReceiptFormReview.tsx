import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageUploader from 'components/ImageUploader';
import { useFormContext } from 'contexts/FormContext';
import AddReceiptLayout from 'components/layouts/AddReceiptLayout';
import { useOcrContext } from 'contexts/OcrContext';
import { useAppContext } from 'contexts/AppContext';
import { ScrollView } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { RootStackParamList } from 'models/types';
import { StackActions } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ReceiptFormReview = ({ route }: any) => {
    const { image: initialImage } = route.params;
    const navigation = useNavigation<NavigationProp>();
    const { ocrState, resetOcrState } = useOcrContext();
    const { resetFormContext } = useFormContext();
    const { clearSelectedReceiptTransaction } = useAppContext();
    const [image, setImage] = useState(ocrState.ocrImage ?? initialImage);

    const navigateToNextScreen = async () => {
        navigation.navigate('ReceiptCategories', { image });
    };

    const handleSubmit = async () => {
        navigateToNextScreen();
    };

    const handleCancel = async () => {
        const isAttaching = await AsyncStorage.getItem('isAttachingReceipt');

        if (isAttaching === 'true') {
            await AsyncStorage.removeItem('isAttachingReceipt');
        }

        resetOcrState();
        resetFormContext();
        clearSelectedReceiptTransaction();

        navigation.dispatch(
            StackActions.replace('BottomTab', {
                screen: 'TransactionScreen',
            })
        );
    };

    return (
        <AddReceiptLayout
            headerText="Add Receipt"
            step={1}
            subheadText="Choose Receipt Image"
            forwardButtonLabel="Next"
            forwardButtonOnPress={handleSubmit}
            backButtonLabel="Cancel"
            backButtonOnPress={handleCancel}
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
                {/* ImageContainer component */}
                <ImageUploader
                    long
                    image={image}
                    setImage={setImage}
                    updateTransactionDataWithOcrData={true}
                />
            </ScrollView>
        </AddReceiptLayout>
    );
};

export default ReceiptFormReview;
