import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Herdamos TextInputProps para aceitar props nativas (placeholder, keyboardType, etc)
export interface CustomInputProps extends TextInputProps {
    /** Rótulo exibido acima do campo */
    label?: string;
    /** Define se o campo é uma senha (ativa o ícone de mostrar/ocultar) */
    isPassword?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
    label,
    isPassword = false,
    ...rest // Pega todas as outras props padrão do TextInput
}) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // O estado da visibilidade da senha fica encapsulado AQUI, e não na Tela.
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.container}>
            {/* Renderiza a label apenas se ela for fornecida */}
            {label && <Text style={styles.label}>{label}</Text>}
            
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={currentColors.muted}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    {...rest} // Injeta o onChangeText, value, etc.
                />
                
                {/* Renderiza o ícone do olhinho se for um campo de senha */}
                {isPassword && (
                    <TouchableOpacity 
                        onPress={togglePasswordVisibility} 
                        style={styles.iconWrapper}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                            size={22}
                            color={currentColors.muted}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};