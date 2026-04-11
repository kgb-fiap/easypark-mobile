import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Navigation e Context
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Components e Utils
import { Header } from '../../components/Header/Header';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import { CustomInput } from '../../components/CustomInput/CustomInput';
import { STORAGE_KEYS } from '../../utils/constants';

const ProfileInfoScreen: React.FC<RootStackScreenProps<'ProfileInfo'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // --- Estados do Formulário ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // --- Estados de Controle (UX/UI) ---
    const [originalName, setOriginalName] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Carrega os dados do usuário
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userDataJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_CREDENTIALS);
                if (userDataJson !== null) {
                    const userData = JSON.parse(userDataJson);
                    setName(userData.name || '');
                    setEmail(userData.email || '');
                    setOriginalName(userData.name || '');
                    setOriginalEmail(userData.email || '');
                }
            } catch (e) {
                Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar seus dados.' });
            }
        };
        loadUserData();
    }, []);

    // Função para salvar as alterações
    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            Toast.show({ type: 'error', text1: 'Atenção', text2: 'Os campos não podem ficar vazios.' });
            return;
        }

        setIsLoading(true); // Inicia o loading visual no botão

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            /* * FUTURO CÓDIGO FIREBASE AQUI:
             * await authService.updateUserProfile(name);
             * if (email !== originalEmail) {
             * await authService.updateUserEmail(email);
             * }
             */

            // --- LÓGICA ATUAL (Mock AsyncStorage) ---
            const currentCreds = await AsyncStorage.getItem(STORAGE_KEYS.USER_CREDENTIALS);
            const password = currentCreds ? JSON.parse(currentCreds).password : '';
            const updatedUserData = { name, email, password };

            await AsyncStorage.setItem(STORAGE_KEYS.USER_CREDENTIALS, JSON.stringify(updatedUserData));
            await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
            // ----------------------------------------

            setOriginalName(name);
            setOriginalEmail(email);

            Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Suas informações foram atualizadas.' });
        } catch (e: any) {
            Toast.show({ type: 'error', text1: 'Erro ao salvar', text2: e.message || 'Tente novamente mais tarde.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAppReset = () => {
        Alert.alert(
            "Resetar Aplicativo?",
            "Isso apagará TODOS os dados salvos. Ação irreversível.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Resetar", 
                    style: "destructive", 
                    onPress: async () => {
                        await AsyncStorage.clear(); 
                        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
                    }
                }
            ]
        );
    };

    const hasChanges = name !== originalName || email !== originalEmail;

    return (
        <View style={styles.container}>
            <Header title="Perfil" />

            <ScrollView 
                contentContainerStyle={[styles.scrollContainer, { flexGrow: 1, paddingBottom: 40 }]} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets={true} // Ajuda o iOS a lidar com o teclado
            >
                
                <View style={{ alignItems: 'center', marginBottom: 30, marginTop: 20 }}>
                    <View style={{ 
                        width: 100, height: 100, borderRadius: 50, 
                        backgroundColor: currentColors.primary + '20', 
                        justifyContent: 'center', alignItems: 'center',
                        borderWidth: 2, borderColor: currentColors.primary
                    }}>
                        <Text style={{ fontSize: 40, fontFamily: 'Montserrat-Bold', color: currentColors.primary }}>
                            {name ? name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <TouchableOpacity style={{ marginTop: 10 }}>
                        <Text style={{ color: currentColors.primary, fontFamily: 'Inter-Medium', fontSize: 14, paddingVertical: 4 }}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>
                </View>

                <CustomInput
                    label="Nome Completo"
                    placeholder="Seu nome completo"
                    value={name}
                    onChangeText={setName}
                />

                <CustomInput
                    label="E-mail"
                    placeholder="seuemail@dominio.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <PrimaryButton 
                    title={isLoading ? "Salvando..." : "Salvar Alterações"} 
                    onPress={handleSave} 
                    disabled={!hasChanges || isLoading} 
                    containerStyle={{ marginTop: 20 }}
                />

                {/* Botão de reset (Dev) */}
                {__DEV__ && (
                    <TouchableOpacity style={styles.resetButton} onPress={handleAppReset}>
                        <Ionicons name="nuclear-outline" size={20} color="#FFC107" />
                        <Text style={styles.resetButtonText}>Resetar App (Dev)</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

export default ProfileInfoScreen;