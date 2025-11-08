import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
    Animated, Easing, Modal, ScrollView
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import MapView, { Marker, Region, MarkerPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';

import { useTheme } from '../src/context/ThemeContext';
import { colors, ThemeColors, ThemeName } from '../src/theme/colors';
import { lightMapStyle, darkMapStyle } from '../src/theme/mapStyles';

const MOCK_PARKING_SPOTS = [
    { id: '1', title: "Estacionamento Fiap", description: "Vagas: 10", coords: { latitude: -23.56158, longitude: -46.65609 } },
    { id: '2', title: "Shopping Pátio Paulista", description: "Vagas: 30", coords: { latitude: -23.56275, longitude: -46.64855 } },
    { id: '3', title: "Estacionamento Augusta", description: "Vagas: 5", coords: { latitude: -23.55145, longitude: -46.65825 } },
    // Um estacionamento distante (ex: Morumbi) para testar o filtro de 5km
    { id: '4', title: "Estacionamento Morumbi", description: "Vagas: 50", coords: { latitude: -23.6234, longitude: -46.7388 } },
];
type ParkingSpot = typeof MOCK_PARKING_SPOTS[0];

interface PaymentItem {
    id: string;
    type: 'credit';
    brand?: 'Visa' | 'Mastercard';
    last4?: string;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {

    const { theme, toggleTheme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors, theme);

    // --- Estados da UI e Dados ---
    const [userName, setUserName] = useState<string>('Usuário');
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [initialRegion, setInitialRegion] = useState<Region | null>(null);
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);

    // --- Estados dos Painéis e Modal ---
    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
    const [sheetData, setSheetData] = useState<ParkingSpot | null>(null);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

    // --- Estados do Modal de Confirmação ---
    const [savedPayments, setSavedPayments] = useState<PaymentItem[]>([]);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(30);

    // --- Refs ---
    const mapRef = useRef<MapView>(null);
    const sheetAnim = useRef(new Animated.Value(300)).current;
    const timerAnim = useRef(new Animated.Value(100)).current;
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // --- Lógica do Timer de Confirmação ---
    const stopTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        timerAnim.stopAnimation(); // Para a animação da barra
    };

    const handleTimeout = () => {
        Toast.show({ type: 'error', text1: 'Tempo Esgotado', text2: 'A reserva não foi confirmada a tempo.' });
        setIsConfirmationVisible(false);
        setSelectedSpot(null); // Fecha ambos os painéis
    };

    const startTimer = () => {
        stopTimer();
        setCountdown(30);
        timerAnim.setValue(100); // Reseta a barra para 100%

        // Anima a barra de 100% para 0% em 30 segundos
        Animated.timing(timerAnim, {
            toValue: 0,
            duration: 30000,
            easing: Easing.linear,
            useNativeDriver: false, // 'width' não é suportado pelo driver nativo
        }).start();

        // Inicia o contador de texto
        timerIntervalRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    stopTimer();
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // --- Handlers de Ação do Mapa ---
    const goToMyLocation = () => {
        if (location) {
            mapRef.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

    const handleMarkerPress = (e: MarkerPressEvent) => {
        const spotId = e.nativeEvent.id;
        const spot = parkingSpots.find(p => p.id === spotId);
        if (spot) {
            setSelectedSpot(spot);
            setSelectedPaymentId(null); // Reseta o pagamento selecionado
        }
    };

    // --- Handlers de Ação dos Painéis (Reserva) ---
    const handleReserveClick = () => {
        // Pré-seleciona o primeiro cartão, se existir
        if (savedPayments.length > 0) {
            setSelectedPaymentId(savedPayments[0].id);
        } else {
            setSelectedPaymentId(null); // Se não houver nenhum cartão, força o usuário a escolher
        }
        setIsConfirmationVisible(true);
        startTimer();
    };

    const handleConfirmReservation = () => { // Handle de confirmação da reserva
        // Validação do pagamento selecionado
        if (!selectedPaymentId) {
            Toast.show({ type: 'error', text1: 'Pagamento não selecionado', text2: 'Por favor, escolha um método de pagamento.' });
            return;
        }
        stopTimer();
        Toast.show({ type: 'success', text1: 'Vaga Reservada!', text2: `Sua vaga no ${selectedSpot?.title} está garantida.` });
        setIsConfirmationVisible(false);
        setSelectedSpot(null);
    };

    const handleCancelReservation = () => { // Handle de cancelamento da reserva
        stopTimer();
        Toast.show({ type: 'info', text1: 'Reserva cancelada.' });
        setIsConfirmationVisible(false); // Fecha o modal (painel de info continua)
    };

    // Carrega o nome do usuário (ao iniciar)
    useEffect(() => {
        // Função para buscar os dados do usuário:
        const loadUserName = async () => {
            try {
                // Busca o nome do usuário salvo no armazenamento do dispositivo
                const storedName = await AsyncStorage.getItem('@user_name');

                // Se um nome foi encontrado, atualiza o estado.
                if (storedName !== null) {
                    // Pega o primeiro nome para a saudação
                    const firstName = storedName.split(' ')[0];
                    setUserName(firstName);
                }
            } catch (e) {
                // Em caso de erro:
                console.error("Falha ao carregar o nome.", e);
            }
        };
        // Executa a função de carregamento
        loadUserName();
    }, []); // O array vazio garante que o efeito execute apenas na montagem do componente e apenas uma única vez

    // Pede permissão e carrega a localização (ao iniciar)
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

    // Carrega os estacionamentos (ao iniciar)
    useEffect(() => {
        // Simula uma busca na API
        setParkingSpots(MOCK_PARKING_SPOTS);
    }, []);

    // Efeito para Animação do Painel de Info (observa 'selectedSpot')
    useFocusEffect(
        useCallback(() => {
            const loadPaymentMethods = async () => {
                try {
                    const jsonValue = await AsyncStorage.getItem('@payment_methods');
                    if (jsonValue !== null) {
                        setSavedPayments(JSON.parse(jsonValue));
                    }
                } catch (e) {
                    console.error("Falha ao carregar métodos.", e);
                }
            };
            loadPaymentMethods();
        }, [])
    );

    // Efeito para mostrar a opção de reservar quando um estacionamento é selecionado
    useEffect(() => {
        if (selectedSpot) {
            setSheetData(selectedSpot);
            Animated.timing(sheetAnim, {
                toValue: 0,
                duration: 200,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            stopTimer();
            Animated.timing(sheetAnim, {
                toValue: 300,
                duration: 200,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start(() => {
                setSheetData(null);
            });
        }
    }, [selectedSpot]);
    
    return (
        <View style={styles.container}>

            {/* Tela de Loading enquanto o mapa carrega a região */}
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
                    onPress={() => setSelectedSpot(null)} // Limpa seleção ao clicar no mapa
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

            {/* --- Painel de Informações --- */}
            {sheetData && (
                <Animated.View
                    style={[
                        styles.bottomSheet,
                        { transform: [{ translateY: sheetAnim }] }
                    ]}
                >
                    <Text style={styles.sheetTitle}>{sheetData.title}</Text>
                    <Text style={styles.sheetDescription}>{sheetData.description}</Text>
                    <TouchableOpacity style={styles.reserveButton} onPress={handleReserveClick}>
                        <Text style={styles.reserveButtonText}>Reservar Vaga</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* --- Modal de Confirmação --- */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isConfirmationVisible}
                onRequestClose={handleCancelReservation}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmationPanel}>
                        <Text style={styles.sheetTitle}>Confirmar Reserva?</Text>
                        <Text style={styles.sheetDescription}>
                            {sheetData?.title}
                        </Text>
                        <Text style={styles.sheetSubText}>
                            Você deve chegar em 15 minutos para garantir sua vaga.
                        </Text>

                        <Text style={styles.pickerLabel}>Método de Pagamento:</Text>

                        <ScrollView style={styles.paymentList} nestedScrollEnabled={true}>
                            {savedPayments.map(card => {
                                const isSelected = selectedPaymentId === card.id;
                                return (
                                    <TouchableOpacity
                                        key={card.id}
                                        style={[styles.pickerButton, isSelected && styles.pickerButtonSelected]}
                                        onPress={() => setSelectedPaymentId(card.id)}
                                    >
                                        <Ionicons name="card" size={18} color={isSelected ? '#fff' : currentColors.primary} />
                                        <Text style={[styles.pickerButtonText, isSelected && styles.pickerButtonTextSelected]}>{`${card.brand} •••• ${card.last4}`}</Text>
                                    </TouchableOpacity>
                                );
                            })}

                            <View style={styles.paymentRow}>
                                <TouchableOpacity
                                    style={[styles.halfPickerButton, selectedPaymentId === 'pix' && styles.pickerButtonSelected]}
                                    onPress={() => setSelectedPaymentId('pix')}
                                >
                                    <FontAwesome6 name="pix" size={18} color={selectedPaymentId === 'pix' ? '#fff' : currentColors.primary} />
                                    <Text style={[styles.pickerButtonText, selectedPaymentId === 'pix' && styles.pickerButtonTextSelected]}>Pix</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.halfPickerButton, selectedPaymentId === 'dinheiro' && styles.pickerButtonSelected]}
                                    onPress={() => setSelectedPaymentId('dinheiro')}
                                >
                                    <Ionicons name="cash-outline" size={18} color={selectedPaymentId === 'dinheiro' ? '#fff' : currentColors.primary} />
                                    <Text style={[styles.pickerButtonText, selectedPaymentId === 'dinheiro' && styles.pickerButtonTextSelected]}>Dinheiro</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    setIsConfirmationVisible(false); // Fecha o modal
                                    navigation.navigate('PaymentMethods'); // Navega para métodos de pagamento
                                }}
                            >
                                <Ionicons name="add-circle-outline" size={20} color={currentColors.primary} />
                                <Text style={styles.addButtonText}>Adicionar novo cartão</Text>
                            </TouchableOpacity>
                        </ScrollView>

                        <View style={styles.timerContainer}>
                            <View style={styles.timerBarBackground}>
                                <Animated.View style={[styles.timerBarForeground, {
                                    width: timerAnim.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: ['0%', '100%']
                                    })
                                }]} />
                            </View>
                            <Text style={styles.timerText}>Tempo restante: {countdown}s</Text>
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReservation}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmReservation}>
                                <Text style={styles.confirmButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* --- Barra de Navegação Inferior --- */}
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
        backgroundColor: currentColors.card,
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
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 140,
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
        textAlign: 'center',
    },
    sheetDescription: {
        fontSize: 14,
        color: currentColors.muted,
        marginTop: 4,
        marginBottom: 15,
        textAlign: 'center',
    },
    sheetSubText: {
        fontSize: 14,
        color: currentColors.text,
        textAlign: 'center',
        marginBottom: 5,
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    confirmationPanel: {
        height: '70%',
        width: '100%',
        backgroundColor: currentColors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 25,
        alignItems: 'center',
    },
    pickerLabel: {
        fontSize: 14,
        color: currentColors.muted,
        marginTop: 15,
        marginBottom: 10,
        width: '100%',
    },
    pickerContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
    },
    pickerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: currentColors.border,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    pickerButtonSelected: {
        backgroundColor: currentColors.primary,
        borderColor: currentColors.primary,
    },
    pickerButtonText: {
        color: currentColors.text,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    pickerButtonTextSelected: {
        color: '#fff',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: -4,
    },
    halfPickerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: currentColors.border,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    timerContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    timerBarBackground: {
        height: 8,
        width: '100%',
        backgroundColor: currentColors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    timerBarForeground: {
        height: '100%',
        backgroundColor: currentColors.primary,
        borderRadius: 4,
    },
    timerText: {
        fontSize: 14,
        color: currentColors.muted,
        marginTop: 5,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 25,
    },
    cancelButton: {
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    cancelButtonText: {
        color: currentColors.muted,
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmButton: {
        backgroundColor: currentColors.primary,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    paymentList: {
        width: '100%',
        maxHeight: 150,
        marginBottom: 25,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: currentColors.primary,
        borderStyle: 'dashed',
        borderRadius: 12,
    },
    addButtonText: {
        color: currentColors.primary,
        fontSize: 14,
        marginLeft: 10,
        fontWeight: '500',
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