import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { useTheme } from '../src/context/ThemeContext';
import { colors, ThemeColors } from '../src/theme/colors';
import { RootStackParamList } from '../App';

type ProfileInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, "ProfileInfo">;

interface Props {
    navigation: ProfileInfoScreenNavigationProp;
}

const ProfileInfoScreen: React.FC<Props> = ({ navigation }) => {

    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // --- Estados do Formulário ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // --- Estados para guardar os valores originais e controlar o botão "Salvar" ---
    const [originalName, setOriginalName] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');

    // Carrega os dados do usuário do AsyncStorage quando a tela é aberta
    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Puxa o objeto de usuário que é salvo no cadastro
                const userDataJson = await AsyncStorage.getItem('@user_credentials');
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

        // Validação para campos vazios
        if (!name.trim() || !email.trim()) {
            Toast.show({ type: 'error', text1: 'Campos vazios', text2: 'Nome e e-mail não podem ficar em branco.' });
            return;
        }

        try {
            // Recria o objeto com os dados atualizados
            const updatedUserData = {
                name: name,
                email: email,
                // Mantém a senha que já estava salva (se ela existir no objeto)
                password: JSON.parse(await AsyncStorage.getItem('@user_credentials') || '{}').password
            };

            // Salva o objeto de usuário completo
            await AsyncStorage.setItem('@user_credentials', JSON.stringify(updatedUserData));

            // Atualiza também o @user_name para a tela de Home
            await AsyncStorage.setItem('@user_name', name);

            // Atualiza os valores originais para desabilitar o botão
            setOriginalName(name);
            setOriginalEmail(email);

            Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Informações salvas.' });

        } catch (e) {
            console.error("Falha ao salvar dados do usuário", e);
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível salvar as alterações.' });
        }
    };

    // Verifica se houve alguma alteração para habilitar o botão
    const hasChanges = name !== originalName || email !== originalEmail;

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
                <Text style={styles.title}>Informações de Perfil</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Seu nome completo"
                        placeholderTextColor={currentColors.muted}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="seuemail@dominio.com"
                        placeholderTextColor={currentColors.muted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={!hasChanges}
                >
                    <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                </TouchableOpacity>
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
        padding: 20,
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        color: currentColors.muted,
        marginBottom: 8,
    },
    input: {
        backgroundColor: currentColors.card,
        borderWidth: 1,
        borderColor: currentColors.border,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: currentColors.text,
    },
    saveButton: {
        backgroundColor: currentColors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonDisabled: {
        backgroundColor: currentColors.muted,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default ProfileInfoScreen;