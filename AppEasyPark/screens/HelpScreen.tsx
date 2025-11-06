import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import * as Linking from 'expo-linking';

import { useTheme } from '../src/context/ThemeContext';
import { colors, ThemeColors } from '../src/theme/colors';

const PITCH_VIDEO_URL = "https://youtu.be/lVp7S25vAQ8";
const SCREENS_NAVIGATION_URL = "";

type HelpScreenNavigationProp = StackNavigationProp<RootStackParamList, "Help">;

interface Props {
    navigation: HelpScreenNavigationProp;
}

const HelpScreen: React.FC<Props> = ({ navigation }) => {

    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

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

const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    header: {
        backgroundColor: currentColors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: currentColors.muted,
        textTransform: 'uppercase',
        marginBottom: 15,
        marginLeft: 5,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: currentColors.card,
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
    },
    cardTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: currentColors.text,
    },
    cardDescription: {
        fontSize: 14,
        color: currentColors.muted,
        marginTop: 3,
    },
    divider: {
        height: 1,
        backgroundColor: currentColors.border,
        marginVertical: 15,
    }
});