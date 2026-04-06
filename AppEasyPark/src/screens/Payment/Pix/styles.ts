import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: currentColors.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 4,
        shadowColor: currentColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    title: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 22,
        color: currentColors.text,
        textAlign: 'center',
        marginBottom: 15,
    },
    instruction: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: currentColors.muted,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    pixBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: currentColors.border,
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 15,
        backgroundColor: currentColors.card,
        marginBottom: 25,
    },
    pixText: {
        flex: 1,
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: currentColors.text,
        marginRight: 15,
    },
    copyIconArea: {
        padding: 5,
    },
    warningText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: currentColors.muted,
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 10,
    },
    timerHighlight: {
        fontFamily: 'Inter-Bold',
        color: currentColors.text,
    },
    bottomContainer: {
        width: '100%',
        paddingBottom: 20,
    },
    shareButton: {
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 10,
    },
    shareText: {
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        color: currentColors.primary,
    }
});