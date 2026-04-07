import { StyleSheet, Platform } from 'react-native';
import { ThemeColors } from '../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    cardContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 110 : 130,
        left: 20,
        right: 20,
        backgroundColor: currentColors.card,
        borderRadius: 20,
        padding: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: currentColors.border,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    statusBadge: {
        backgroundColor: currentColors.primary + '20', // 20% de opacidade
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: currentColors.primary,
        fontFamily: 'Inter-Bold',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    cancelButton: {
        padding: 5,
    },
    cancelText: {
        color: '#D9534F',
        fontFamily: 'Inter-Medium',
        fontSize: 14,
    },
    spotInfo: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    spotTitle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        color: currentColors.text,
        textAlign: 'center',
        flexShrink: 1,
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: currentColors.background,
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: currentColors.border,
    },
    timerLabel: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: currentColors.muted,
        marginBottom: 2,
    },
    timerValue: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 36, // Fonte gigante para fácil visualização
        color: currentColors.text,
        letterSpacing: 2,
    },
    timerWarning: {
        color: '#D9534F', // Fica vermelho quando o tempo está acabando
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    navigateButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: currentColors.background,
        borderWidth: 1,
        borderColor: currentColors.primary,
        paddingVertical: 14,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navigateText: {
        color: currentColors.primary,
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        marginLeft: 8,
    },
    checkinButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: currentColors.primary,
        paddingVertical: 14,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkinText: {
        color: '#fff',
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        marginLeft: 8,
    }
});