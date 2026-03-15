import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    header: {
        backgroundColor: currentColors.primary,
        paddingTop: 70,
        paddingBottom: 30,
        paddingHorizontal: 30,
    },
    iconHeader: {
        paddingBottom: 10,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold",
    },
    form: {
        flex: 1,
        paddingHorizontal: 30,
        marginTop: 40,
    },
    label: {
        color: currentColors.text,
        fontWeight: "500",
        marginBottom: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: currentColors.muted,
        marginBottom: 20,
        paddingVertical: 10,
        fontSize: 16,
        color: currentColors.text,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: currentColors.muted,
        marginBottom: 10,
    },
    icon: {
        paddingBottom: 20,
    },
    greenButton: {
        backgroundColor: currentColors.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    signupText: {
        textAlign: "center",
        color: currentColors.text,
    },
    signupLink: {
        color: currentColors.primary,
        fontWeight: "bold",
    },
    footer: {
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40,
        backgroundColor: currentColors.background,
    },
    miniLogo: {
        width: 30,
        height: 30,
        marginBottom: 30,
    },
});