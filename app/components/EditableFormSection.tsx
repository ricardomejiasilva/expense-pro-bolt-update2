import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useFormContext } from 'contexts/FormContext';
import CalendarModal from './modals/CalendarModal';
import CategorySection from './CategorySection';
import AutofilledInputs from './AutofilledInputs';
import DescriptionInput from './DescriptionInput';
import SelectableItem from './SelectableItem';
import { RootStackParamList } from 'models/types';
import { useAppContext } from 'contexts/AppContext';
import MealCountShort from './MealCountShort';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';

interface EditableFormSectionProps {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ReceiptModal' | 'TransactionModal'>;
    currentCategory?: number | null;
    fromModal?: boolean;
    setExtraInput?: (value: boolean) => void;
    onInputFocusChange?: (inputType: string, isFocused: boolean) => void;
}

const EditableFormSection: React.FC<EditableFormSectionProps> = ({
    navigation,
    currentCategory = null,
    fromModal = false,
    setExtraInput = () => {},
    onInputFocusChange = () => {},
}) => {
    const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);

    const {
        meal,
        setMeal,
        description,
        setDescription,
        isSelectedTax,
        setIsSelectedTax,
        isSelectedShipped,
        setIsSelectedShipped,
        isSelectedCharge,
        setIsSelectedCharge,
        selectedCategory,
        setSelectedCategory,
    } = useFormContext();

    const { shortForm } = useAppContext();

    useEffect(() => {
        if (currentCategory) {
            setSelectedCategory({
                ...selectedCategory,
                value: currentCategory,
            });
        }
    }, [currentCategory, setSelectedCategory]);

    const handleCategoryPress = () => {
        if (fromModal) {
            navigation.navigate('CategoryEditModal', {
                screen: 'CategoryEditModal',
            });
        } else {
            navigation.goBack();
        }
    };

    return (
        <>
            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <AutofilledInputs setIsCalendarVisible={setIsCalendarVisible} />

                {shortForm ? (
                    <MealCountShort
                        meal={meal}
                        setMeal={setMeal}
                        onInputFocusChange={onInputFocusChange}
                    />
                ) : null}

                <DescriptionInput description={description} setDescription={setDescription} />
                {!shortForm ? (
                    <>
                        <SelectableItem
                            text="Tax Charged on Receipt"
                            isSelected={isSelectedTax.value}
                            onPress={() =>
                                setIsSelectedTax({
                                    ...isSelectedTax,
                                    value: !isSelectedTax.value,
                                })
                            }
                        />
                        <SelectableItem
                            text="Split Charge"
                            isSelected={isSelectedCharge.value}
                            onPress={() =>
                                setIsSelectedCharge({
                                    ...isSelectedCharge,
                                    value: !isSelectedCharge.value,
                                })
                            }
                        />
                        <CategorySection
                            onCategoryPress={handleCategoryPress}
                            setExtraInput={setExtraInput}
                            onInputFocusChange={onInputFocusChange}
                        />
                    </>
                ) : null}
            </View>
            <CalendarModal
                isModalVisible={isCalendarVisible}
                setIsModalVisible={setIsCalendarVisible}
            />
        </>
    );
};

export default EditableFormSection;
