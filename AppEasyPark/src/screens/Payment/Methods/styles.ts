import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../theme/colors';

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
    listContainer: {
        padding: 20,
        flexGrow: 1,
        paddingBottom: 60,
    },
    paymentMethodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: currentColors.card,
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
    },
    methodDetails: {
        flex: 1,
        marginLeft: 15,
    },
    brandText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: currentColors.text,
    },
    lastFourText: {
        fontSize: 14,
        color: currentColors.muted,
        marginTop: 2,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: currentColors.primary,
        borderStyle: 'dashed',
        borderRadius: 12,
    },
    addButtonText: {
        color: currentColors.primary,
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: currentColors.muted,
        fontSize: 16,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: currentColors.card,
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: currentColors.text,
        marginBottom: 20,
    },
    brandSelector: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    brandButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: currentColors.muted,
        marginHorizontal: 5,
    },
    brandButtonSelected: {
        backgroundColor: currentColors.primary,
        borderColor: currentColors.primary,
    },
    brandButtonText: {
        color: currentColors.muted,
    },
    brandButtonTextSelected: {
        color: '#fff',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: currentColors.muted,
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: currentColors.text,
        textAlign: 'center',
        marginBottom: 30,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: currentColors.muted,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: currentColors.primary,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});