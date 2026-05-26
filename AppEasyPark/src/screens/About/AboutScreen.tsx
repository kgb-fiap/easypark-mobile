import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';

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

    // Dados da Versão Dinâmicos
    const APP_VERSION = Constants.expoConfig?.version || "1.0.0";
    const LATEST_COMMIT_HASH = Constants.expoConfig?.extra?.commitHash || "a1b2c3d";

    const handleOpenGithub = () => {
        Linking.openURL('https://github.com/kgb-fiap/easypark-mobile');
    };

    return (
        <View style={styles.container}>

            <Header title="Sobre o App" />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View style={styles.logoContainer}>
                    <Image
                        source={require("../../../assets/images/logo.png")}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.appName}>
                        EASY
                        <Text style={styles.titleAccent}>P</Text>ARK
                    </Text>
                    <Text style={styles.appSlogan}>
                        Estacionar nunca foi tão simples
                    </Text>
                </View>

                <View style={styles.card}>
                    <Ionicons name="information-circle-outline" size={24} color={currentColors.primary} />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardLabel}>Versão</Text>
                        <Text style={styles.cardValue}>v{APP_VERSION}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Ionicons name="git-commit-outline" size={24} color={currentColors.primary} />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardLabel}>Build / Commit Hash</Text>
                        <Text style={styles.cardValuePrimary}>#{LATEST_COMMIT_HASH}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.githubButton}
                    onPress={handleOpenGithub}
                    activeOpacity={0.8}
                >
                    <Ionicons name="logo-github" size={24} color="#ffffff" />
                    <Text style={styles.githubButtonText}>
                        Ver Repositório
                    </Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    © 2026 EasyPark. Todos os direitos reservados.
                </Text>

            </ScrollView>
        </View>
    );
};

export default AboutScreen;