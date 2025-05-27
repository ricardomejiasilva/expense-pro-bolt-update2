import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AddReceiptLayout from 'components/layouts/AddReceiptLayout';
import { useToastContext } from 'contexts/ToastContext';
import DisappearingScrollView from 'components/animations/DisappearingScrollView';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useAppContext } from 'contexts/AppContext';
import { Category } from 'models/types';
import ExpenseCategoryItem from 'components/ExpenseCategoryItem';

type RootStackParamList = {
    ReceiptCategories: { image: string };
    ReceiptFormLong: { selectedCategory: number; image: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReceiptCategories'>;

const ReceiptCategories = ({ route }: any) => {
    const { image } = route.params;
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const navigation = useNavigation<NavigationProp>();
    const { showToast } = useToastContext();
    const { categoriesAndIcons } = useAppContext();

    const handleNext = () => {
        if (selectedCategory) {
            navigation.navigate('ReceiptFormLong', {
                selectedCategory,
                image,
            });
        } else {
            showToast('Select an expense category.', 'error', false);
        }
    };

    return (
        <AddReceiptLayout
            headerText="Add Receipt"
            step={2}
            subheadText="Select Expense Category"
            forwardButtonLabel="Next"
            forwardButtonOnPress={handleNext}
            backButtonLabel="Back"
            backButtonOnPress={() => navigation.goBack()}
        >
            <DisappearingScrollView
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
                {categoriesAndIcons.map((item: Category, i: number) => (
                    <ExpenseCategoryItem
                        key={i}
                        item={item}
                        selectedCategory={selectedCategory}
                        handlePress={setSelectedCategory}
                    />
                ))}
            </DisappearingScrollView>
        </AddReceiptLayout>
    );
};

export default ReceiptCategories;
