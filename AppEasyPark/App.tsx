import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <Toast />
    </ThemeProvider>
  );
}