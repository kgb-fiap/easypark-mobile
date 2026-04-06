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
});