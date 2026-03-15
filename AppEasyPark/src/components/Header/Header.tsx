import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    title, 
    showBackButton = true, 
    onBackPress 
}) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);
    const navigation = useNavigation();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.header}>
            {showBackButton ? (
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="return-down-back" size={26} color="#ffffff" />
                </TouchableOpacity>
            ) : (
                <View style={styles.spacer} />
            )}
            
            <Text style={styles.title}>{title}</Text>
            
            {/* Espaçador vazio para manter o título exatamente no centro da tela */}
            <View style={styles.spacer} />
        </View>
    );
};