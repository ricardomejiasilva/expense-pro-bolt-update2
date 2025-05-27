import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';

const StepIndicator = ({ step }: { step: number }) => {
    const getBarStyle = (barIndex: number) => {
        return [
            styles.baseBar,
            barIndex < step ? styles.filledBar : styles.unfilledBar,
            barIndex > 0 && styles.marginLeft,
        ];
    };

    return (
        <View>
            <Text style={styles.stepText}>
                <Text style={[styles.boldText]}>{`Step ${step}`}</Text>
                {` of 3`}
            </Text>
            <View style={{ flexDirection: 'row' }}>
                {[0, 1, 2].map((index) => (
                    <View key={index} style={getBarStyle(index)} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    stepText: {
        color: Colors.step,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.4),
        marginBottom: RFPercentage(0.5),
    },
    baseBar: {
        width: RFPercentage(6.2),
        height: RFPercentage(0.8),
        borderRadius: RFPercentage(0.1),
    },
    filledBar: {
        backgroundColor: Colors.progress,
    },
    unfilledBar: {
        backgroundColor: Colors.lightWhite,
    },
    marginLeft: {
        marginLeft: RFPercentage(0.3),
    },
    boldText: {
        fontFamily: FontFamily.bold,
        fontWeight: '700',
    },
});

export default StepIndicator;
