import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DisappearingScrollView from 'components/animations/DisappearingScrollView';
import ExpenseCategoryItem from 'components/ExpenseCategoryItem';
import ModalLayout from 'components/layouts/ModalLayout';
import PrimaryButton from 'components/PrimaryButton';
import SecondaryButton from 'components/SecondaryButton';
import Toast from 'components/Toast';
import Colors from 'config/Colors';
import { FontFamily } from 'config/Fonts';
import { useAppContext } from 'contexts/AppContext';
import { useFormContext } from 'contexts/FormContext';
import { Category, RootStackParamList } from 'models/types';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface CategoryEditModalProps {}

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({}) => {
    type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryEditModal'>;
    const navigation = useNavigation<NavigationProp>();
    const { selectedCategory, setSelectedCategory } = useFormContext();

    const [selectedCategoryCopy, setSelectedCategoryCopy] = useState<number | null>(null);

    useEffect(() => {
        setSelectedCategoryCopy(selectedCategory.value);
    }, [selectedCategory]);

    const handleSubmit = () => {
        if (selectedCategoryCopy != null) {
            setSelectedCategory({ value: selectedCategoryCopy, isError: false });
            navigation.goBack();
        }
    };

    const handleCancel = () => {
        setSelectedCategoryCopy(selectedCategory.value);
        navigation.goBack();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ModalLayout title="Edit Expense Category" onClose={handleCancel}>
                <Toast />

                <EditExpenseCategoryModalContent
                    selectedCategoryCopy={selectedCategoryCopy}
                    setSelectedCategoryCopy={setSelectedCategoryCopy}
                />
                <PrimaryButton
                    text={'Save Changes'}
                    onPress={handleSubmit}
                    containerStyle={styles.button}
                />
                <SecondaryButton
                    text="Cancel"
                    containerStyle={styles.button}
                    onPress={handleCancel}
                />
            </ModalLayout>
        </GestureHandlerRootView>
    );
};

interface EditExpenseCategoryModalContentProps {
    selectedCategoryCopy: number | null;
    setSelectedCategoryCopy: React.Dispatch<React.SetStateAction<number | null>>;
}

const EditExpenseCategoryModalContent: React.FC<EditExpenseCategoryModalContentProps> = ({
    selectedCategoryCopy,
    setSelectedCategoryCopy,
}) => {
    const { categoriesAndIcons } = useAppContext();
    return (
        <>
            <DisappearingScrollView
                contentContainerStyle={{
                    alignItems: 'center',
                    paddingBottom: RFPercentage(1),
                }}
                showsVerticalScrollIndicator={false}
                style={{ width: '100%', height: '70%' }}
            >
                {categoriesAndIcons.map((item: Category, i: number) => (
                    <ExpenseCategoryItem
                        key={i}
                        item={item}
                        selectedCategory={selectedCategoryCopy}
                        handlePress={setSelectedCategoryCopy}
                    />
                ))}
            </DisappearingScrollView>
        </>
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
    },
    header: {
        width: '92%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: RFPercentage(1),
        marginBottom: RFPercentage(1.9),
    },

    modalTitle: {
        color: Colors.blacktext,
        fontFamily: FontFamily.bold,
        fontSize: RFPercentage(1.6),
        marginBottom: RFPercentage(1),
    },
    button: {
        marginTop: RFPercentage(1),
        width: '92%',
        alignItems: 'center',
    },
    buttonStatus: {
        width: '92%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: RFPercentage(2),
    },
    detailsContainer: {
        width: '100%',
        overflow: 'hidden',
        alignItems: 'center',
        marginVertical: RFPercentage(0.9),
    },
});

export default CategoryEditModal;
