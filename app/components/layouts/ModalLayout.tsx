import AppLine from 'components/AppLine';
import CloseIcon from 'components/svg/CloseIcon';
import Colors from 'config/Colors';
import { FontFamily } from 'config/Fonts';
import React from 'react';
import {
    View,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    Text,
    TouchableOpacity,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface ModalLayoutProps {
    title: string;
    extra?: React.ReactNode;
    onClose: () => void;
    children: React.ReactNode;
}

const ModalLayout: React.FC<ModalLayoutProps> = ({ title, extra, onClose, children }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.modalLine} />
                <View style={styles.header}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.blacktext,
                                fontFamily: FontFamily.bold,
                                fontSize: RFPercentage(1.9),
                            }}
                        >
                            {title}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        {extra && extra}
                        <TouchableOpacity
                            onPress={onClose}
                            style={{ marginLeft: 22, paddingRight: 8 }}
                        >
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>
                </View>
                <AppLine />
                <View style={{ height: RFPercentage(1) }} />
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
    },
    content: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        height: '100%',
        paddingVertical: RFPercentage(1),
        width: '100%',
    },
    modalLine: {
        width: 74,
        height: 3,
        backgroundColor: Colors.uploadGray,
        marginTop: RFPercentage(0.6),
    },
    header: {
        width: '92%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: RFPercentage(1),
        marginBottom: RFPercentage(1.9),
    },
});

export default ModalLayout;
