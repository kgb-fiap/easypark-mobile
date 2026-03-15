import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Navigation e Context
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Components, Hooks, Types e Utils
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

    // --- Estados para guardar os valores originais e controlar o botão "Salvar" ---
    const [originalName, setOriginalName] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');

    // Carrega os dados do usuário
    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Utilizando a constante segura
                const userDataJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_CREDENTIALS);
                if (userDataJson !== null) {
                    const userData = JSON.parse(userDataJson);
                    setName(userData.name || '');
                    setEmail(userData.email || '');
                    setOriginalName(userData.name || '');
                    setOriginalEmail(userData.email || '');
                }
            } catch (e) {
                console.error("Falha ao carregar dados do usuário", e);
                Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar seus dados.' });
            }
        };
        loadUserData();
    }, []);

    // Salvar as alterações
    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            Toast.show({ type: 'error', text1: 'Campos vazios', text2: 'Nome e e-mail não podem ficar em branco.' });
            return;
        }

        try {
            const currentCreds = await AsyncStorage.getItem(STORAGE_KEYS.USER_CREDENTIALS);
            const password = currentCreds ? JSON.parse(currentCreds).password : '';

            const updatedUserData = { name, email, password };

            // Salvando com as constantes
            await AsyncStorage.setItem(STORAGE_KEYS.USER_CREDENTIALS, JSON.stringify(updatedUserData));
            await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);

            setOriginalName(name);
            setOriginalEmail(email);

            Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Informações salvas.' });
        } catch (e) {
            console.error("Falha ao salvar dados do usuário", e);
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível salvar as alterações.' });
        }
    };

    // Ação Nuclear de Limpeza
    const handleAppReset = () => {
        Alert.alert(
            "Resetar Aplicativo?",
            "Isso apagará TODOS os dados salvos (usuário, tema, cartões). Ação irreversível.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Resetar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear(); 
                            Toast.show({ type: 'success', text1: 'App Resetado!', text2: 'Reinicie o aplicativo.' });
                            navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
                        } catch (e) {
                            console.error("Falha ao resetar o app.", e);
                            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível resetar o app.' });
                        }
                    }
                }
            ]
        );
    };

    const hasChanges = name !== originalName || email !== originalEmail;

    return (
        <View style={styles.container}>
            {/* Cabeçalho Reutilizável */}
            <Header title="Informações de Perfil" />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
                    title="Salvar Alterações" 
                    onPress={handleSave} 
                    disabled={!hasChanges} 
                    containerStyle={{ marginTop: 20 }}
                />

                {/* Botão de Reset Dev */}
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