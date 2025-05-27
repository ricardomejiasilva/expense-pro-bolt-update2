import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNotification } from 'contexts/NotificationContext';
import { useAppContext } from 'contexts/AppContext';
import { FontFamily } from 'config/Fonts';
import { BASE_URL } from 'utils/constants';
import { handleLogout } from 'utils/authUtils';

import Feather from '@expo/vector-icons/Feather';
import Colors from 'config/Colors';

import HeaderLogo from './svg/HeaderLogo';
import DropdownMenu from './DropDownMenu';
import Bell from './svg/Bell';

interface HeaderProps {
    isPressed?: boolean;
}

const { width, height } = Dimensions.get('window');
const isIphoneSE = Platform.OS === 'ios' && width === 375 && height === 667;

const Header: React.FC<HeaderProps> = ({ isPressed = false }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [showWebView, setShowWebView] = useState(false);
    const navigation = useNavigation<any>();
    const { notificationCount } = useNotification();
    const { setToken, setUserAccount } = useAppContext();

    const handleLogoutClick = async () => {
        setShowWebView(true);
    };

    const onLoadEnd = () => {
        setShowWebView(false);
        handleLogout({ navigation, setToken, setUserAccount });
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <HeaderLogo />
                {showWebView && (
                    <WebView
                        source={{
                            uri: `${BASE_URL}/logout`,
                        }}
                        sharedCookiesEnabled={true}
                        thirdPartyCookiesEnabled={true}
                        style={styles.webview}
                        onLoadEnd={onLoadEnd}
                    />
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            navigation.navigate('NotificationScreen');
                        }}
                        style={[
                            styles.bellContainer,
                            {
                                backgroundColor: isPressed ? '#C4DCE1' : Colors.primary,
                            },
                        ]}
                    >
                        <Bell pressed={isPressed} />
                        {notificationCount > 0 && (
                            <View style={styles.countContainer}>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: RFPercentage(1.2),
                                        fontFamily: FontFamily.bold,
                                    }}
                                >
                                    {notificationCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <View style={{ marginRight: RFPercentage(1) }} />
                    <DropdownMenu
                        visible={menuVisible}
                        onClose={() => setMenuVisible(false)}
                        handleLogout={handleLogoutClick}
                    />

                    <TouchableOpacity
                        style={{
                            backgroundColor: menuVisible ? 'rgb(177,214,208)' : undefined,
                            padding: 2,
                            borderRadius: 4,
                        }}
                        onPress={() => setMenuVisible(true)}
                    >
                        <Feather
                            name="menu"
                            size={22}
                            color={menuVisible ? Colors.black : 'white'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: RFPercentage(1.5),
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? (isIphoneSE ? 28 : 68) : 16,
    },
    content: {
        width: '92%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bellContainer: {
        position: 'relative',
        width: 27,
        height: 27,
        borderRadius: RFPercentage(0.5),
        marginRight: RFPercentage(1.8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    countContainer: {
        position: 'absolute',
        right: 0,
        top: 3,
        backgroundColor: 'red',
        borderRadius: RFPercentage(2),
        borderColor: 'white',
        borderWidth: 1,
        width: 14,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        marginHorizontal: RFPercentage(0.5),
        color: Colors.white,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
    },
    webview: {
        width: 1,
        height: 1,
        opacity: 0,
        position: 'absolute',
    },
});
export default Header;
