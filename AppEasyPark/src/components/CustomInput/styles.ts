import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: currentColors.text,
        fontWeight: "500",
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: currentColors.card,
        borderWidth: 1,
        borderColor: currentColors.border,
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: currentColors.text,
    },
    iconWrapper: {
        padding: 10,
        marginRight: -10,
    },
});