import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import { useFormContext } from 'contexts/FormContext';
import RightOutlined from './svg/RightOutlined';
import { useAppContext } from 'contexts/AppContext';
import { type ExpenseCategory } from 'models/types';
import PressAnimation from './animations/PressAnimation';

interface CategorySectionProps {
    onCategoryPress: () => void;
    setExtraInput?: (value: boolean) => void;
    onInputFocusChange?: (inputType: string, isFocused: boolean) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
    onCategoryPress,
    setExtraInput = () => {},
    onInputFocusChange = () => {},
}) => {
    const { meal, setMeal, projectName, setProjectName, selectedCategory } = useFormContext();
    const [matchedCategory, setMatchedCategory] = useState<ExpenseCategory | null>(null);
    const [projectNameInputHeight, setProjectNameInputHeight] = useState(40);
    const [secondLine, setSecondLine] = useState(false);
    const { categories } = useAppContext();

    useEffect(() => {
        const category = categories.find((category) => category.id === selectedCategory.value);
        setMatchedCategory(category ? category : null);
    }, [selectedCategory]);

    const isJobCostCategory = matchedCategory?.name.toLowerCase() === 'job cost';
    const isMealsCategory = matchedCategory?.name.toLowerCase() === 'meals';

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <PressAnimation onPress={onCategoryPress} style={styles.categoryTouchable}>
                    <View style={styles.categoryContainer}>
                        <Text style={styles.labelText}>Category (required):</Text>
                        <View style={styles.selectedCategoryContainer}>
                            <Text style={styles.selectedCategoryText}>
                                {matchedCategory?.name ?? 'Select Category'}
                            </Text>
                        </View>
                    </View>
                    <RightOutlined />
                </PressAnimation>

                {isMealsCategory && (
                    <View>
                        <View style={styles.inputContainer}>
                            <View style={styles.mealLabelContainer}>
                                <Text style={styles.labelText}>
                                    Meal Attendance Count (required)
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.mealInputContainer,
                                    {
                                        borderColor: meal.isError ? Colors.red : Colors.gray,
                                    },
                                ]}
                            >
                                <TextInput
                                    onFocus={() => {
                                        onInputFocusChange('mealCount', true);
                                        setExtraInput(true);
                                    }}
                                    onBlur={() => {
                                        onInputFocusChange('mealCount', false);
                                        setExtraInput(false);
                                    }}
                                    onChangeText={(text) => {
                                        setMeal({
                                            value: text,
                                            isError: false,
                                        });
                                    }}
                                    value={meal.value}
                                    placeholder="#"
                                    style={styles.input}
                                    placeholderTextColor={Colors.placeholder}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        {meal.isError && (
                            <Text style={styles.errorText}>Enter attendance count.</Text>
                        )}
                    </View>
                )}

                {isJobCostCategory && (
                    <View>
                        <View style={styles.inputContainer}>
                            <View style={styles.projectLabelContainer}>
                                <Text style={styles.labelText}>Project Name{'\n'}(required)</Text>
                            </View>
                            <View
                                style={[
                                    styles.projectInputContainer,
                                    {
                                        height: Math.max(42, projectNameInputHeight),
                                        borderColor: projectName.isError ? Colors.red : Colors.gray,
                                    },
                                ]}
                            >
                                <TextInput
                                    onFocus={() => {
                                        onInputFocusChange('jobCost', true);
                                        setExtraInput(true);
                                    }}
                                    onBlur={() => {
                                        onInputFocusChange('jobCost', false);
                                        setExtraInput(false);
                                    }}
                                    onChangeText={(text) => {
                                        const trimmed = text.slice(0, 255);
                                        const reachedLimit = text.length >= 255;

                                        setProjectName({
                                            value: trimmed,
                                            isError: reachedLimit,
                                            errorMessage: reachedLimit
                                                ? 'Maximum 255 characters allowed.'
                                                : undefined,
                                        });
                                    }}
                                    value={projectName.value}
                                    placeholder="Enter Project Name"
                                    style={[
                                        styles.jobInput,
                                        {
                                            paddingTop:
                                                Platform.OS === 'ios'
                                                    ? RFPercentage(1.3)
                                                    : RFPercentage(0),
                                            height: Math.max(40, projectNameInputHeight),
                                        },
                                    ]}
                                    placeholderTextColor={Colors.placeholder}
                                    multiline={true}
                                    onContentSizeChange={(event) => {
                                        const { contentSize } = event.nativeEvent;
                                        setProjectNameInputHeight(contentSize.height + 22);
                                        setSecondLine(contentSize.height > 20);
                                    }}
                                    maxLength={255}
                                />
                            </View>
                        </View>
                        {projectName.isError && (
                            <Text style={styles.errorText}>
                                {projectName.errorMessage || 'Enter project name.'}
                            </Text>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '92%',
        backgroundColor: Colors.white,
        borderRadius: RFPercentage(1),
        borderWidth: RFPercentage(0.1),
        marginTop: RFPercentage(0.9),
        borderColor: Colors.borderColorSecondary,
        shadowColor: Platform.OS === 'ios' ? '#000000' : '#A9A9A9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 0.5,
        elevation: 2,
    },
    innerContainer: {
        backgroundColor: Colors.lightgray,
        borderRadius: RFPercentage(1),
        padding: RFPercentage(1.6),
    },
    categoryTouchable: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        color: Colors.red,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
        marginTop: RFPercentage(0.9),
    },
    labelText: {
        fontSize: RFPercentage(1.6),
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
    },
    selectedCategoryContainer: {
        flexDirection: 'row',
        paddingHorizontal: RFPercentage(0.7),
        paddingVertical: RFPercentage(0.5),
        alignItems: 'center',
        borderRadius: RFPercentage(0.5),
    },
    selectedCategoryText: {
        fontSize: RFPercentage(1.6),
        color: Colors.blacktext,
        fontFamily: FontFamily.medium,
    },
    inputContainer: {
        width: '100%',
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
    projectLabelContainer: {
        width: '40%',
    },
    projectInputContainer: {
        flexDirection: 'row',
        width: '60%',
        backgroundColor: Colors.white,
        borderWidth: RFPercentage(0.1),
        borderColor: Colors.gray,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 10 : 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        height: 40,
        position: 'relative',
    },
    input: {
        width: '100%',
    },
    jobInput: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        marginLeft: RFPercentage(1.6),
    },
});

export default CategorySection;
