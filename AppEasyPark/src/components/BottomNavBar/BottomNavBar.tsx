import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

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

    return (
        <View style={styles.navBar}>
            {renderNavItem('Home', 'home', 'Início')}
            {renderNavItem('History', 'time', 'Histórico')}
            {renderNavItem('Settings', 'settings', 'Configurações')}
        </View>
    );
};