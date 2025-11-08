import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

import { useTheme } from '../src/context/ThemeContext';
import { colors, ThemeColors } from '../src/theme/colors';

type UserPreferencesScreenNavigationProp = StackNavigationProp<RootStackParamList, "UserPreferences">;

interface Props {
    navigation: UserPreferencesScreenNavigationProp;
}

const UserPreferencesScreen: React.FC<Props> = ({ navigation }) => {

    const { theme, toggleTheme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // 
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

const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    header: {
        backgroundColor: currentColors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: currentColors.card,
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
    },
    cardText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: currentColors.text,
    }
});

export default UserPreferencesScreen;