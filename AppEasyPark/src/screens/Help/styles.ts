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
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        color: currentColors.muted,
        textTransform: 'uppercase',
        marginBottom: 15,
        marginLeft: 5,
    },
    divider: {
        height: 1,
        backgroundColor: currentColors.border,
        marginVertical: 15,
    }
});