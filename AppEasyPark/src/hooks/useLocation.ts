import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';

const FALLBACK_REGION: Region = { 
    latitude: -23.56158, 
    longitude: -46.65609, 
    latitudeDelta: 0.0922, 
    longitudeDelta: 0.0421 
};

export const useLocation = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [initialRegion, setInitialRegion] = useState<Region | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; 

        // 🚀 O SALVA-VIDAS: Se o Expo "congelar" e não der resposta em 3 segundos, forçamos o mapa a abrir!
        const safetyTimeout = setTimeout(() => {
            setInitialRegion((prevRegion) => {
                if (!prevRegion) {
                    // console.log("Tempo limite de GPS esgotado. Forçando carregamento do mapa.");
                    return FALLBACK_REGION;
                }
                return prevRegion;
            });
        }, 3000);

        const getLocation = async () => {
            try {
                let { status } = await Location.getForegroundPermissionsAsync();
                
                if (status !== 'granted') {
                    const response = await Location.requestForegroundPermissionsAsync();
                    status = response.status;
                }
                
                if (status !== 'granted') {
                    if (isMounted) {
                        setErrorMsg('Permissão de localização negada');
                        setInitialRegion(FALLBACK_REGION);
                    }
                    return;
                }

                // Tenta Cache Rápido
                let cachedLocation = await Location.getLastKnownPositionAsync({});
                if (cachedLocation && isMounted) {
                    setLocation(cachedLocation);
                    setInitialRegion({
                        latitude: cachedLocation.coords.latitude,
                        longitude: cachedLocation.coords.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.01
                    });
                }

                // Tenta Busca Real
                let actualLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced, 
                });

                if (actualLocation && isMounted) {
                    setLocation(actualLocation);
                    setInitialRegion((prev) => ({
                        latitude: actualLocation.coords.latitude,
                        longitude: actualLocation.coords.longitude,
                        latitudeDelta: prev ? prev.latitudeDelta : 0.02,
                        longitudeDelta: prev ? prev.longitudeDelta : 0.01
                    }));
                }
            } catch (error) {
                console.log("Erro capturado no GPS:", error);
                if (isMounted) {
                    setInitialRegion((prev) => prev || FALLBACK_REGION);
                }
            }
        };

        getLocation();

        return () => {
            isMounted = false; 
            clearTimeout(safetyTimeout);
        };
    }, []);

    return { location, initialRegion, errorMsg };
};