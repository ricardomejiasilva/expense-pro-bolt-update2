import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface StackedTextGroupProps {
    children: React.ReactNode;
}

const StackedTextGroup: React.FC<StackedTextGroupProps> = ({ children }) => {
    return <View style={styles.group}>{children}</View>;
};

const styles = StyleSheet.create({
    group: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: RFPercentage(1),
        alignSelf: 'stretch',
        marginVertical: RFPercentage(1.04), // 8px to RFPercentage
    },
});

export default StackedTextGroup;
