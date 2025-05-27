import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from 'config/Colors';

import AppLine from 'components/AppLine';
import TransactionDetails from 'components/TransactionDetails';
import PrimaryButton from 'components/PrimaryButton';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface TransactionModalMissingContentProps {
    handleAttach: () => void;
}

const TransactionModalMissingContent: React.FC<TransactionModalMissingContentProps> = ({
    handleAttach,
}) => (
    <View
        style={{
            width: '100%',
            overflow: 'hidden',
            alignItems: 'center',
        }}
    >
        <TransactionDetails />
        <AppLine />
        <PrimaryButton
            text="Attach Receipt"
            onPress={handleAttach}
            containerStyle={styles.buttonStatus}
        />
    </View>
);

const styles = StyleSheet.create({
    buttonStatus: {
        width: '92%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: RFPercentage(2),
    },
});

export default TransactionModalMissingContent;
