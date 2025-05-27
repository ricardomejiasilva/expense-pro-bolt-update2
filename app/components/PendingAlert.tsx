import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';

interface PendingAlertProps {
    mTop?: number;
    mBottom?: number;
}
const PendingAlert: React.FC<PendingAlertProps> = ({ mTop, mBottom }) => {
    return (
        <View style={[styles.container, { marginTop: mTop, marginBottom: mBottom }]}>
            <Ionicons name="alert-circle" size={26} color={'#52838F'} />
            <View style={styles.content}>
                <Text style={styles.description}>
                    Changes have been saved and are pending review.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '92%',
        flexDirection: 'row',
        borderColor: '#A5C3CA',
        backgroundColor: Colors.blueBackground,
        padding: RFPercentage(1.2),
        borderWidth: RFPercentage(0.1),
        borderRadius: RFPercentage(1),
        alignItems: 'center',
    },
    content: {
        marginHorizontal: RFPercentage(1.3),
        flexShrink: 1,
    },
    description: {
        marginTop: RFPercentage(0.4),
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
    },
});

export default PendingAlert;
