import React from 'react';
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

export interface PrimaryButtonProps {
    /** Texto exibido dentro do botão */
    title: string;
    /** Função executada ao pressionar o botão */
    onPress: () => void;
    /** Desabilita o clique e altera o estilo visual do botão (Opcional) */
    disabled?: boolean;
    /** Permite injetar estilos customizados no contêiner do botão (Opcional) */
    containerStyle?: StyleProp<ViewStyle>;
    /** Permite injetar estilos customizados no texto do botão (Opcional) */
    textStyle?: StyleProp<TextStyle>;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    disabled = false,
    containerStyle,
    textStyle,
}) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    return (
        <TouchableOpacity
            style={[
                styles.button,
                disabled && styles.buttonDisabled,
                containerStyle, // Aplica estilos extras passados por prop, se houver
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8} // Suaviza o feedback de clique
        >
            <Text style={[styles.buttonText, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};