import React from "react";
import { View, Text, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Navigation e Context
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Components, Hooks, Types e Utils
import { Header } from '../../components/Header/Header';

const UserPreferencesScreen: React.FC<RootStackScreenProps<'UserPreferences'>> = () => {
    const { theme, toggleTheme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    const isDarkMode = theme === 'dark';

    return (
        <View style={styles.container}>
            {/* Cabeçalho Reutilizável */}
            <Header title="Preferências" />

            {/* --- Cards --- */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Ionicons
                        name={isDarkMode ? "moon-outline" : "sunny-outline"}
                        size={24}
                        color={currentColors.primary}
                    />
                    <Text style={styles.cardText}>Modo Escuro</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: currentColors.primary }}
                        thumbColor={isDarkMode ? "#ffffff" : "#f4f3f4"}
                        onValueChange={toggleTheme}
                        value={isDarkMode}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default UserPreferencesScreen;