import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { AuthContext } from '../context/AuthContext';

import WelcomeScreen from "../screens/auth/Welcome/WelcomeScreen";
import LoginScreen from "../screens/auth/Login/LoginScreen";
import RegisterScreen from "../screens/auth/Register/RegisterScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import SearchScreen from "../screens/Search/SearchScreen";
import HistoryScreen from "../screens/History/HistoryScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import ProfileInfoScreen from "../screens/Profile/ProfileInfoScreen";
import PaymentMethodsScreen from "../screens/Payment/Methods/PaymentMethodsScreen";
import PixPaymentScreen from "../screens/Payment/Pix/PixPaymentScreen";
import UserPreferencesScreen from "../screens/UserPreferences/UserPreferencesScreen";
import HelpScreen from "../screens/Help/HelpScreen";

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {

    // Escutando o estado global em tempo real
    const { signed, loading } = useContext(AuthContext);

    // Tela de loading enquanto o Firebase verifica o AsyncStorage
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
                <ActivityIndicator size="large" color="#FFCC00" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            {/* Telas públicas */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="UserPreferences" component={UserPreferencesScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />

            {/* Telas condicionais */}
            {!signed ? (
                // Telas de login e registro
                <Stack.Group>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Group>
            ) : (
                // Telas Restritas
                <Stack.Group>
                    <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
                    <Stack.Screen name="PixPayment" component={PixPaymentScreen} />
                    <Stack.Screen name="ProfileInfo" component={ProfileInfoScreen} />
                </Stack.Group>
            )}

        </Stack.Navigator>
    );
};