import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Navigation e Context
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Components, Hooks, Types e Utils
import { Header } from '../../components/Header/Header';
import { BottomNavBar } from '../../components/BottomNavBar/BottomNavBar';
import { ActionCard } from '../../components/ActionCard/ActionCard';
import { STORAGE_KEYS } from '../../utils/constants';

const SettingsScreen: React.FC<RootStackScreenProps<'Settings'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // Função de logout
    const handleLogout = async () => {
        try {
            // Remove todos os dados específicos do usuário usando constantes seguras
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_NAME);
            await AsyncStorage.removeItem(STORAGE_KEYS.PAYMENT_METHODS);
            await AsyncStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);

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
            <Header title="Configurações" showBackButton={false} />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                
                <ActionCard 
                    title="Informações de perfil" 
                    leftIconName="person-outline" 
                    onPress={() => navigation.navigate("ProfileInfo")} 
                />

                <ActionCard 
                    title="Formas de pagamento" 
                    leftIconName="card-outline" 
                    onPress={() => navigation.navigate("PaymentMethods")} 
                />

                <ActionCard 
                    title="Preferências do usuário" 
                    leftIconName="options-outline" 
                    onPress={() => navigation.navigate("UserPreferences")} 
                />

                <ActionCard 
                    title="Ajuda e suporte" 
                    leftIconName="help-circle-outline" 
                    onPress={() => navigation.navigate("Help")} 
                />

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#D9534F" />
                    <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>

            </ScrollView>

            <BottomNavBar currentRoute="Settings" />
        </View>
    );
};

export default SettingsScreen;