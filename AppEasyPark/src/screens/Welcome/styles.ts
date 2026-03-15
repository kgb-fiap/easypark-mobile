import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../theme/colors';

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
        fontFamily: "",
        fontSize: 28,
        fontWeight: "900",
        color: currentColors.text,
        marginBottom: 80,
    },
    titleAccent: {
        color: "#03BB85",
    },
    greenButton: {
        backgroundColor: "#03BB85",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    blackButton: {
        backgroundColor: "#2A2A2A",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    forgotText: {
        marginTop: 10,
        fontStyle: "italic",
        color: currentColors.text,
    },
});
