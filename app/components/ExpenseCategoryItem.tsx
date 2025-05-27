import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import Colors from 'config/Colors';
import Icons from 'config/Icons_temp';
import { FontFamily } from 'config/Fonts';
import { useAppContext } from 'contexts/AppContext';

import { Category } from 'models/types';
import PressAndSelectAnimation from './animations/PressAndSelectAnimation';

interface ExpenseCategoryItemProps {
    item: Category;
    selectedCategory: number | null;
    handlePress: (id: number) => void;
}

const ExpenseCategoryItem: React.FC<ExpenseCategoryItemProps> = ({
    item,
    selectedCategory,
    handlePress,
}) => {
    return (
        <PressAndSelectAnimation
            id={item.id}
            onSelect={handlePress}
            isSelected={selectedCategory === item.id}
            wrapperStyle={[styles.categoryContainer]}
            style={[styles.categoryContent]}
        >
            <View
                style={[
                    styles.radioContainer,
                    {
                        borderColor: selectedCategory === item.id ? Colors.green : Colors.gray,
                    },
                ]}
            >
                {selectedCategory === item.id && <View style={styles.radio} />}
            </View>
            <View style={styles.imageContainer}>
                <Image
                    source={item.icon}
                    style={{
                        width: RFPercentage(4),
                        height: RFPercentage(4),
                    }}
                />
            </View>
            <View style={{ marginLeft: RFPercentage(1.6) }}>
                <Text style={[styles.name, selectedCategory === item.id && styles.selectedName]}>
                    {item.name}
                </Text>
                {item.description && (
                    <View style={{ width: RFPercentage(26) }}>
                        <Text style={styles.status}>{item.description}</Text>
                    </View>
                )}
            </View>
        </PressAndSelectAnimation>
    );
};

const styles = StyleSheet.create({
    categoryContainer: {
        borderWidth: 0,
        borderRadius: RFPercentage(1),
        width: '92%',
        backgroundColor: Colors.white,
        marginVertical: 4,
    },
    categoryContent: {
        shadowColor: Platform.OS === 'ios' ? '#000000' : '#A9A9A9',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.03,
        shadowRadius: 1,
        // Shadow for Android
        elevation: 2,
        borderRadius: RFPercentage(1),
        paddingHorizontal: RFPercentage(1.9),
        paddingVertical: RFPercentage(1.2),
        alignItems: 'center',
        flexDirection: 'row',
    },
    radioContainer: {
        width: RFPercentage(2),
        height: RFPercentage(2),
        borderWidth: RFPercentage(0.15),
        borderRadius: RFPercentage(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    radio: {
        backgroundColor: Colors.green,
        width: RFPercentage(1.3),
        height: RFPercentage(1.3),
        borderRadius: RFPercentage(1),
    },
    imageContainer: {
        backgroundColor: Colors.white,
        borderRadius: RFPercentage(0.5),
        padding: RFPercentage(0.9),
        marginLeft: RFPercentage(1.6),
    },
    name: {
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
    },
    selectedName: {
        fontFamily: FontFamily.bold,
        color: Colors.link,
    },
    status: {
        marginTop: RFPercentage(0.5),
        color: Colors.textGray,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.4),
    },
});

export default ExpenseCategoryItem;
