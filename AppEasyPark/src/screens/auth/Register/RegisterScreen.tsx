import React, { useState } from "react";
import { View, Text, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Navigation e Context
import { RootStackScreenProps } from "../../../navigation/types";
import { useTheme } from '../../../context/ThemeContext';
import { colors } from '../../../theme/colors';
import { getStyles } from './styles';
import { STORAGE_KEYS } from "../../../utils/constants";

// Components
import { PrimaryButton } from '../../../components/PrimaryButton/PrimaryButton';
import { CustomInput } from '../../../components/CustomInput/CustomInput';

const RegisterScreen: React.FC<RootStackScreenProps<'Register'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // --- Estados do Formulário ---
    // Note que removemos os estados 'mostrarSenha', pois o CustomInput cuida disso.
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confSenha, setConfSenha] = useState("");

    // Função para realizar o cadastro
    const handleRegister = async () => {
        // 1. Valida se os campos não estão vazios
        if (!nome.trim() || !email.trim() || !senha || !confSenha) {
            Toast.show({
                type: 'error',
                text1: 'Campos Incompletos',
                text2: 'Por favor, preencha todos os campos.',
                position: 'top',
            });
            return;
        }

        // 2. Valida o formato do nome
        if (/\d/.test(nome)) {
            return; // Se quiser, pode adicionar um Toast aqui avisando sobre nomes com números
        }

        // 3. Valida se as senhas coincidem
        if (senha !== confSenha) {
            Toast.show({
                type: 'error',
                text1: 'Senhas diferentes',
                text2: 'Os campos de senhas não coincidem.',
                position: 'top',
            });
            return;
        }

        try {
            const user = { name: nome, email: email, password: senha };

            // Usando a constante centralizada para evitar erros
            await AsyncStorage.setItem(STORAGE_KEYS.USER_CREDENTIALS, JSON.stringify(user));
            await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, nome);

            Toast.show({
                type: 'success',
                text1: `Bem-vindo, ${nome.split(' ')[0]}!`,
                text2: `Cadastro realizado com sucesso!`,
                position: 'top',
            });

            setTimeout(() => navigation.navigate("Home"), 1500);
        } catch (e) {
            console.error("Falha ao salvar o nome.", e);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível salvar os dados do usuário.',
                position: 'top',
            });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContent}
                    enableOnAndroid
                    extraScrollHeight={60}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
                            <Ionicons
                                name={"return-down-back"}
                                size={26}
                                style={styles.iconHeader}
                                color="#ffffffff"
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Cadastro</Text>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            label="Nome completo"
                            placeholder="Digite seu nome completo"
                            keyboardType="default"
                            autoCapitalize="words"
                            value={nome}
                            onChangeText={(text) => setNome(text.replace(/[0-9]/g, ''))}
                        />

                        <CustomInput
                            label="Email"
                            placeholder="Digite seu email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <CustomInput
                            label="Senha"
                            placeholder="Digite sua senha"
                            isPassword={true}
                            value={senha}
                            onChangeText={setSenha}
                        />

                        <CustomInput
                            label="Confirme sua senha"
                            placeholder="Confirme sua senha"
                            isPassword={true}
                            value={confSenha}
                            onChangeText={setConfSenha}
                        />

                        <PrimaryButton 
                            title="Cadastrar" 
                            onPress={handleRegister} 
                            containerStyle={{ marginTop: 20, marginBottom: 10 }} 
                        />

                        <Text style={styles.signupText}>
                            Já possui uma conta?{" "}
                            <Text
                                style={styles.signupLink}
                                onPress={() => navigation.navigate("Login")}
                            >
                                Faça o login
                            </Text>
                        </Text>
                    </View>
                </KeyboardAwareScrollView>

                <View style={styles.footer}>
                    <Image
                        source={
                            theme === 'light'
                                ? require("../../../../assets/images/miniLogoGreen.png")
                                : require("../../../../assets/images/miniLogoWhite.png")
                        }
                        style={styles.miniLogo}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default RegisterScreen;