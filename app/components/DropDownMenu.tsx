import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Toast from 'components/Toast';
import Colors from 'config/Colors';
import PressAnimation from './animations/PressAnimation';

interface DropdownMenuProps {
    visible: boolean;
    onClose: () => void;
    onReferenceGuide?: () => void;
    handleLogout: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ visible, onClose, handleLogout }) => {
    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <Toast />
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.menuContainer}>
                    {/* <TouchableOpacity
                      style={styles.menuItem}
                      onPress={onReferenceGuide}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.menuText}>Reference Guide</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} /> */}

                    <PressAnimation style={styles.menuItem} onPress={handleLogout}>
                        <Text style={styles.menuText}>Log Out</Text>
                    </PressAnimation>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        top: RFPercentage(3.5),
    },
    menuContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? RFPercentage(8) : RFPercentage(1.8),
        right: RFPercentage(2),
        width: RFPercentage(25),
        backgroundColor: 'white',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 5,
    },
    menuItem: {
        paddingVertical: RFPercentage(1.5),
        paddingHorizontal: RFPercentage(2),
    },
    menuText: {
        fontSize: RFPercentage(1.8),
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
    },
    divider: {
        height: 1,
        backgroundColor: '#F5F5F5',
        width: '100%',
    },
});

export default DropdownMenu;
