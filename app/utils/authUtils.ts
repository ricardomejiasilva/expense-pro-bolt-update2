// authUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import { NavigationProp } from '@react-navigation/native';

interface LogoutOptions {
    navigation: NavigationProp<any>;
    setToken: (token: string, expires?: string) => void;
    setUserAccount: (account: any) => void;
}

export const handleLogout = async ({ navigation, setToken, setUserAccount }: LogoutOptions) => {
    try {
        await clearAuthData();
        setToken('', undefined);
        setUserAccount(null);
        navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
        });
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

export const clearAuthData = async () => {
    try {
        await AsyncStorage.clear;
        await CookieManager.clearAll();
    } catch (error) {
        console.error('Error clearing auth data:', error);
    }
};
