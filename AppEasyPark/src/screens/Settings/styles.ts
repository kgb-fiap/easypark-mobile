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
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: currentColors.card,
        padding: 15,
        borderRadius: 8,
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#D9534F',
    },
    logoutButtonText: {
        color: '#D9534F',
        fontSize: 16,
        fontFamily: 'Inter-Bold',
        marginLeft: 10,
    },
    modalOverlay: {
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'flex-end' 
    },
    modalCard: {
        backgroundColor: currentColors.background, 
        padding: 24, 
        borderTopLeftRadius: 24, 
        borderTopRightRadius: 24,
        alignItems: 'center'
    },
    modalIcon: {
        marginBottom: 16 
    },
    modalTitle: {
        fontFamily: 'Inter-Bold', 
        color: currentColors.text, 
        fontSize: 20, 
        marginBottom: 8, 
        textAlign: 'center' 
    },
    modalDesc: {
        fontFamily: 'Inter-Regular', 
        color: currentColors.muted, 
        fontSize: 16, 
        textAlign: 'center', 
        marginBottom: 24 
    },
    modalButtonPrimary: {
        backgroundColor: currentColors.primary, 
        width: '100%', 
        padding: 16, 
        borderRadius: 12, 
        alignItems: 'center', 
        marginBottom: 12 
    },
    modalButtonPrimaryText: {
        fontFamily: 'Inter-SemiBold', 
        color: '#121212', 
        fontSize: 16 
    },
    modalButtonSecondary: {
        padding: 12 
    },
    modalButtonSecondaryText: {
        fontFamily: 'Inter-Medium', 
        color: currentColors.muted, 
        fontSize: 14 
    }
});