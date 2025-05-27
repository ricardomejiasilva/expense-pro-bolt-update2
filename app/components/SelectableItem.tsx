import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import CheckMark from './svg/CheckMark';

interface SelectableItemProps {
    text: string;
    isSelected: boolean;
    onPress: () => void;
}

const SelectableItem: React.FC<SelectableItemProps> = ({ text, isSelected, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
            <View
                style={[
                    styles.checkBox,
                    {
                        backgroundColor: isSelected ? Colors.green : Colors.white,
                    },
                ]}
            >
                {isSelected && <CheckMark />}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '92%',
        borderWidth: RFPercentage(0.1),
        borderRadius: RFPercentage(1),
        borderColor: Colors.lightWhite,
        padding: RFPercentage(1.6),
        paddingVertical: RFPercentage(1.8),
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: RFPercentage(0.9),
    },
    checkBox: {
        width: RFPercentage(2),
        height: RFPercentage(2),
        borderRadius: RFPercentage(0.3),
        borderWidth: RFPercentage(0.1),
        borderColor: Colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        marginLeft: RFPercentage(1.6),
    },
    text: {
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
    },
});

export default SelectableItem;
