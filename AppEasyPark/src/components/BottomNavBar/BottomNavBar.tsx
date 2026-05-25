import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';
import { formatTime } from '../../utils/formatters';
import { JourneyContext } from '../../context/JourneyContext';

// Rotas da barra inferior
type NavRoutes = 'Home' | 'History' | 'Settings';

interface BottomNavBarProps {
    currentRoute: NavRoutes;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentRoute }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // Usamos o hook do react-navigation para não precisar passar 'navigation' via props das telas
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const { isActiveReservation, isJourneyMinimized, reservationStatus, journeyCountdown, setIsJourneyMinimized } = useContext(JourneyContext);

    // Função auxiliar para renderizar cada item da aba
    const renderNavItem = (route: NavRoutes, iconName: keyof typeof Ionicons.glyphMap, label: string) => {
        const isActive = currentRoute === route;
        const color = isActive ? currentColors.primary : currentColors.muted;

        return (
            <TouchableOpacity
                style={styles.bottomNav}
                onPress={() => {
                    if (!isActive) navigation.navigate(route);
                }}
            >
                <Ionicons name={isActive ? iconName : `${iconName}-outline` as any} size={26} color={color} />
                <Text style={[styles.navLabel, { color }]}>{label}</Text>
            </TouchableOpacity>
        );
    };

    // Função para voltar e expandir a viagem
    const handleExpandJourney = () => {
        setIsJourneyMinimized(false);
        navigation.navigate('Home');
    };

    return (
        <>
            {isActiveReservation && isJourneyMinimized && (
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 140,
                        right: 20,
                        backgroundColor: currentColors.card,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 30,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: reservationStatus === 'PRE_RESERVA' ? '#FF9800' : currentColors.primary,
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        zIndex: 999,
                    }}
                    onPress={handleExpandJourney}
                >
                    <Ionicons
                        name="qr-code-outline"
                        size={20}
                        color={reservationStatus === 'PRE_RESERVA' ? '#FF9800' : currentColors.primary}
                        style={{ marginRight: 8 }}
                    />
                    <Text style={{ fontFamily: 'Inter-Bold', fontSize: 13, color: currentColors.text }}>
                        {formatTime(journeyCountdown)}
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.navBar}>
                {renderNavItem('Home', 'home', 'Início')}
                {renderNavItem('History', 'time', 'Histórico')}
                {renderNavItem('Settings', 'settings', 'Configurações')}
            </View>
        </>
    );
};