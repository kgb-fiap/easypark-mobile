import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

const UserPreferencesScreen: React.FC<RootStackScreenProps<'UserPreferences'>> = ({ navigation }) => {

    const { theme, toggleTheme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    const isDarkMode = theme === 'dark';

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name={"return-down-back"}
                        size={26}
                        color="#ffffff"
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Preferências</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* --- Cards --- */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <Ionicons
                        name={isDarkMode ? "moon-outline" : "sunny-outline"}
                        size={24}
                        color={currentColors.primary}
                    />
                    <Text style={styles.cardText}>Modo Escuro</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: currentColors.primary }}
                        thumbColor={isDarkMode ? currentColors.primary : "#f4f3f4"}
                        onValueChange={toggleTheme}
                        value={isDarkMode}
                    />
                </View>
            </ScrollView>

        </View>
    );
};

export default UserPreferencesScreen;