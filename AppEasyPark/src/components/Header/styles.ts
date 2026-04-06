import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    header: {
        backgroundColor: currentColors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        elevation: 4,
    },
    backButton: {
        padding: 5,
        marginLeft: -5,
    },
    title: {
        fontSize: 20,
        fontFamily: "Montserrat-Bold",
        color: "#fff",
    },
    spacer: {
        width: 20,
    }
});