import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    header: {
        backgroundColor: "#03BB85",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        elevation: 6,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 150,
    },
    historyItem: {
        backgroundColor: currentColors.card,
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: currentColors.background === '#FFFFFF' ? 0.05 : 0,
        shadowRadius: 4,
        elevation: 3,
    },
    itemPlace: {
        fontSize: 16,
        fontWeight: 'bold',
        color: currentColors.text,
    },
    itemDate: {
        fontSize: 14,
        color: currentColors.muted,
        marginTop: 5,
    },
    itemValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: currentColors.text,
    },
    paymentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    paymentText: {
        color: currentColors.muted,
        fontSize: 14,
        marginLeft: 8,
    },
    navBar: {
        position: "absolute",
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: currentColors.card,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: currentColors.border,
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
    },
    bottomNav: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    navLabel: {
        fontSize: 13,
        textAlign: "center",
        color: currentColors.muted,
        marginTop: 3,
    },
});
