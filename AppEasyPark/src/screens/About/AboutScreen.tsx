import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Navigation e Context
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Components
import { Header } from '../../components/Header/Header';

const AboutScreen: React.FC<RootStackScreenProps<'About'>> = () => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // Dados da Versão
    const APP_VERSION = "1.4.0";
    const LATEST_COMMIT_HASH = "a1b2c3d"; // Substitua pelo hash real do seu GitHub

    const handleOpenGithub = () => {
        // Substitua pelo link real do seu repositório
        Linking.openURL('https://github.com/kgb-fiap/easypark-mobile');
    };

    return (
        <View style={styles.container}>

            <Header title="Sobre o App" />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                
                <View style={{ alignItems: 'center', marginBottom: 30, marginTop: 10 }}>
                    <Ionicons name="car-sport" size={60} color={currentColors.primary} />
                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 24, color: currentColors.text, marginTop: 10 }}>
                        EasyPark
                    </Text>
                    <Text style={{ fontFamily: 'Inter-Regular', fontSize: 14, color: currentColors.muted, marginTop: 5 }}>
                        Estacionar nunca foi tão simples.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Ionicons name="information-circle-outline" size={24} color={currentColors.primary} />
                    <View style={{ flex: 1, marginLeft: 15 }}>
                        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 12, color: currentColors.muted }}>Versão</Text>
                        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 15, color: currentColors.text }}>v{APP_VERSION}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Ionicons name="git-commit-outline" size={24} color={currentColors.primary} />
                    <View style={{ flex: 1, marginLeft: 15 }}>
                        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 12, color: currentColors.muted }}>Build / Commit Hash</Text>
                        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 15, color: currentColors.primary }}>#{LATEST_COMMIT_HASH}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Ionicons name="person-outline" size={24} color={currentColors.primary} />
                    <View style={{ flex: 1, marginLeft: 15 }}>
                        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 12, color: currentColors.muted }}>Desenvolvedor</Text>
                        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 15, color: currentColors.text }}>Seu Nome / RM</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.card, { backgroundColor: currentColors.primary, justifyContent: 'center', marginTop: 20 }]}
                    onPress={handleOpenGithub}
                    activeOpacity={0.8}
                >
                    <Ionicons name="logo-github" size={24} color="#ffffff" />
                    <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: '#ffffff', marginLeft: 10 }}>
                        Ver Repositório
                    </Text>
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 12, color: currentColors.muted, textAlign: 'center', marginTop: 30, marginBottom: 20 }}>
                    © 2026 EasyPark. Todos os direitos reservados.
                </Text>

            </ScrollView>
        </View>
    );
};

export default AboutScreen;