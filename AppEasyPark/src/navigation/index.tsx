import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

import WelcomeScreen from "../screens/Welcome/WelcomeScreen";
import LoginScreen from "../screens/auth/Login/LoginScreen";
import RegisterScreen from "../screens/auth/Register/RegisterScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import SearchScreen from "../screens/Search/SearchScreen";
import HistoryScreen from "../screens/History/HistoryScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import ProfileInfoScreen from "../screens/Profile/ProfileInfoScreen";
import PaymentMethodsScreen from "../screens/Payment/Methods/PaymentMethodsScreen"
import UserPreferencesScreen from "../screens/UserPreferences/UserPreferencesScreen";
import HelpScreen from "../screens/Help/HelpScreen";

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="UserPreferences" component={UserPreferencesScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="ProfileInfo" component={ProfileInfoScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
        </Stack.Navigator>
    );
};