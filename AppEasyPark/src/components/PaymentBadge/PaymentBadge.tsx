import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// Context
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

export interface PaymentBadgeProps {
    type: 'credit' | 'pix' | 'money';
    last4?: string;
}

export const PaymentBadge: React.FC<PaymentBadgeProps> = ({ type, last4 }) => {
    
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // Função que retorna o ícone e o texto com base no tipo
    const getPaymentDetails = () => {
        switch (type) {
            case 'credit':
                return {
                    icon: <Ionicons name="card-outline" size={16} color={currentColors.muted} />,
                    text: `Final •••• ${last4}`
                };
            case 'pix':
                return {
                    icon: <FontAwesome6 name="pix" size={14} color={currentColors.muted} />,
                    text: 'Pix'
                };
            case 'money':
                return {
                    icon: <Ionicons name="cash-outline" size={16} color={currentColors.muted} />,
                    text: 'Dinheiro'
                };
            default:
                return null;
        }
    };

    const details = getPaymentDetails();
    if (!details) return null;

    return (
        <View style={styles.container}>
            {details.icon}
            <Text style={[styles.text, { color: currentColors.muted }]}>{details.text}</Text>
        </View>
    );
};