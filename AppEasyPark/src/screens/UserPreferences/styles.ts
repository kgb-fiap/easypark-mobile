import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: currentColors.text,
    }
});