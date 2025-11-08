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

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {

  const { theme } = useTheme();
  const currentColors = colors[theme];
  const styles = getStyles(currentColors);

  // --- Estados do Formulário ---
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [confSenha, setConfSenha] = useState("");
  const [mostrarConfSenha, setMostrarConfSenha] = useState(false);

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
      return;
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

    // Se as validações passarem, salva os dados:
    try {
      const user = {
        name: nome,
        email: email,
        password: senha,
      };

      // Salvando o objeto "user" como uma string JSON
      await AsyncStorage.setItem('@user_credentials', JSON.stringify(user));

      // Salva o nome do usuário para exibir na Home
      await AsyncStorage.setItem('@user_name', nome);

      // Exibe a mensagem de sucesso no cadastro
      Toast.show({
        type: 'success',
        text1: `Bem-vindo, ${nome}!`,
        text2: `Cadastro realizado com sucesso!`,
        position: 'top',
      });

      // E em seguida, navega para a tela de Home
      setTimeout(() => {
        navigation.navigate("Home");
      }, 1500);

      // Em caso de erro exibe uma mensagem:
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
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor={currentColors.muted}
              value={nome}
              onChangeText={(text) => setNome(text.replace(/[0-9]/g, ''))}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor={currentColors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
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

            <Text style={styles.label}>Confirme sua senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Confirme sua senha"
                placeholderTextColor={currentColors.muted}
                secureTextEntry={!mostrarConfSenha}
                value={confSenha}
                onChangeText={setConfSenha}
              />
              <TouchableOpacity
                onPress={() => setMostrarConfSenha(!mostrarConfSenha)}
              >
                <Ionicons
                  name={mostrarConfSenha ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  style={styles.icon}
                  color={currentColors.muted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.greenButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

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

export default RegisterScreen;