import React from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native'; // 👈 Adicionado o import do Image
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

interface AuthModalProps {
    visible: boolean;
    onClose: () => void;
    onLoginPress: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
    imageSource?: any;
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
    visible,
    onClose,
    onLoginPress,
    icon,
    title,
    description,
    primaryButtonText,
    secondaryButtonText = "Agora não",
    imageSource
}) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalCard}
                    onPress={() => { }}
                >
                    <View style={styles.modalHandle} />

                    {imageSource ? (
                        <Image
                            source={imageSource}
                            style={{ width: 120, height: 120, marginBottom: 20 }}
                            resizeMode="contain"
                        />
                    ) : (
                        icon && (
                            <View style={styles.iconContainer}>
                                <Ionicons name={icon} size={38} color={currentColors.primary} />
                            </View>
                        )
                    )}

                    <Text style={styles.modalTitle}>
                        {title}
                    </Text>

                    <Text style={styles.modalDesc}>
                        {description}
                    </Text>

                    <TouchableOpacity
                        style={styles.modalButtonPrimary}
                        activeOpacity={0.8}
                        onPress={() => {
                            onClose();
                            onLoginPress();
                        }}
                    >
                        <Text style={styles.modalButtonPrimaryText}>
                            {primaryButtonText}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modalButtonSecondary}
                        activeOpacity={0.7}
                        onPress={onClose}
                    >
                        <Text style={styles.modalButtonSecondaryText}>
                            {secondaryButtonText}
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};