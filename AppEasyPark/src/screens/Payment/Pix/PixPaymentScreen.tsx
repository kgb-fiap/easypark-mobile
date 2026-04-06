import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

import { RootStackScreenProps } from '../../../navigation/types';
import { useTheme } from '../../../context/ThemeContext';
import { colors } from '../../../theme/colors';
import { getStyles } from './styles';

import { PrimaryButton } from '../../../components/PrimaryButton/PrimaryButton';
import { useCountdown } from '../../../hooks/useCountdown';
import { formatTime } from '../../../utils/formatters';

// Código Pix fictício para teste
const MOCK_PIX_CODE = "00020126580014br.gov.bcb.pix0136a1f4102e-a446-4a4a-9d22-97b7642732955204000053039865802BR5925AppEstacionamento6009SAOPAULO62070503***63041A2B";

const PixPaymentScreen: React.FC<RootStackScreenProps<'PixPayment'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);
    
    // Inicia um contador de 5 minutos
    const { countdown, startTimer, isActive, stopTimer } = useCountdown(300);

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, [startTimer, stopTimer]);

    // Ouve o final do tempo
    useEffect(() => {
        if (isActive && countdown === 0) {
            Toast.show({ type: 'error', text1: 'Pix Expirado', text2: 'O tempo para pagamento acabou.' });
            navigation.goBack();
        }
    }, [countdown, isActive, navigation]);

    // Ação de copiar o código
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(MOCK_PIX_CODE);
        Toast.show({ type: 'success', text1: 'Código copiado!', text2: 'Abra o app do seu banco para pagar.' });
    };

    // Ação de compartilhar
    const sharePixCode = async () => {
        try {
            await Share.share({
                message: `Aqui está o código Pix para pagamento do estacionamento:\n\n${MOCK_PIX_CODE}`,
            });
        } catch (error) {
            console.error("Erro ao compartilhar", error);
        }
    };

    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
                
                {/* Ilustração Central */}
                <View style={styles.iconCircle}>
                    <FontAwesome6 name="pix" size={50} color={currentColors.primary} />
                </View>

                <Text style={styles.title}>Estacionamento aguardando pagamento</Text>
                
                <Text style={styles.instruction}>
                    Copie o código abaixo para pagar via Pix em qualquer aplicativo habilitado:
                </Text>

                {/* Input com borda tracejada (como na imagem) */}
                <View style={styles.pixBox}>
                    <Text 
                        style={styles.pixText} 
                        numberOfLines={1} 
                        ellipsizeMode="middle"
                    >
                        {MOCK_PIX_CODE}
                    </Text>
                    <TouchableOpacity onPress={copyToClipboard} style={styles.copyIconArea}>
                        <Ionicons name="copy-outline" size={24} color={currentColors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Aviso de Tempo */}
                <Text style={styles.warningText}>
                    Você tem até <Text style={styles.timerHighlight}>{formatTime(countdown)} minutos</Text> para fazer o pagamento. Após esse tempo, a reserva será cancelada.
                </Text>

                {/* Botões Inferiores */}
                <View style={styles.bottomContainer}>
                    <PrimaryButton title="Copiar código" onPress={copyToClipboard} />
                    
                    <TouchableOpacity style={styles.shareButton} onPress={sharePixCode}>
                        <Text style={styles.shareText}>Compartilhar código</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
};

export default PixPaymentScreen;