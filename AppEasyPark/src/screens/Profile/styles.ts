import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    header: {
        backgroundColor: currentColors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    scrollContainer: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        color: currentColors.muted,
        marginBottom: 8,
    },
    input: {
        backgroundColor: currentColors.card,
        borderWidth: 1,
        borderColor: currentColors.border,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: currentColors.text,
    },
    saveButton: {
        backgroundColor: currentColors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonDisabled: {
        backgroundColor: currentColors.muted,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: currentColors.card,
        padding: 15,
        borderRadius: 8,
        marginTop: 300,
        borderWidth: 1,
        borderColor: '#FFC107',
    },
    resetButtonText: {
        color: '#FFC107',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});