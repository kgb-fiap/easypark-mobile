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
});