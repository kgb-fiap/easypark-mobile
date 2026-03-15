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

// Components, Hooks, Types e Utils
import { PrimaryButton } from '../../../components/PrimaryButton/PrimaryButton';
import { CustomInput } from '../../../components/CustomInput/CustomInput';
import { STORAGE_KEYS } from "../../../utils/constants";

const MOCK_USER = {
    name: "Usuário Teste",
    email: "teste@teste.com",
    password: "123",
};

const LoginScreen: React.FC<RootStackScreenProps<'Login'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // --- Estados do Formulário ---
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // --- Lógica de autenticação ---
    const handleLogin = async () => {
        if (!email.trim() || !senha) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Por favor, preencha e-mail e senha.' });
            return;
        }

        try {
            const savedUserJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_CREDENTIALS);
            let userToCompare = savedUserJson ? JSON.parse(savedUserJson) : MOCK_USER; 

            if (email.toLowerCase() === userToCompare.email.toLowerCase() && senha === userToCompare.password) {
                await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, userToCompare.name);

                Toast.show({ type: 'success', text1: `Bem-vindo de volta, ${userToCompare.name.split(' ')[0]}!` });
                setTimeout(() => navigation.navigate("Home"), 1500);
            } else {
                Toast.show({ type: 'error', text1: 'Erro de Login', text2: 'E-mail ou senha incorretos.' });
            }
        } catch (e) {
            console.error("Falha ao tentar logar.", e);
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Ocorreu um problema ao tentar fazer login.' });
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
                        <Text style={styles.headerTitle}>Login</Text>
                    </View>

                    {/* Formulário */}
                    <View style={styles.form}>
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

                        <PrimaryButton 
                            title="Entrar" 
                            onPress={handleLogin} 
                            containerStyle={{ marginTop: 20, marginBottom: 10 }} 
                        />

                        <Text style={styles.signupText}>
                            Não possui uma conta?{" "}
                            <Text style={styles.signupLink} onPress={() => navigation.navigate("Register")}>
                                Cadastre-se
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

export default LoginScreen;