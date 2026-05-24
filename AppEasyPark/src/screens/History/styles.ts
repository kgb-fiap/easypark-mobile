import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
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
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    itemPlace: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: currentColors.text,
    },
    itemDate: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: currentColors.muted,
        marginTop: 5,
    },
    itemValue: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: currentColors.text,
    },
    emptyStateContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 50 
    },
    emptyStateText: {
        fontFamily: 'Inter-Medium', 
        color: currentColors.muted, 
        fontSize: 16 
    },
    unauthContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingHorizontal: 30 
    },
    unauthTitle: {
        fontFamily: 'Inter-Bold', 
        color: currentColors.text, 
        fontSize: 22, 
        marginBottom: 12, 
        textAlign: 'center' 
    },
    unauthDesc: {
        fontFamily: 'Inter-Regular', 
        color: currentColors.muted, 
        fontSize: 16, 
        textAlign: 'center', 
        marginBottom: 32, 
        lineHeight: 24 
    },
    primaryButton: {
        backgroundColor: currentColors.primary, 
        paddingVertical: 14, 
        paddingHorizontal: 40, 
        borderRadius: 8,
        width: '100%',
        alignItems: 'center'
    },
    primaryButtonText: {
        fontFamily: 'Inter-SemiBold', 
        color: '#121212', 
        fontSize: 16 
    }
});