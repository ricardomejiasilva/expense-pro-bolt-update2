import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';

interface SidedTextProps {
    label: string;
    value: string;
    last?: boolean;
    amount?: boolean;
    date?: boolean;
    stacked?: boolean;
}

const SidedText = ({
    label,
    value,
    last = false,
    amount = false,
    stacked = false,
}: SidedTextProps) => {
    return (
        <View
            style={[
                styles.container,
                {
                    marginBottom: !last ? RFPercentage(1) : 0,
                    flexDirection: stacked ? 'column' : 'row',
                },
            ]}
        >
            <View style={{ width: '60%' }}>
                <Text
                    style={[
                        {
                            color: Colors.darkgray,
                            fontFamily: FontFamily.regular,
                            fontSize: RFPercentage(1.6),
                        },
                        { marginBottom: stacked ? RFPercentage(0.9) : 0 },
                    ]}
                >
                    {label}
                </Text>
            </View>

            <Text
                style={{
                    color: Colors.blacktext,
                    fontFamily: FontFamily.bold,
                    fontSize: RFPercentage(1.6),
                }}
            >
                {amount ? `${value}` : value}
            </Text>
        </View>
    );
};

export default SidedText;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: RFPercentage(1),
    },
});
