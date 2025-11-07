import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import AsyncStorage from '@react-native-async-storage/async-storage';

import MapView, { Marker, Region, MarkerPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';

import { useTheme } from '../src/context/ThemeContext';
import { colors, ThemeColors, ThemeName } from '../src/theme/colors';
import { lightMapStyle, darkMapStyle } from '../src/theme/mapStyles';

// Função para calcular a distância entre duas coordenadas (Haversine)
// function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
//     const R = 6371; // Raio da Terra em km
//     const dLat = deg2rad(lat2 - lat1);
//     const dLon = deg2rad(lon2 - lon1);
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const d = R * c; // Distância em km
//     return d;
// }

// function deg2rad(deg: number) {
//     return deg * (Math.PI / 180);
// }

// DADOS DE EXEMPLO (MOCK) DOS ESTACIONAMENTOS
// No futuro, isso virá da sua API/Banco de Dados
const MOCK_PARKING_SPOTS = [
    { id: '1', title: "Estacionamento Fiap", description: "Vagas: 10", coords: { latitude: -23.56158, longitude: -46.65609 } },
    { id: '2', title: "Shopping Pátio Paulista", description: "Vagas: 30", coords: { latitude: -23.56275, longitude: -46.64855 } },
    { id: '3', title: "Estacionamento Augusta", description: "Vagas: 5", coords: { latitude: -23.55145, longitude: -46.65825 } },
    // Um estacionamento distante (ex: Morumbi) para testar o filtro de 5km
    { id: '4', title: "Estacionamento Morumbi", description: "Vagas: 50", coords: { latitude: -23.6234, longitude: -46.7388 } },
];
type ParkingSpot = typeof MOCK_PARKING_SPOTS[0];

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {

    const { theme, toggleTheme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors, theme);

    const [userName, setUserName] = useState<string>('Usuário'); // Nome padrão
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [initialRegion, setInitialRegion] = useState<Region | null>(null);
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);

    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
    const sheetAnim = useRef(new Animated.Value(300)).current; 
    const [sheetData, setSheetData] = useState<ParkingSpot | null>(null);

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        // Função para buscar os dados do usuário:
        const loadUserName = async () => {
            try {
                // 1. Busca o nome do usuário salvo no armazenamento do dispositivo
                const storedName = await AsyncStorage.getItem('@user_name');

                // 2. Se um nome foi encontrado, atualiza o estado.
                if (storedName !== null) {
                    // 2.5 Pega o primeiro nome para a saudação
                    const firstName = storedName.split(' ')[0];
                    setUserName(firstName);
                }
            } catch (e) {
                // Em caso de erro:
                console.error("Falha ao carregar o nome.", e);
            }
        };
        // 3. Executa a função de carregamento
        loadUserName();
    }, []); // O array vazio garante que o efeito execute apenas na montagem do componente e apenas uma única vez

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permissão de localização negada');
                // Define uma região padrão se a permissão for negada
                // Região padrão: São Paulo, Av. Paulista
                setInitialRegion({
                    latitude: -23.56158,
                    longitude: -46.65609,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            setInitialRegion({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    useEffect(() => {
        // Simula uma busca na API
        setParkingSpots(MOCK_PARKING_SPOTS);
    }, []);

    useEffect(() => {
        if (selectedSpot) {
            setSheetData(selectedSpot);
            Animated.timing(sheetAnim, {
                toValue: 0,
                duration: 200, // Duração reduzida para 200ms
                easing: Easing.inOut(Easing.ease), // Curva de animação mais suave
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(sheetAnim, {
                toValue: 300,
                duration: 200, // Duração reduzida para 200ms
                easing: Easing.inOut(Easing.ease), // Curva de animação mais suave
                useNativeDriver: true,
            }).start(() => {
                setSheetData(null);
            });
        }
    }, [selectedSpot]);

    // Efeito para filtrar o estacionamentos próximos (5km)
    // useEffect(() => {
    //     // Só filtra se tivermos a localização do usuário E a lista de estacionamentos
    //     if (location && allParkingSpots.length > 0) {
    //         const userLat = location.coords.latitude;
    //         const userLon = location.coords.longitude;
    //         const radiusInKm = 5; // Nosso raio de 5km

    //         const nearbySpots = allParkingSpots.filter(spot => {
    //             const spotLat = spot.coords.latitude;
    //             const spotLon = spot.coords.longitude;

    //             // Calcula a distância
    //             const distance = getDistanceInKm(userLat, userLon, spotLat, spotLon);

    //             // Retorna true (inclui no filtro) se a distância for <= 5km
    //             return distance <= radiusInKm;
    //         });

    //         setVisibleParkingSpots(nearbySpots);
    //     }
    // }, [location, allParkingSpots]);

    const goToMyLocation = () => {
        if (location) {
            mapRef.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.01,
            }, 1000); // 1000ms = 1 segundo de animação
        }
    };

    const handleMarkerPress = (e: MarkerPressEvent) => {
        const spotId = e.nativeEvent.id; // Pega o ID do marcador
        const spot = parkingSpots.find(p => p.id === spotId);
        if (spot) {
            setSelectedSpot(spot); // Define o estacionamento selecionado
        }
    };

    return (
        <View style={styles.container}>

            {initialRegion ? (
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFillObject}
                    initialRegion={initialRegion}
                    showsUserLocation={true}
                    customMapStyle={theme === 'light' ? lightMapStyle : darkMapStyle}
                    showsMyLocationButton={false}
                    showsCompass={false}
                    toolbarEnabled={false}
                    onMarkerPress={handleMarkerPress}
                    onPress={() => setSelectedSpot(null)}
                >
                    {parkingSpots.map(spot => (
                        <Marker
                            key={spot.id}
                            identifier={spot.id}
                            coordinate={spot.coords}
                            image={require('../assets/images/parking-icon.png')}
                        />
                    ))}
                </MapView>
            ) : (
                <View style={styles.mapPlaceholder}>
                    <ActivityIndicator size="large" color={currentColors.primary} />
                    <Text style={styles.loadingText}>Carregando mapa...</Text>
                </View>
            )}

            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Olá, {userName}</Text>
                </View>

                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={toggleTheme}>
                        <Ionicons
                            name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
                            size={24}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={styles.searchBar}
                onPress={() => navigation.navigate("Search")}
            >
                <Ionicons name="search" size={20} color={currentColors.text} />
                <Text style={styles.searchBarPlaceholder}>Onde sua vaga te espera?</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.recenterButton}
                onPress={goToMyLocation}
            >
                <Ionicons name="locate" size={24} color={currentColors.text} />
            </TouchableOpacity>

            {sheetData && (
                <Animated.View 
                    style={[
                        styles.bottomSheet, 
                        { transform: [{ translateY: sheetAnim }] } // Aplica a animação
                    ]}
                >
                    <Text style={styles.sheetTitle}>{sheetData.title}</Text>
                    <Text style={styles.sheetDescription}>{sheetData.description}</Text>
                    <TouchableOpacity style={styles.reserveButton}>
                        <Text style={styles.reserveButtonText}>Reservar Vaga</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            <View style={styles.navBar}>
                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={26} color={currentColors.primary} />
                    <Text style={[styles.navLabel, { color: currentColors.primary }]}>Início</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("History")}>
                    <Ionicons name="time-outline" size={26} color={currentColors.muted} />
                    <Text style={styles.navLabel}>Histórico</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("Settings")}>
                    <Ionicons name="settings-outline" size={26} color={currentColors.muted} />
                    <Text style={styles.navLabel}>Configurações</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const getStyles = (currentColors: ThemeColors, theme: ThemeName) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    mapPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme === 'light' ? '#EFEFEF' : '#212121',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: currentColors.muted,
        fontSize: 16,
    },
    // mapMock: {
    //     ...StyleSheet.absoluteFillObject,
    //     backgroundColor: theme === 'light' ? "#D9D9D9" : "#212121",
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    // mapMockText: {
    //     color: currentColors.muted,
    //     fontSize: 16,
    //     fontStyle: "italic",
    // },
    header: {
        position: "absolute",
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: currentColors.primary,
        borderRadius: 12,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 6,
    },
    greeting: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    headerIcons: {
        flexDirection: "row",
        gap: 15,
    },
    searchBar: {
        position: 'absolute',
        top: 130,
        left: 20,
        right: 20,
        backgroundColor: "#A9A9A9",
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 8,
    },
    searchBarPlaceholder: {
        color: currentColors.text,
        fontSize: 16,
        marginLeft: 10,
    },
    recenterButton: {
        position: 'absolute',
        top: 195,
        right: 20,
        backgroundColor: currentColors.card,
        borderRadius: 50,
        padding: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 140, // Posição logo acima da navBar
        left: 20,
        right: 20,
        backgroundColor: currentColors.card,
        borderRadius: 16,
        padding: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 10,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: currentColors.text,
    },
    sheetDescription: {
        fontSize: 14,
        color: currentColors.muted,
        marginTop: 4,
        marginBottom: 15,
    },
    reserveButton: {
        backgroundColor: currentColors.primary,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    reserveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    navBar: {
        position: "absolute",
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: currentColors.card,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: currentColors.border,
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
    },
    bottomNav: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    navLabel: {
        fontSize: 13,
        textAlign: "center",
        color: currentColors.muted,
        marginTop: 3,
    },
});

export default HomeScreen;