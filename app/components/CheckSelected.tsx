import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Entypo } from '@expo/vector-icons';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';

const CheckSelected = ({ title }: { title: string }) => {
    const [isSelected, setIsSelected] = useState(false);

    const handlePress = () => {
        setIsSelected((prev) => !prev);
    };
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={styles.container}
        >
            <View
                style={[
                    styles.checkContainer,
                    {
                        backgroundColor: isSelected
                            ? Colors.green
                            : Colors.white,
                    },
                ]}
            >
                {isSelected && (
                    <Entypo name="check" size={14} color={Colors.white} />
                )}
            </View>

            <View style={{ marginLeft: RFPercentage(1.6) }}>
                <Text
                    style={{
                        color: Colors.blacktext,
                        fontFamily: FontFamily.regular,
                        fontSize: RFPercentage(1.6),
                    }}
                >
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default CheckSelected;

const styles = StyleSheet.create({
    container: {
        width: '92%',
        borderWidth: RFPercentage(0.1),
        borderRadius: RFPercentage(1),
        borderColor: Colors.lightWhite,
        padding: RFPercentage(1.6),
        paddingVertical: RFPercentage(1.8),
        backgroundColor: Colors.white,
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: RFPercentage(0.4),
    },
    checkContainer: {
        width: RFPercentage(2),
        height: RFPercentage(2),
        borderRadius: RFPercentage(0.3),
        borderWidth: RFPercentage(0.1),
        borderColor: Colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
