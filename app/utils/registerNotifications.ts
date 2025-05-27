import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted.');
        return;
    }

    const expoConfig = Constants.expoConfig;
    if (!expoConfig || !expoConfig.extra || !expoConfig.extra.eas) {
        console.log('Expo config not found.');

        return;
    }

    const token = (
        await Notifications.getExpoPushTokenAsync({
            projectId: expoConfig.extra.eas.projectId,
        })
    ).data;

    return token;
}

export const requestPushNotificationsAsync = async () => {
    const existingToken = await AsyncStorage.getItem('notificationToken');
    if (!existingToken) {
        registerForPushNotificationsAsync().then(async (token) => {
            if (!token) {
                return;
            }

            if (existingToken !== token) {
                await AsyncStorage.setItem('notificationToken', token);
            }
        });
    }
};
