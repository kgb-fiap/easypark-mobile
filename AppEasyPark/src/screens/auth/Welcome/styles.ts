import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    logo: {
        width: 160,
        height: 160,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: "Montserrat-Bold", // Título com Montserrat (substitui o fontWeight: "900")
        color: currentColors.text,
        marginBottom: 80,
    },
    titleAccent: {
        color: currentColors.primary,
    },
    secondaryButton: {
        backgroundColor: "#2A2A2A",
        marginBottom: 15,
    },
    forgotText: {
        marginTop: 10,
        fontFamily: "Inter-Regular", // Texto normal com Inter (substitui o fontStyle: "italic")
        color: currentColors.text,
    },
});