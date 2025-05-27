import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from 'config/Colors';
import { FontFamily } from 'config/Fonts';

interface MealCountShortProps {
    meal: { value: string; isError: boolean };
    setMeal: React.Dispatch<React.SetStateAction<{ value: string; isError: boolean }>>;
    onInputFocusChange?: (inputType: string, isFocused: boolean) => void;
}

const MealCountShort: React.FC<MealCountShortProps> = ({
    meal,
    setMeal,
    onInputFocusChange = () => {},
}) => {
    return (
        <View>
            <View style={styles.inputContainer}>
                <View style={styles.mealLabelContainer}>
                    <Text style={styles.labelText}>
                        Meal Attendance Count{'\n'}
                        (if applicable)
                    </Text>
                </View>
                <View style={styles.mealInputContainer}>
                    <TextInput
                        onFocus={() => onInputFocusChange('mealCount', true)}
                        onBlur={() => onInputFocusChange('mealCount', false)}
                        onChangeText={(text) => {
                            setMeal({ value: text, isError: false });
                        }}
                        value={meal.value}
                        placeholder="#"
                        style={{ width: '100%' }}
                        placeholderTextColor={Colors.placeholder}
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );
};
export default MealCountShort;

const styles = StyleSheet.create({
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
});
