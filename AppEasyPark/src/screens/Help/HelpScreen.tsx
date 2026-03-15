import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from 'expo-linking';

import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

const PITCH_VIDEO_URL = "https://youtu.be/lVp7S25vAQ8";
const SCREENS_NAVIGATION_URL = "https://youtube.com/shorts/Eyyer4U6Cto?feature=share";

const HelpScreen: React.FC<RootStackScreenProps<'Help'>> = ({ navigation }) => {
    
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // --- Abre um link externo no navegador padrão do dispositivo ---
    const handleLinkPress = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Não foi possível carregar a página", err));
    };
    
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name={"return-down-back"}
                        size={26}
                        color="#ffffff"
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Ajuda e Suporte</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* --- Cards --- */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>Recursos do Projeto</Text>

                <TouchableOpacity style={styles.card} onPress={() => handleLinkPress(PITCH_VIDEO_URL)}>
                    <Ionicons name="videocam-outline" size={24} color={currentColors.primary} />
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Apresentação do Projeto (Pitch)</Text>
                        <Text style={styles.cardDescription}>Assista ao vídeo de apresentação</Text>
                    </View>
                    <Ionicons name="open-outline" size={22} color={currentColors.muted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => handleLinkPress(SCREENS_NAVIGATION_URL)}>
                    <Ionicons name="apps-outline" size={24} color={currentColors.primary} />
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Vídeo de Usabilidade</Text>
                        <Text style={styles.cardDescription}>Veja a navegação e uso do app</Text>
                    </View>
                    <Ionicons name="open-outline" size={22} color={currentColors.muted} />
                </TouchableOpacity>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Suporte</Text>

                <TouchableOpacity style={styles.card} onPress={() => { /* Futura tela de FAQ */ }}>
                    <Ionicons name="help-circle-outline" size={24} color={currentColors.primary} />
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Perguntas Frequentes (FAQ)</Text>
                        <Text style={styles.cardDescription}>Encontre respostas para dúvidas comuns.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color={currentColors.muted} />
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

export default HelpScreen;