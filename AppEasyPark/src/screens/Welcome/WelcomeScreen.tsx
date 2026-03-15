import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

const WelcomeScreen: React.FC<RootStackScreenProps<'Welcome'>> = ({ navigation }) => {

  const { theme } = useTheme();
  const currentColors = colors[theme];
  const styles = getStyles(currentColors);

  return (
    <View style={styles.container}>

      {/* --- Logo (Apresentação inicial) --- */}
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        EASY
        <Text style={styles.titleAccent}>P</Text>ARK
      </Text>

      {/* --- Navegação inicial --- */}
      <TouchableOpacity
        style={styles.greenButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.blackButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Cadastre-se</Text>
      </TouchableOpacity>

      <Text style={styles.forgotText}>Esqueceu a senha?</Text>

    </View>
  );
};

export default WelcomeScreen;