import React, { useEffect, useState } from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Text, Platform, View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { handleUploadSelection } from 'utils/uploadUtils';
import { requestPushNotificationsAsync } from 'utils/registerNotifications';
import { useAppContext } from 'contexts/AppContext';
import { RootStackParamList } from 'models/types';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import { handleLogout } from 'utils/authUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TransactionScreen from '../screens/TransactionScreen';
import ReceiptScreen from '../screens/ReceiptScreen';
import TransactionIcon from 'components/svg/TransactionIcon';
import ReceiptIcon from 'components/svg/ReceiptIcon';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import UploadPopover from 'components/UploadPopover';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type BottomTabRouteProp = RouteProp<RootStackParamList, 'BottomTab'>;

const Tab = createBottomTabNavigator();
const EmptyScreen: React.FC = () => {
    return null;
};

const BottomTab: React.FC = () => {
    const [isUploadVisible, setIsUploadVisible] = useState(false);
    const { shortForm, setToken, setUserAccount } = useAppContext();
    const route = useRoute<BottomTabRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const TransactionScreenComponent: React.FC = () => {
        return <TransactionScreen bottomTabParams={route.params} />;
    };

    const ReceiptScreenComponent: React.FC = () => {
        return <ReceiptScreen bottomTabParams={route.params} />;
    };

    useEffect(() => {
        AsyncStorage.getItem('pushToken').then((token) => {
            if (!token) {
                requestPushNotificationsAsync();
            }
        });

        // Redirect to LoginScreen if cookies are cleared
        const checkAuth = async () => {
            const storedCookie = await AsyncStorage.getItem('userCookie');
            if (!storedCookie) {
                handleLogout({ navigation, setToken, setUserAccount });
            }
        };
        checkAuth();
    }, [navigation]);

    // Add Receipt animations
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    }));

    const handleAddReceiptPressIn = () => {
        scale.value = withTiming(0.96, { duration: 200 });
    };

    const handleAddReceiptPressOut = () => {
        scale.value = withTiming(1, { duration: 100 }, () => {
            runOnJS(setIsUploadVisible)(!isUploadVisible);
        });
    };

    useEffect(() => {
        // Ensure state and icon rotation are set correctly together
        if (isUploadVisible) {
            rotation.value = withTiming(45, { duration: 300 });
        } else {
            rotation.value = withTiming(0, { duration: 300 });
        }
    }, [isUploadVisible]);

    if (!isLoggedIn) {
        return null; // Render nothing while redirecting
    }
    return (
        <>
            <Tab.Navigator
                initialRouteName="HomeScreen"
                screenOptions={{
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarStyle: {
                        height: Platform.OS === 'ios' ? wp('20%') : wp('18%'),
                        padding: Platform.OS === 'ios' ? 20 : 5,
                        backgroundColor: '#fff',
                        shadowColor: '#000',
                        shadowOffset: { width: -1, height: 10 },
                        shadowOpacity: 0.5,
                        shadowRadius: 10,
                        elevation: 15,
                    },
                }}
            >
                <Tab.Screen
                    name="TransactionScreen"
                    component={TransactionScreenComponent}
                    options={{
                        tabBarIcon: ({ focused }: { focused: boolean }) => {
                            return (
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <TransactionIcon width={24} height={24} focused={focused} />
                                    <Text
                                        style={[
                                            styles.text,
                                            {
                                                color: focused ? Colors.green : Colors.darkgray,
                                            },
                                        ]}
                                    >
                                        Transactions
                                    </Text>
                                    {focused ? <View style={styles.transactionLine} /> : null}
                                </View>
                            );
                        },
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={EmptyScreen}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return (
                                <>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPressIn={handleAddReceiptPressIn}
                                        onPressOut={handleAddReceiptPressOut}
                                        style={{
                                            top: Platform.OS === 'ios' ? -25 : -27,
                                            alignItems: 'center',
                                            zIndex: 20,
                                        }}
                                    >
                                        <View style={styles.plusContainer}>
                                            <Animated.View
                                                style={[
                                                    styles.plusBackground,
                                                    animatedStyle,
                                                    {
                                                        backgroundColor: focused
                                                            ? Colors.blue
                                                            : Colors.primary,
                                                    },
                                                ]}
                                            >
                                                <FontAwesome6
                                                    name="plus"
                                                    size={40}
                                                    color={Colors.white}
                                                />
                                            </Animated.View>
                                        </View>
                                        <Text
                                            style={[
                                                styles.text,
                                                {
                                                    color: focused ? Colors.green : Colors.darkgray,
                                                },
                                            ]}
                                        >
                                            Add Receipt
                                        </Text>
                                    </TouchableOpacity>

                                    <UploadPopover
                                        isVisible={isUploadVisible}
                                        onSelect={(item) => {
                                            handleUploadSelection(
                                                item,
                                                setIsUploadVisible,
                                                navigation,
                                                shortForm
                                            );
                                        }}
                                    />
                                </>
                            );
                        },
                    }}
                />

                <Tab.Screen
                    name="Receipts"
                    component={ReceiptScreenComponent}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return (
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            marginBottom:
                                                Platform.OS === 'ios'
                                                    ? RFPercentage(0)
                                                    : RFPercentage(0.4),
                                        }}
                                    >
                                        <ReceiptIcon width={24} height={24} focused={focused} />
                                    </View>

                                    <Text
                                        style={[
                                            styles.text,
                                            {
                                                color: focused ? Colors.green : Colors.darkgray,
                                                marginTop:
                                                    Platform.OS === 'ios'
                                                        ? RFPercentage(0.4)
                                                        : RFPercentage(0),
                                            },
                                        ]}
                                    >
                                        Receipts
                                    </Text>
                                    {focused ? <View style={styles.transactionLine} /> : null}
                                </View>
                            );
                        },
                    }}
                />
            </Tab.Navigator>
        </>
    );
};

const styles = StyleSheet.create({
    plusContainer: {
        borderWidth: RFPercentage(2),
        borderColor: 'transparent',
        width: Platform.OS === 'ios' ? RFPercentage(8) : 78,
        height: Platform.OS === 'ios' ? RFPercentage(8) : 78,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Platform.OS === 'ios' ? 6 : 1,
    },
    plusBackground: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Platform.OS === 'ios' ? 72 : 72,
        height: Platform.OS === 'ios' ? 72 : 72,
        borderRadius: RFPercentage(5),
        paddingLeft: RFPercentage(0.2),
        backgroundColor: Colors.primary,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 1, // Android drop shadow
    },
    text: {
        marginBottom: RFPercentage(0.3),
        marginTop: RFPercentage(0.4),
        fontFamily: FontFamily.light,
        fontSize: RFPercentage(1.4),
    },
    transactionLine: {
        width: RFPercentage(8.6),
        height: RFPercentage(0.2),
        backgroundColor: Colors.green,
        borderRadius: RFPercentage(1),
    },
    receiptLine: {
        marginTop: RFPercentage(0.6),
        width: RFPercentage(8.6),
        height: RFPercentage(0.2),
        backgroundColor: Colors.green,
        borderRadius: RFPercentage(1),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
export default BottomTab;
