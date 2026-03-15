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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: currentColors.card,
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
    },
    cardText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: currentColors.text,
    }
});