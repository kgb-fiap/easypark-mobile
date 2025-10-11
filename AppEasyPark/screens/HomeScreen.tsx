import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

import { useTheme } from '../src/context/ThemeContext';
import { colors, ThemeColors, ThemeName } from '../src/theme/colors';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { theme, toggleTheme } = useTheme();
    const currentColors = colors[theme];

    const styles = getStyles(currentColors, theme);

    return (
        <View style={styles.container}>
            <View style={styles.mapMock}>
                <Text style={styles.mapMockText}>Mapa (simulação)</Text>
            </View>

            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Olá, Fulano</Text>
                    <Text style={styles.subtitle}>Para onde você quer estacionar?</Text>
                </View>

                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={toggleTheme}>
                        <Ionicons 
                            name={theme === 'light' ? 'moon-outline' : 'sunny-outline'} 
                            size={24} 
                            color="#fff" 
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={styles.searchBar}
                // onPress={() => navigation.navigate("Search")} 
            >
                <Ionicons name="search" size={20} color={currentColors.text} />
                <Text style={styles.searchBarPlaceholder}>Onde sua vaga te espera?</Text>
            </TouchableOpacity>

            <View style={styles.navBar}>
                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={26} color={currentColors.primary} />
                    <Text style={[styles.navLabel, { color: currentColors.primary }]}>Início</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("History")}>
                    <Ionicons name="time-outline" size={26} color={currentColors.muted} />
                    <Text style={styles.navLabel}>Histórico</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("Settings")}>
                    <Ionicons name="settings-outline" size={26} color={currentColors.muted} />
                    <Text style={styles.navLabel}>Configurações</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const getStyles = (currentColors: ThemeColors, theme: ThemeName) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    mapMock: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme === 'light' ? "#D9D9D9" : "#212121",
        justifyContent: "center",
        alignItems: "center",
    },
    mapMockText: {
        color: currentColors.muted,
        fontSize: 16,
        fontStyle: "italic",
    },
    header: {
        position: "absolute",
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: currentColors.primary,
        borderRadius: 12,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 6,
    },
    greeting: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    subtitle: {
        color: "#eaeaea",
        marginTop: 5,
        fontSize: 14,
    },
    headerIcons: {
        flexDirection: "row",
        gap: 15,
    },
    searchBar: {
        position: 'absolute',
        top: 160, 
        left: 20,
        right: 20,
        backgroundColor: "#A9A9A9",
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 8,
    },
    searchBarPlaceholder: {
        color: currentColors.text,
        fontSize: 16,
        marginLeft: 10,
    },
    navBar: {
        position: "absolute",
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: currentColors.card,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: currentColors.border,
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
    },
    bottomNav: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    navLabel: {
        fontSize: 13,
        textAlign: "center",
        color: currentColors.muted,
        marginTop: 3,
    },
});

export default HomeScreen;