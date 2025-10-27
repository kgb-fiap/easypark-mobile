import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Keyboard } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { useTheme } from '../src/context/ThemeContext';
import { colors, ThemeColors } from '../src/theme/colors';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const { theme } = useTheme();
  const currentColors = colors[theme];
  const styles = getStyles(currentColors);

  const handleLogin = async () => {
    // 1. Valida se os campos não estão vazios
    if (!email.trim() || !senha) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Por favor, preencha e-mail e senha.' });
      return;
    }

    try {
      // 2. Tenta buscar os dados do usuário salvos no AsyncStorage
      const savedUserJson = await AsyncStorage.getItem('@user_credentials');

      // 3. Verifica se existe algum usuário cadastrado
      if (savedUserJson === null) {
        Toast.show({ type: 'error', text1: 'Erro de Login', text2: 'Nenhum usuário cadastrado.' });
        return;
      }

      const savedUser = JSON.parse(savedUserJson);

      // 4. Compara o e-mail e a senha digitados com os dados salvos
      if (email.toLowerCase() === savedUser.email.toLowerCase() && senha === savedUser.password) {
        // Se o login for bem-sucedido: salva o nome do usuário novamente para garantir que a Home o exiba
        await AsyncStorage.setItem('@user_name', savedUser.name);

        Toast.show({ type: 'success', text1: `Bem-vindo de volta, ${savedUser.name.split(' ')[0]}!` });
        setTimeout(() => navigation.navigate("Home"), 1500);

      } else {
        // Se não: credenciais incorretas
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
                ? require("../assets/images/miniLogoGreen.png")
                : require("../assets/images/miniLogoWhite.png")
            }
            style={styles.miniLogo}
            resizeMode="contain"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: currentColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: currentColors.primary,
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  iconHeader: {
    paddingBottom: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  form: {
    flex: 1,
    paddingHorizontal: 30,
    marginTop: 40,
  },
  label: {
    color: currentColors.text,
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: currentColors.muted,
    marginBottom: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: currentColors.text,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: currentColors.muted,
    marginBottom: 10,
  },
  icon: {
    paddingBottom: 20,
  },
  greenButton: {
    backgroundColor: currentColors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupText: {
    textAlign: "center",
    color: currentColors.text,
  },
  signupLink: {
    color: currentColors.primary,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
    backgroundColor: currentColors.background,
  },
  miniLogo: {
    width: 30,
    height: 30,
    marginBottom: 30,
  },
});

export default LoginScreen;