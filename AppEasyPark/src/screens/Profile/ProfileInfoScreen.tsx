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

// Components e Utils
import { Header } from '../../components/Header/Header';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import { CustomInput } from '../../components/CustomInput/CustomInput';
import { STORAGE_KEYS } from '../../utils/constants';

// Firebase Services
import { auth } from '../../services/firebase/firebaseConfig';
import { profileService } from '../../services/firebase/profileService';

const ProfileInfoScreen: React.FC<RootStackScreenProps<'ProfileInfo'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // --- Estados do Formulário ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // --- Estados de Controle ---
    const [originalName, setOriginalName] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Carrega os dados do Firebase
    useEffect(() => {
        const loadUserData = () => {
            const user = auth.currentUser;
            if (user) {
                const currentName = user.displayName || '';
                const currentEmail = user.email || '';
                
                setName(currentName);
                setEmail(currentEmail);
                setOriginalName(currentName);
                setOriginalEmail(currentEmail);
            }
        };
        loadUserData();
    }, []);

    // Salva as alterações
    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            Toast.show({ type: 'error', text1: 'Atenção', text2: 'Os campos não podem ficar vazios.' });
            return;
        }

        setIsLoading(true);

        try {
            // Chama a camada de serviço para atualizar Auth e Firestore
            const response = await profileService.updateUser(name.trim(), email.trim());

            if (response.success) {
                // Atualiza o Cache local apenas para a Home Screen ler o nome
                await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name.trim());

                // Atualiza os estados de controle para desativar o botão de salvar
                setOriginalName(name.trim());
                setOriginalEmail(email.trim());

                Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Suas informações foram atualizadas.' });
            } else {
                // Erros do Firebase
                let errorMsg = 'Não foi possível atualizar o perfil.';
                if (response.error?.includes('requires-recent-login')) {
                    errorMsg = 'Por segurança, faça login novamente para trocar o e-mail.';
                } else if (response.error?.includes('email-already-in-use')) {
                    errorMsg = 'Este e-mail já está sendo usado por outra conta.';
                }

                Toast.show({ type: 'error', text1: 'Atenção', text2: errorMsg });
            }
        } catch (e: any) {
            Toast.show({ type: 'error', text1: 'Erro ao salvar', text2: 'Ocorreu um erro inesperado.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAppReset = () => {
        Alert.alert(
            "Resetar Aplicativo?",
            "Isso apagará TODOS os dados salvos e te deslogará.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Resetar", 
                    style: "destructive", 
                    onPress: async () => {
                        await AsyncStorage.clear(); 
                        await auth.signOut();
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
                automaticallyAdjustKeyboardInsets={true}
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
                        <Text style={styles.resetButtonText}>Resetar App e Sair</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

export default ProfileInfoScreen;