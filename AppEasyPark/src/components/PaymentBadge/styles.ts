import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../theme/colors';

export const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    text: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        marginLeft: 8,
    },
});