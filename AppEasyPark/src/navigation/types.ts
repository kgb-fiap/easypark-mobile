import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Home: {
        selectedSpotParams?: {
            id: string;
            type?: string;
            status?: string;
            label?: string;
            x?: number; y?: number; width?: number; height?: number;
            coords: { latitude: number; longitude: number }
        }
    } | undefined;
    Search: undefined;
    History: undefined;
    Settings: undefined;
    UserPreferences: undefined;
    ProfileInfo: undefined;
    PaymentMethods: undefined;
    PixPayment: undefined;
    Help: undefined;
    About: undefined;
};

// Helper para tipar as props das telas automaticamente
export type RootStackScreenProps<T extends keyof RootStackParamList> =
    StackScreenProps<RootStackParamList, T>;

// Caso precise usar o hook useNavigation dentro de subcomponentes
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}