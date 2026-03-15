import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

const SettingsScreen: React.FC<RootStackScreenProps<'Settings'>> = ({ navigation }) => {

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