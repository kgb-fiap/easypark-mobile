import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    titleHeader: {
        backgroundColor: currentColors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: currentColors.card,
        borderBottomWidth: 1,
        borderBottomColor: currentColors.border,
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: currentColors.text,
        paddingVertical: 15,
    },
    clearButton: {
        padding: 5,
        marginLeft: 10,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    listTitle: {
        fontSize: 14,
        color: currentColors.muted,
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: currentColors.border,
    },
    resultIcon: {
        marginRight: 15,
    },
    resultTextContainer: {
        flex: 1,
    },
    resultNameLine1: {
        fontSize: 16,
        fontWeight: 'bold',
        color: currentColors.text,
        marginBottom: 4,
    },
    resultNameLine2: {
        fontSize: 14,
        color: currentColors.muted,
    },
});
