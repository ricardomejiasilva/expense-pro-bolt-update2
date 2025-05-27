import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';

interface AlertProps {
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    isDismissable?: boolean;
    onDismiss?: () => void;
    tabScreen?: boolean;
}

const Alert: React.FC<AlertProps> = ({
    title,
    description,
    isDismissable,
    onDismiss,
    tabScreen,
}) => {
    return (
        <View
            style={[
                styles.container,
                {
                    marginTop: tabScreen ? RFPercentage(1.8) : 0,
                    marginBottom: tabScreen ? 0 : RFPercentage(1.8),
                },
            ]}
        >
            <Ionicons name="alert-circle" size={26} color={Colors.yellow} />
            <View style={styles.content}>
                {title && <Text style={styles.title}>{title}</Text>}
                {description && <Text style={styles.description}>{description}</Text>}
            </View>
            {isDismissable && onDismiss && (
                <TouchableOpacity onPress={onDismiss}>
                    <Ionicons name="close-outline" size={18} color={Colors.blacktext} />
                </TouchableOpacity>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '92%',
        flexDirection: 'row',
        backgroundColor: '#FFFBE6',
        padding: RFPercentage(1.2),
        borderWidth: RFPercentage(0.1),
        borderColor: Colors.darkYellow,
        borderRadius: RFPercentage(1),
        alignItems: 'center',
        marginVertical: RFPercentage(.9),
    },
    content: {
        marginHorizontal: RFPercentage(1.3),
        flexShrink: 1,
    },
    title: {
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.9),
    },
    description: {
        marginTop: RFPercentage(0.4),
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
    },
    buttontext: {
        color: Colors.white,
        fontSize: RFPercentage(1.8),
        fontFamily: FontFamily.regular,
    },
});
export default Alert;
