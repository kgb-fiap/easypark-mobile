import React from 'react';
import { TouchableOpacity, View, Text, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

export interface ActionCardProps {
    title: string;
    description?: string;
    leftIconName: keyof typeof Ionicons.glyphMap;
    rightIconName?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    leftIconColor?: string;
    rightIconColor?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

export const ActionCard: React.FC<ActionCardProps> = ({
    title,
    description,
    leftIconName,
    rightIconName = "chevron-forward",
    onPress,
    leftIconColor,
    rightIconColor,
    containerStyle,
}) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // Usa a cor primária como padrão para o ícone da esquerda, e muted para o da direita
    const primaryIconColor = leftIconColor || currentColors.primary;
    const secondaryIconColor = rightIconColor || currentColors.muted;

    return (
        <TouchableOpacity style={[styles.card, containerStyle]} onPress={onPress} activeOpacity={0.7}>
            <Ionicons name={leftIconName} size={24} color={primaryIconColor} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                {description && <Text style={styles.description}>{description}</Text>}
            </View>
            {rightIconName && <Ionicons name={rightIconName} size={22} color={secondaryIconColor} />}
        </TouchableOpacity>
    );
};