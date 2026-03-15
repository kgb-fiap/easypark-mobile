import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';

export const useLocation = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [initialRegion, setInitialRegion] = useState<Region | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permissão de localização negada');
                // Retorna região padrão (SP) caso negado
                setInitialRegion({ latitude: -23.56158, longitude: -46.65609, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
            setInitialRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.01
            });
        })();
    }, []);

    return { location, initialRegion, errorMsg };
};