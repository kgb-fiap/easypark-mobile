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

const RegisterScreen: React.FC<RootStackScreenProps<'Register'>> = ({ navigation }) => {

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
      const user = { name: nome, email: email, password: senha };

      await AsyncStorage.setItem('@user_credentials', JSON.stringify(user)); // Salvando o objeto "user" como uma string JSON
      await AsyncStorage.setItem('@user_name', nome); // Salva o nome do usuário para exibir na Home

      // Exibe a mensagem de sucesso no cadastro
      Toast.show({
        type: 'success',
        text1: `Bem-vindo, ${nome}!`,
        text2: `Cadastro realizado com sucesso!`,
        position: 'top',
      });

      // E em seguida, navega para a tela de Home
      setTimeout(() => navigation.navigate("Home"), 1500);

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