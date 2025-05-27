import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import CloseIcon from './svg/CloseIcon';

interface CompletedAlertProps {
    setIsAlertVisible: (visible: boolean) => void;
}

const CompletedAlert: React.FC<CompletedAlertProps> = ({
    setIsAlertVisible,
}) => {
    return (
        <View style={styles.container}>
            <Ionicons name="alert-circle" size={26} color="#52838F" />
            <View style={{ marginLeft: RFPercentage(1.3), width: '80%' }}>
                <Text
                    style={{
                        color: Colors.blacktext,
                        fontFamily: FontFamily.regular,
                        fontSize: RFPercentage(1.6),
                    }}
                >
                    Receipt is attached to a transaction that is complete
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => setIsAlertVisible(false)}
                style={{
                    marginLeft: RFPercentage(1),
                    width: RFPercentage(2),
                    height: RFPercentage(2),
                }}
            >
                <CloseIcon />
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '92%',
        flexDirection: 'row',
        backgroundColor: '#E2F2F8',
        padding: RFPercentage(1.2),
        borderWidth: RFPercentage(0.1),
        borderColor: '#A5C3CA',
        borderRadius: RFPercentage(1),
        alignItems: 'center',
        marginTop: RFPercentage(1.6),
    },
});
export default CompletedAlert;
