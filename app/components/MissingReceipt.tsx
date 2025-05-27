import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from 'config/Colors';
import BrokenReceiptIcon from './svg/BrokenReceipt';

const MissingReceipt: React.FC = () => {
    return (
        <View style={styles.container}>
            <BrokenReceiptIcon />
            <Text style={styles.text}>Missing Receipt</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.borderColorSecondary,
        borderRadius: 5,
        width: '92%',
    },
    text: {
        fontSize: RFPercentage(1.6),
        color: Colors.blacktext,
    },
});
export default MissingReceipt;
