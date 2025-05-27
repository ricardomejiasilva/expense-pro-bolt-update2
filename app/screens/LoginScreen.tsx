import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { RootStackParamList } from 'models/types';
import { useAppContext } from 'contexts/AppContext';
import { FontFamily } from 'config/Fonts';
import { BASE_URL, LOGIN_URL } from 'utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import { handleLogout, clearAuthData } from 'utils/authUtils';
import Colors from 'config/Colors';
import { getLoginWebViewHeaderScript } from 'utils/loginWebViewUtils';
import SvgAppIcon from 'assets/app-icon.svg';

import Screen from 'components/Screen';
import PrimaryButton from 'components/PrimaryButton';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
} from 'react-native-reanimated';

interface WebViewEvent {
    nativeEvent: {
        url: string;
    };
}

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [isWebViewVisible, setIsWebViewVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLogoutWebView, setShowLogoutWebView] = useState(false);
    const {
        setToken,
        setUserAccount,
        hasLoadingScreenAnimationAlreadyRun,
        setHasLoadingScreenAnimationAlreadyRun,
    } = useAppContext();

    const handleCookies = async (retries = 3, delay = 1000) => {
        try {
            for (let attempt = 1; attempt <= retries; attempt++) {
                const cookies = await CookieManager.get(BASE_URL);

                const cookieParts: string[] = [];

                const cookieKeys = Object.keys(cookies).sort();

                cookieKeys.forEach((key) => {
                    if (cookies[key]?.value) {
                        cookieParts.push(`${key}=${cookies[key].value}`);
                    }
                });

                if (cookieParts.length > 0) {
                    const cookieHeader = cookieParts.join('; ');

                    // Store the raw cookie header in AsyncStorage
                    await AsyncStorage.setItem('cookieHeader', cookieHeader);

                    // Store the individual cookies in AsyncStorage
                    await AsyncStorage.setItem(
                        'userCookie',
                        JSON.stringify({
                            cookie: cookieHeader,
                            expiresAt:
                                cookies['ExpensePro.AuthC1']?.expires ||
                                cookies['ExpensePro.Auth']?.expires ||
                                null,
                        })
                    );

                    // Update local state / navigate
                    setToken(cookieHeader, cookies['ExpensePro.AuthC1']?.expires);
                    setIsWebViewVisible(false);
                    navigation.navigate('BottomTab', {
                        screen: 'TransactionScreen',
                    });
                    return;
                } else {
                    console.log(`Attempt ${attempt}: Required cookies missing or incomplete`);
                    if (attempt < retries)
                        await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
            console.log('All retries failed. Cookies not found.');
        } catch (error) {
            console.error('Error handling cookies:', error);
        }
    };

    const onLoadStart = () => {
        setLoading(true);
    };

    const handleLogin = async () => {
        await clearAuthData();
        setIsWebViewVisible(true);
    };

    const onLoadEnd = (event: WebViewEvent) => {
        const currentUrl = event.nativeEvent.url;
        if (currentUrl.startsWith('https://expensepro') && !currentUrl.includes('SignIn')) {
            handleCookies();
        }
        setLoading(false);
    };

    const onLogoutEnd = () => {
        setShowLogoutWebView(false);
        handleLogout({ navigation, setToken, setUserAccount });
        containerOpacity.value = withTiming(0, { duration: 0 });
        containerTop.value = withTiming(100, { duration: 0 });
        setIsWebViewVisible(true);
    };

    const handleMessage = (event: WebViewMessageEvent) => {
        const { data } = event.nativeEvent;
        if (data === 'goBack') {
            setIsWebViewVisible(false);
        }
    };

    const iconScale = useSharedValue(hasLoadingScreenAnimationAlreadyRun ? 0.08 : 100);
    const containerOpacity = useSharedValue(hasLoadingScreenAnimationAlreadyRun ? 0 : 1);
    const containerTop = useSharedValue(hasLoadingScreenAnimationAlreadyRun ? 100 : 0);

    const animatedIcon = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
    }));

    const animatedContainer = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
        top: containerTop.value,
        position: 'relative',
    }));

    useEffect(() => {
        if (!hasLoadingScreenAnimationAlreadyRun) {
            setTimeout(() => {
                // iconScale.value = withSpring(0.08, {
                //     mass: 4,
                //     damping: 5,
                //     stiffness: 50,
                //     overshootClamping: true,
                // });
                iconScale.value = withTiming(0.08, { duration: 2000 });
                setHasLoadingScreenAnimationAlreadyRun(true);
            }, 0);
            return;
        } else {
            containerOpacity.value = withTiming(1, { duration: 800 });
            containerTop.value = withTiming(0, { duration: 800 });
        }
    }, [hasLoadingScreenAnimationAlreadyRun]);

    return (
        <>
            {!isWebViewVisible ? (
                <Screen style={styles.screen}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <LinearGradient
                            colors={['#80BCB1', '#B0D6D0', '#DFEEEC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.gradient}
                        >
                            <Animated.View style={[animatedContainer, styles.container]}>
                                <Animated.View
                                    style={[
                                        animatedIcon,
                                        {
                                            zIndex: 10,
                                            position: 'absolute',
                                            top: -150,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        },
                                    ]}
                                >
                                    <SvgAppIcon width="1024" height="1024" />
                                </Animated.View>

                                <Text style={styles.title}>ExpensePro</Text>
                                <View style={styles.formContainer}>
                                    <PrimaryButton
                                        text="Log In"
                                        onPress={handleLogin}
                                        containerStyle={styles.button}
                                    />
                                </View>
                            </Animated.View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingBottom: RFPercentage(4),
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() =>
                                        Linking.openURL(
                                            'https://www.clarkassociatesinc.biz/policies/terms-of-use/'
                                        )
                                    }
                                >
                                    <Text style={{ color: Colors.link }}>Terms and Conditions</Text>
                                </TouchableOpacity>

                                <Text style={{ color: Colors.link }}> • </Text>

                                <TouchableOpacity
                                    onPress={() =>
                                        Linking.openURL(
                                            'https://www.clarkassociatesinc.biz/policies/privacy-policy/'
                                        )
                                    }
                                >
                                    <Text style={{ color: Colors.link }}>Privacy Policy</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </TouchableWithoutFeedback>
                </Screen>
            ) : (
                <>
                    <WebView
                        source={{ uri: LOGIN_URL }}
                        onLoadStart={onLoadStart}
                        onLoadEnd={onLoadEnd}
                        sharedCookiesEnabled={true}
                        thirdPartyCookiesEnabled={true}
                        injectedJavaScript={getLoginWebViewHeaderScript()}
                        onMessage={handleMessage}
                        onError={(e) => console.error('WebView error: ', e.nativeEvent)}
                        onHttpError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.error('HTTP Error: ', nativeEvent.statusCode);
                        }}
                    />
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                            <Text style={{ marginTop: 10, color: Colors.primary }}>Loading...</Text>
                        </View>
                    )}
                </>
            )}
            {showLogoutWebView && (
                <View style={styles.logoutWebViewContainer}>
                    <WebView
                        source={{
                            uri: `${BASE_URL}/logout`,
                        }}
                        sharedCookiesEnabled={true}
                        thirdPartyCookiesEnabled={true}
                        style={styles.logoutWebview}
                        onLoadEnd={onLogoutEnd}
                    />
                </View>
            )}
        </>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#2E544C',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        zIndex: 2,
        width: '80%',
    },
    title: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: RFPercentage(4.2),
        paddingBottom: RFPercentage(3.5),
        marginTop: RFPercentage(20), // 160 -> RFPercentage(20)
    },
    label: {
        fontSize: RFPercentage(1.6),
        marginBottom: 8,
        color: Colors.black,
        fontFamily: FontFamily.regular,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        color: Colors.black,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: RFPercentage(1.6),
        fontFamily: FontFamily.regular,
    },
    button: {
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: RFPercentage(1.9),
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    logoutWebViewContainer: {
        position: 'absolute',
        width: 0,
        height: 0,
        opacity: 0,
        top: 0,
        left: 0,
    },
    logoutWebview: {
        width: 0,
        height: 0,
    },
});
