import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { RootStackScreenProps } from "../../../navigation/types";
import { useTheme } from '../../../context/ThemeContext';
import { colors } from '../../../theme/colors';
import { getStyles } from './styles';

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
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // --- Lógica de autenticação ---
  const handleLogin = async () => {

    if (!email.trim() || !senha) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Por favor, preencha e-mail e senha.'
      });
      return;
    }

    try {
      const savedUserJson = await AsyncStorage.getItem('@user_credentials');
      let userToCompare = savedUserJson ? JSON.parse(savedUserJson) : MOCK_USER; // Decide quais credenciais usar: as salvas ou o mock

      // Compara o e-mail e a senha digitados com os dados do usuário
      if (email.toLowerCase() === userToCompare.email.toLowerCase() && senha === userToCompare.password) {
        // Sucesso: Salva o nome para a HomeScreen
        await AsyncStorage.setItem('@user_name', userToCompare.name);

        Toast.show({
          type: 'success',
          text1: `Bem-vindo de volta, ${userToCompare.name.split(' ')[0]}!`
        });

        setTimeout(() => navigation.navigate("Home"), 1500);
      } else {
        // Erro: Credenciais incorretas
        Toast.show({
          type: 'error',
          text1: 'Erro de Login',
          text2: 'E-mail ou senha incorretos.'
        });
      }
    } catch (e) {
      console.error("Falha ao tentar logar.", e);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Ocorreu um problema ao tentar fazer login.'
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
            <Text style={styles.headerTitle}>Login</Text>
          </View>

          {/* --- Formulário --- */}
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor={currentColors.muted}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Digite sua senha"
                placeholderTextColor={currentColors.muted}
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Ionicons
                  name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  style={styles.icon}
                  color={currentColors.muted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.greenButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <Text style={styles.signupText}>
              Não possui uma conta?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate("Register")}
              >
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