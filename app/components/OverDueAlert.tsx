import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import CloseIcon from './svg/CloseIcon';

interface OverDueAlertProps {
    setIsAlertVisible: (visible: boolean) => void;
}

const OverDueAlert: React.FC<OverDueAlertProps> = ({ setIsAlertVisible }) => {
    return (
        <View style={styles.container}>
            <Ionicons name="alert-circle" size={16} color="#52838F" />
            <View style={{ marginLeft: RFPercentage(1.3), width: '80%' }}>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:pcard@clarkinc.biz')}>
                    <Text
                        style={{
                            color: Colors.blacktext,
                            fontFamily: FontFamily.regular,
                            fontSize: RFPercentage(1.6),
                        }}
                    >
                        Email pcard@clarkinc.biz if receipt is more than 60 days old.
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => setIsAlertVisible(false)}
                style={{
                    marginLeft: RFPercentage(1),
                    width: RFPercentage(2),
                    height: RFPercentage(2),
                }}
            >
                <CloseIcon width={12} height={12} />
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
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
export default OverDueAlert;
