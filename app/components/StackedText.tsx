import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface StackedTextProps {
    label: string;
    value: string;
}

const StackedText: React.FC<StackedTextProps> = ({ label, value }) => {
    return (
        <View style={styles.item}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
                {value}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: RFPercentage(0.6),
        flex: 1,
    },
    label: {
        color: 'rgba(0, 0, 0, 0.65)',
        fontSize: RFPercentage(1.5),
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: RFPercentage(2.5),
    },
    value: {
        color: '#262626',
        fontSize: RFPercentage(1.5),
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: RFPercentage(2.5),
    },
});

export default StackedText;
