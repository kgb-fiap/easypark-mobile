import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Navigation e Context
import { RootStackScreenProps } from "../../navigation/types";
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Components, Hooks, Types e Utils
import { Header } from '../../components/Header/Header';
import { BottomNavBar } from '../../components/BottomNavBar/BottomNavBar';
import { ActionCard } from '../../components/ActionCard/ActionCard';
import { AuthModal } from '../../components/AuthModal/AuthModal';
import { STORAGE_KEYS } from '../../utils/constants';

// Firebase Services
import { authService } from '../../services/firebase/authService';

const SettingsScreen: React.FC<RootStackScreenProps<'Settings'>> = ({ navigation }) => {

    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    const { signed } = useContext(AuthContext);

    const [showAuthModal, setShowAuthModal] = useState(false);

    // Função de logout
    const handleLogout = async () => {
        try {
            // Desloga oficialmente no Firebase
            await authService.logout();

            // Limpa o lixo local
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.USER_NAME,
                STORAGE_KEYS.PAYMENT_METHODS,
                STORAGE_KEYS.RECENT_SEARCHES
            ]);

            Toast.show({ type: 'success', text1: 'Você saiu!', text2: 'Até a próxima.' });

            // Manda de volta para a Home (como visitante)
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });

        } catch (e) {
            console.error("Falha ao fazer logout.", e);
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível sair.' });
        }
    };

    const handleRestrictedAction = (routeName: 'ProfileInfo' | 'PaymentMethods') => {
        if (!signed) {
            setShowAuthModal(true); // Abre o convite se for visitante
        } else {
            navigation.navigate(routeName); // Deixa passar se estiver logado
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Configurações" showBackButton={false} />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* ROTAS RESTRITAS */}
                <ActionCard
                    title="Informações de perfil"
                    leftIconName="person-outline"
                    onPress={() => handleRestrictedAction("ProfileInfo")}
                />

                <ActionCard
                    title="Formas de pagamento"
                    leftIconName="card-outline"
                    onPress={() => handleRestrictedAction("PaymentMethods")}
                />

                {/* ROTAS PÚBLICAS (Qualquer um pode acessar) */}
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

                {/* BOTÃO DE SAIR (Só aparece se o usuário existir) */}
                {signed && (
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#D9534F" />
                        <Text style={styles.logoutButtonText}>Sair da conta</Text>
                    </TouchableOpacity>
                )}

            </ScrollView>

            {/* Modal de convite para login */}
            <AuthModal
                visible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onLoginPress={() => navigation.navigate('Login')}
                icon="sparkles-outline"
                title="Sua experiência EasyPark"
                description="Crie seu perfil para garantir sua vaga, acessar o histórico de faturas e ganhar agilidade no dia a dia."
                primaryButtonText="Começar agora"
                secondaryButtonText="Mais tarde"
            />

            <BottomNavBar currentRoute="Settings" />
        </View>
    );
};

export default SettingsScreen;