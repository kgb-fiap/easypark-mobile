import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';
import { formatTime } from '../../utils/formatters';

interface ActiveJourneyCardProps {
    spotName: string;
    countdown: number;
    onNavigate: () => void;
    onCheckin: () => void;
    onCancel: () => void;
    onCenterMap: () => void;
}

export const ActiveJourneyCard: React.FC<ActiveJourneyCardProps> = ({
    spotName,
    countdown,
    onNavigate,
    onCheckin,
    onCancel,
    onCenterMap
}) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // Se faltar menos de 3 minutos o tempo fica vermelho para alertar o motorista
    const isTimeRunningOut = countdown <= 180;

    return (
        <View style={styles.cardContainer}>

            <View style={styles.headerRow}>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Vaga Reservada</Text>
                </View>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.spotInfo, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>

                <Ionicons name="car-sport" size={24} color={currentColors.primary} />
                <Text style={[styles.spotTitle, { flex: 1, marginRight: 10, marginTop: 5, textAlign: 'left' }]} numberOfLines={1}>
                    {spotName}
                </Text>

                <TouchableOpacity
                    onPress={onCenterMap}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: currentColors.primary + '15',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Ionicons name="locate" size={22} color={currentColors.primary} />
                </TouchableOpacity>
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