import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'models/types';

import BottomTab from './BottomTab';
import ReceiptForm from 'screens/ReceiptForm';
import ReceiptFormReview from 'screens/ReceiptFormReview';
import ReceiptCategories from 'screens/ReceiptCategories';
import ReceiptFormLong from 'screens/ReceiptFormLong';
import ReceiptScreen from 'screens/ReceiptScreen';
import NotificationScreen from 'screens/NotificationScreen';
import TransactionScreen from 'screens/TransactionScreen';
import LoginScreen from 'screens/LoginScreen';
import TransactionModal from 'components/modals/TransactionModal';
import CategoryEditModal from 'components/modals/CategoryEditModal';
import ReceiptModal from 'components/modals/ReceiptModal';

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationStack: React.FC<{
    isLoggedIn: boolean;
}> = ({ isLoggedIn }) => {
    return (
        <Stack.Navigator
            initialRouteName={isLoggedIn ? 'BottomTab' : 'LoginScreen'}
            screenOptions={{
                headerShown: false,
                animationTypeForReplace: 'pop',
            }}
        >
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="TransactionScreen"
                component={TransactionScreen}
                options={{ headerShown: false, animationTypeForReplace: 'pop' }}
            />
            <Stack.Screen
                name="ReceiptForm"
                component={ReceiptForm}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ReceiptCategories"
                component={ReceiptCategories}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="BottomTab" component={BottomTab} options={{ headerShown: false }} />
            <Stack.Screen
                name="ReceiptFormReview"
                component={ReceiptFormReview}
                options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    animationTypeForReplace: 'push',
                }}
            />
            <Stack.Screen
                name="ReceiptFormLong"
                component={ReceiptFormLong}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{
                    headerShown: false,
                    animation: 'slide_from_bottom',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="Receipts"
                component={ReceiptScreen}
                options={{ headerShown: false }}
            />
            {/* Modal Stack Group */}
            <Stack.Group
                screenOptions={{
                    presentation: 'modal',
                    gestureEnabled: true,
                }}
            >
                <Stack.Screen
                    name="TransactionModal"
                    component={TransactionModal}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="ReceiptModal"
                    component={ReceiptModal}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="CategoryEditModal"
                    component={CategoryEditModal}
                    options={{ headerShown: false }}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
};
export default NavigationStack;
