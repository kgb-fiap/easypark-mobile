import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    scrollContainer: {
        padding: 20,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: currentColors.card,
        padding: 15,
        borderRadius: 8,
        marginTop: 300,
        borderWidth: 1,
        borderColor: '#FFC107',
    },
    resetButtonText: {
        color: '#FFC107',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});