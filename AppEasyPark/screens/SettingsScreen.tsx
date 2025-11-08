import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { useTheme } from '../src/context/ThemeContext';
import { colors, ThemeColors } from '../src/theme/colors';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, "Settings">;

interface Props {
    navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {

    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // Função de logout
    const handleLogout = async () => {
        try {
            // Remove todos os dados específicos do usuário
            await AsyncStorage.removeItem('@user_name');
            await AsyncStorage.removeItem('@payment_methods');
            await AsyncStorage.removeItem('@recent_searches');

            Toast.show({ type: 'success', text1: 'Você saiu!', text2: 'Até a próxima.' });

            // Reseta a navegação para a tela de Welcome, limpando o histórico
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });

        } catch (e) {
            console.error("Falha ao fazer logout.", e);
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível sair.' });
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>Configurações</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* --- Cards --- */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ProfileInfo")}>
                    <Ionicons name="person-outline" size={24} color="#03BB85" />
                    <Text style={styles.cardText}>Informações de perfil</Text>
                    <Ionicons name="chevron-forward" size={22} color="#888" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}
                    onPress={() => navigation.navigate("PaymentMethods")}>
                    <Ionicons name="card-outline" size={24} color="#03BB85" />
                    <Text style={styles.cardText}>Formas de pagamento</Text>
                    <Ionicons name="chevron-forward" size={22} color="#888" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("UserPreferences")}>
                    <Ionicons name="options-outline" size={24} color="#03BB85" />
                    <Text style={styles.cardText}>Preferências do usuário</Text>
                    <Ionicons name="chevron-forward" size={22} color="#888" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Help")}>
                    <Ionicons name="help-circle-outline" size={24} color="#03BB85" />
                    <Text style={styles.cardText}>Ajuda e suporte</Text>
                    <Ionicons name="chevron-forward" size={22} color="#888" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#D9534F" />
                    <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* --- Barra de Navegação Inferior --- */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={26} color={currentColors.muted} />
                    <Text style={styles.navLabel}>Início</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("History")}>
                    <Ionicons name="time-outline" size={26} color={currentColors.muted} />
                    <Text style={styles.navLabel}>Histórico</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("Settings")}>
                    <Ionicons name="settings-outline" size={26} color={currentColors.primary} />
                    <Text style={[styles.navLabel, { color: currentColors.primary }]}>Configurações</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default SettingsScreen;

const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    header: {
        backgroundColor: "#03BB85",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        elevation: 6,
    },
    title: {
        fontSize: 26,
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
        justifyContent: "space-between",
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
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: currentColors.card,
        padding: 15,
        borderRadius: 8,
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#D9534F',
    },
    logoutButtonText: {
        color: '#D9534F',
        fontSize: 16,
        fontWeight: 'bold',
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