import { StyleSheet } from 'react-native';

export const getStyles = (colors: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContainer: {
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 40,
        },
        logoContainer: {
            alignItems: 'center',
            marginBottom: 30,
            marginTop: 10,
        },
        appName: {
            fontFamily: 'Montserrat-Bold',
            fontSize: 24,
            color: colors.text,
            marginTop: 10,
            textAlign: 'center',
        },
        appSlogan: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: colors.muted,
            marginTop: 5,
            textAlign: 'center',
        },
        card: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 2,
        },
        cardContent: {
            flex: 1,
            marginLeft: 15,
        },
        cardLabel: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
            color: colors.muted,
        },
        cardValue: {
            fontFamily: 'Inter-Bold',
            fontSize: 15,
            color: colors.text,
        },
        githubButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            justifyContent: 'center',
            marginTop: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        githubButtonText: {
            fontFamily: 'Inter-Bold',
            fontSize: 16,
            color: '#ffffff',
            marginLeft: 10,
        },
        footerText: {
            fontFamily: 'Inter-Regular',
            fontSize: 12,
            color: colors.muted,
            textAlign: 'center',
            marginTop: 30,
            marginBottom: 20,
        },
    });
};