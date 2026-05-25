import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';
import { formatTime } from '../../utils/formatters';
import QRCode from 'react-native-qrcode-svg';

interface ActiveJourneyCardProps {
    spotName: string;
    countdown: number;
    status: 'PRE_RESERVA' | 'RESERVA';
    distanceKm: number;
    onNavigate: () => void;
    onCheckin: () => void;
    onCancel: () => void;
    onCenterMap: () => void;
    onMinimize: () => void;
}

export const ActiveJourneyCard: React.FC<ActiveJourneyCardProps> = ({
    spotName,
    countdown,
    status,
    distanceKm,
    onNavigate,
    onCheckin,
    onCancel,
    onCenterMap,
    onMinimize
}) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // Se faltar menos de 3 minutos o tempo fica vermelho para alertar o motorista
    const isTimeRunningOut = countdown <= 180;
    const isPreReserva = status === 'PRE_RESERVA';

    const etaMinutes = useMemo(() => {
        if (!distanceKm) return 0;
        const time = (distanceKm / 30) * 60;
        return Math.max(Math.round(time) + 2, 1); // Garante no mínimo 1 minuto
    }, [distanceKm]);

    const qrCodeValue = useMemo(() => {
        return `EASYPARK-VOUCHER-${spotName.replace(/\s+/g, '-').toUpperCase()}`;
    }, [spotName]);

    return (
        <View style={styles.cardContainer}>

            <View style={styles.headerRow}>
                <View style={[styles.statusBadge, { backgroundColor: isPreReserva ? '#FF9800' : currentColors.primary }]}>
                    <Text style={[styles.statusText, { color: isPreReserva ? '#FFFFFF' : '#121212' }]}>
                        {isPreReserva ? 'Pré-Reserva Ativa' : 'Reserva Confirmada'}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={onMinimize} style={{ marginRight: 15, padding: 4 }}>
                        <Ionicons name="chevron-down-circle-outline" size={24} color={currentColors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.spotInfo, {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 3
            }]}>
                <Text style={[styles.spotTitle, {
                    textAlign: 'center',
                    fontSize: 18,
                    fontFamily: 'Montserrat-Bold'
                }]} numberOfLines={1}>
                    {spotName}
                </Text>

                <Text style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 13,
                    color: currentColors.muted,
                    textAlign: 'center'
                }}>
                    Há {distanceKm.toFixed(1)} km de você • Chegada em ~{etaMinutes} min
                </Text>
            </View>

            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <View style={{
                    backgroundColor: '#FFFFFF',
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#E5E5E5'
                }}>
                    <QRCode
                        value={qrCodeValue}
                        size={200}
                        color="#000000"
                        backgroundColor="#FFFFFF"
                    />
                </View>
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: 12, color: currentColors.muted, marginTop: 8 }}>
                    Aproxime este código na catraca do estacionamento
                </Text>
            </View>

            {/* Cronômetro */}
            <View style={styles.timerContainer}>
                <Text style={styles.timerLabel}>Tempo para ocupação</Text>
                <Text style={[styles.timerValue, isTimeRunningOut && styles.timerWarning]}>
                    {formatTime(countdown)}
                </Text>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.navigateButton} onPress={onNavigate}>
                    <Ionicons name="navigate-circle-outline" size={22} color={currentColors.primary} />
                    <Text style={styles.navigateText}>Navegar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.checkinButton} onPress={onCheckin}>
                    <Ionicons name="checkmark-done" size={22} color="#fff" />
                    <Text style={styles.checkinText}>Cheguei</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};