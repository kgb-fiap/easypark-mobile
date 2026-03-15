import React from "react";
import { View, Text, Image } from "react-native";

// Navigation e Context
import { RootStackScreenProps } from "../../../navigation/types";
import { useTheme } from '../../../context/ThemeContext';
import { colors } from '../../../theme/colors';
import { getStyles } from './styles';

// Components, Hooks, Types e Utils
import { PrimaryButton } from '../../../components/PrimaryButton/PrimaryButton';

const WelcomeScreen: React.FC<RootStackScreenProps<'Welcome'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    return (
        <View style={styles.container}>

            {/* --- Logo (Apresentação inicial) --- */}
            <Image
                source={require("../../../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>
                EASY
                <Text style={styles.titleAccent}>P</Text>ARK
            </Text>

            {/* --- Navegação inicial --- */}
            <PrimaryButton 
                title="Entrar" 
                onPress={() => navigation.navigate('Login')} 
                containerStyle={{ marginBottom: 15 }} 
            />

            <PrimaryButton 
                title="Cadastre-se" 
                onPress={() => navigation.navigate('Register')} 
                containerStyle={styles.secondaryButton} 
            />

            <Text style={styles.forgotText}>Esqueceu a senha?</Text>

        </View>
    );
};

export default WelcomeScreen;