import React from "react";
import { View, Text, ScrollView } from "react-native";
import * as Linking from 'expo-linking';

// Navigation e Context
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Components, Hooks, Types e Utils
import { Header } from '../../components/Header/Header';
import { ActionCard } from '../../components/ActionCard/ActionCard';

const PITCH_VIDEO_URL = "https://www.loom.com/share/8e681dc6262f46dc972cb64f581f4103";
const SCREENS_NAVIGATION_URL = "https://youtube.com/shorts/Eyyer4U6Cto?feature=share";

const HelpScreen: React.FC<RootStackScreenProps<'Help'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    const handleLinkPress = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Não foi possível carregar a página", err));
    };
    
    return (
        <View style={styles.container}>
            <Header title="Ajuda e Suporte" />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Recursos do Projeto</Text>

                <ActionCard 
                    title="Apresentação do Projeto (Pitch)"
                    description="Assista ao vídeo de apresentação"
                    leftIconName="videocam-outline"
                    rightIconName="open-outline"
                    onPress={() => handleLinkPress(PITCH_VIDEO_URL)}
                />

                <ActionCard 
                    title="Vídeo de Usabilidade"
                    description="Veja a navegação e uso do app"
                    leftIconName="apps-outline"
                    rightIconName="open-outline"
                    onPress={() => handleLinkPress(SCREENS_NAVIGATION_URL)}
                />

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Suporte</Text>

                <ActionCard 
                    title="Perguntas Frequentes (FAQ)"
                    description="Encontre respostas para dúvidas comuns."
                    leftIconName="help-circle-outline"
                    rightIconName="chevron-forward"
                    onPress={() => { /* Futura tela de FAQ */ }}
                />

                <ActionCard 
                    title="Sobre o App"
                    description="Versão e informações técnicas."
                    leftIconName="information-circle-outline"
                    rightIconName="chevron-forward"
                    onPress={() => navigation.navigate('About')} 
                />
            </ScrollView>
        </View>
    );
};

export default HelpScreen;