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

// Components e Utils
import { PrimaryButton } from '../../../components/PrimaryButton/PrimaryButton';
import { CustomInput } from '../../../components/CustomInput/CustomInput';
import { STORAGE_KEYS } from "../../../utils/constants";

// Firebase Services
import { authService } from '../../../services/firebase/authService';

const RegisterScreen: React.FC<RootStackScreenProps<'Register'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // --- Estados do Formulário ---
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    // --- Estado de Carregamento para a API ---
    const [isLoading, setIsLoading] = useState(false);

    // --- Lógica de Criação de Conta com FIREBASE ---
    const handleRegister = async () => {
        // 1. Validações
        if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
            Toast.show({ type: 'error', text1: 'Atenção', text2: 'Por favor, preencha todos os campos.' });
            return;
        }

        if (senha !== confirmarSenha) {
            Toast.show({ type: 'error', text1: 'Senhas divergentes', text2: 'A confirmação de senha falhou.' });
            return;
        }

        if (senha.length < 6) {
            Toast.show({ type: 'error', text1: 'Senha fraca', text2: 'A senha deve ter no mínimo 6 caracteres.' });
            return;
        }

        setIsLoading(true); // Trava o botão e mostra feedback visual

        try {
            // 2. Chama a função de registro do nosso serviço (Que já cria a conta e salva o nome no perfil do Firebase)
            const { user, error } = await authService.register(email.trim(), senha, nome.trim());

            if (error) {
                // Tratamento amigável para erros comuns do Firebase
                let errorMessage = 'Não foi possível criar a conta.';
                if (error.includes('email-already-in-use')) errorMessage = 'Este e-mail já está cadastrado.';
                if (error.includes('invalid-email')) errorMessage = 'Formato de e-mail inválido.';

                Toast.show({ type: 'error', text1: 'Erro no Cadastro', text2: errorMessage });
            } else if (user) {
                // 3. O Firebase já loga o usuário automaticamente após criar a conta.
                // Salvamos o nome localmente para a Home Screen exibir o "Olá, Nome".
                await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, nome.trim());

                Toast.show({ type: 'success', text1: 'Conta criada!', text2: 'Bem-vindo ao aplicativo.' });

                // Limpa o histórico de navegação e joga direto para a Home
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                }, 1500);
            }
        } catch (e) {
            console.error("Falha ao tentar registrar.", e);
            Toast.show({ type: 'error', text1: 'Erro Crítico', text2: 'Ocorreu um problema inesperado.' });
        } finally {
            setIsLoading(false); // Destrava o botão
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
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons
                                name={"return-down-back"}
                                size={26}
                                style={styles.iconHeader}
                                color="#ffffffff"
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Criar Conta</Text>
                    </View>

                    {/* Formulário */}
                    <View style={styles.form}>
                        <CustomInput
                            label="Nome Completo"
                            placeholder="Digite seu nome"
                            autoCapitalize="words"
                            value={nome}
                            onChangeText={setNome}
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
                            placeholder="Crie uma senha (mín. 6 caracteres)"
                            isPassword={true}
                            value={senha}
                            onChangeText={setSenha}
                        />

                        <CustomInput
                            label="Confirmar Senha"
                            placeholder="Digite a senha novamente"
                            isPassword={true}
                            value={confirmarSenha}
                            onChangeText={setConfirmarSenha}
                        />

                        <PrimaryButton
                            title={isLoading ? "Criando conta..." : "Cadastrar"}
                            onPress={handleRegister}
                            disabled={isLoading}
                            containerStyle={{ marginTop: 20, marginBottom: 10 }}
                        />

                        <Text style={styles.signupText}>
                            Já possui uma conta?{" "}
                            <Text style={styles.signupLink} onPress={() => navigation.navigate("Login")}>
                                Fazer Login
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