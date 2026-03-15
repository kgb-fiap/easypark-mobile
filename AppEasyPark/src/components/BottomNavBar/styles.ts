import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    navBar: {
        position: "absolute",
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: currentColors.card,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: currentColors.border,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    bottomNav: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    navLabel: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
});