import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import { ReceiptNotificationType, ReceiptNotificationLabels } from 'models/fullReceipt';

interface RequestAlertProps {
    type: number;
    mTop?: number;
    mBottom?: number;
}

const RequestAlert: React.FC<RequestAlertProps> = ({ type, mTop, mBottom }) => {
    const getNotificationText = () => {
        const notificationType = type as ReceiptNotificationType;
        const label = ReceiptNotificationLabels[notificationType];

        if (notificationType === ReceiptNotificationType.ImproveReceipt) {
            return `Admin requested to Improve receipt image.`;
        } else {
            return `Admin requested an ${label}.`;
        }
    };

    return (
        <View
            style={[
                styles.container,
                {
                    marginTop: mTop ?? RFPercentage(0.9),
                    marginBottom: mBottom ?? RFPercentage(0.9),
                },
            ]}
        >
            <Ionicons name="alert-circle" size={26} color={Colors.yellow} />
            <View style={styles.content}>
                <Text style={styles.description}>
                    {getNotificationText()}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '92%',
        flexDirection: 'row',
        borderColor: Colors.darkYellow,
        backgroundColor: Colors.yellowBackground,
        padding: RFPercentage(1.2),
        borderWidth: RFPercentage(0.1),
        borderRadius: RFPercentage(1),
        alignItems: 'center',
        marginVertical: RFPercentage(0.9),
    },
    content: {
        marginHorizontal: RFPercentage(1.3),
        flexShrink: 1,
    },
    description: {
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
    },
});

export default RequestAlert;
