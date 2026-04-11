import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    Animated, Easing, Modal, ScrollView, BackHandler,
    StyleSheet, Linking, Platform
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import MapView, { Marker, Circle, MarkerPressEvent } from 'react-native-maps';

// Arquitetura e Contexto
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { lightMapStyle, darkMapStyle } from '../../theme/mapStyles';
import { getStyles } from './styles';

// Componentes e Hooks Reutilizáveis
import { BottomNavBar } from '../../components/BottomNavBar/BottomNavBar';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import { ActiveJourneyCard } from '../../components/ActiveJourneyCard/ActiveJourneyCard';
import { useLocation } from '../../hooks/useLocation';
import { useCountdown } from '../../hooks/useCountdown';
import { formatTime } from '../../utils/formatters';
import { STORAGE_KEYS } from '../../utils/constants';

const MOCK_PARKING_SPOTS = [
    { id: '1', title: "Estacionamento Fiap", description: "Vagas: 10", coords: { latitude: -23.56158, longitude: -46.65609 } },
    { id: '2', title: "Shopping Pátio Paulista", description: "Vagas: 30", coords: { latitude: -23.56275, longitude: -46.64855 } },
    { id: '3', title: "Estacionamento Augusta", description: "Vagas: 5", coords: { latitude: -23.55145, longitude: -46.65825 } },
];

interface PaymentItem {
    id: string;
    type: 'credit';
    brand?: 'Visa' | 'Mastercard';
    last4?: string;
}

const HomeScreen: React.FC<RootStackScreenProps<'Home'>> = ({ navigation, route }) => {

    const { theme, toggleTheme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors, theme);

    // Invocando os Hooks de Regra de Negócio
    const { location, initialRegion } = useLocation();
    const { countdown, isActive, startTimer, stopTimer } = useCountdown(300);
    const { countdown: journeyCountdown, startTimer: startJourneyTimer, stopTimer: stopJourneyTimer } = useCountdown(900);

    // Estados da UI
    const [userName, setUserName] = useState<string>('Usuário');
    const [parkingSpots, setParkingSpots] = useState(MOCK_PARKING_SPOTS);
    const [searchCenter, setSearchCenter] = useState<{ latitude: number, longitude: number } | null>(null);
    const [destinationName, setDestinationName] = useState<string | null>(null);
    const [selectedSpot, setSelectedSpot] = useState<any>(null);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [isPendingReturnToModal, setIsPendingReturnToModal] = useState(false);
    const [savedPayments, setSavedPayments] = useState<PaymentItem[]>([]);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const [isActiveReservation, setIsActiveReservation] = useState(false);
    const [reservedSpot, setReservedSpot] = useState<any>(null);

    // Refs para Animações e Mapa
    const mapRef = useRef<MapView>(null);
    const sheetAnim = useRef(new Animated.Value(300)).current;
    const timerAnim = useRef(new Animated.Value(100)).current; // Controla apenas o aspecto visual (largura)

    // --- Efeitos de Ciclo de Vida ---

    // Carrega Nome
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEYS.USER_NAME)
            .then(name => name && setUserName(name.split(' ')[0]));
    }, []);

    // Intercepta Botão Voltar do Android
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => { BackHandler.exitApp(); return true; };
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [])
    );

    // Carrega Métodos de Pagamento e Reabre Modal se necessário
    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS)
                .then(val => {
                    if (val) setSavedPayments(JSON.parse(val));
                    
                    if (isPendingReturnToModal) {
                        if (selectedSpot) {
                            setIsConfirmationVisible(true);
                        }
                        setIsPendingReturnToModal(false);
                    }
                })
                .catch(e => console.error(e));
        }, [isPendingReturnToModal, selectedSpot])
    );

    // Animação do Bottom Sheet de Vaga
    useEffect(() => {
        Animated.timing(sheetAnim, {
            toValue: selectedSpot ? 0 : 300,
            duration: 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [selectedSpot]);

    // Ouve o Timer do Hook para desativar o modal automaticamente
    useEffect(() => {
        if (isConfirmationVisible && isActive && countdown === 0) {
            setIsConfirmationVisible(false);
            setSelectedSpot(null);
            Toast.show({ type: 'error', text1: 'Tempo Esgotado', text2: 'A reserva não foi confirmada a tempo.' });
        }
    }, [countdown, isActive, isConfirmationVisible]);

    // --- Handlers ---
    const goToMyLocation = () => {
        if (location) {
            mapRef.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.01,
            }, 1000);

            setParkingSpots(MOCK_PARKING_SPOTS); // Reseta o filtro mostrando todos os estacionamentos novamente
            setSearchCenter(null); // Limpa o ponto verde e o círculo do mapa
            setDestinationName(null); // Apaga o nome do destino ao limpar o mapa
        }
    };

    // Limpar a busca
    const handleClearDestination = () => {
        setParkingSpots(MOCK_PARKING_SPOTS); // Volta os pinos ao normal
        setSearchCenter(null);               // Apaga a esfera verde
        setDestinationName(null);            // Esconde a barra de destino

        // Se tiver localização, volta a câmera para o usuário
        if (location) {
            mapRef.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

    const LATITUDE_OFFSET = 0.003;
    const goToDestination = () => {
        if (reservedSpot?.coords) {
            mapRef.current?.animateToRegion({
                latitude: reservedSpot.coords.latitude - LATITUDE_OFFSET,
                longitude: reservedSpot.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

    const handleReserveClick = () => {
        setSelectedPaymentId(savedPayments.length > 0 ? savedPayments[0].id : null);
        setIsConfirmationVisible(true);
        startTimer(); // Aciona o Hook

        // Aciona a animação visual da barra
        timerAnim.setValue(100);
        Animated.timing(timerAnim, {
            toValue: 0,
            duration: 300000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    };

    const handleConfirmReservation = () => {
        if (!selectedPaymentId) {
            Toast.show({ type: 'error', text1: 'Atenção', text2: 'Escolha um método de pagamento.' });
            return;
        }

        // Para o relógio e esconde o modal
        stopTimer(); 
        setIsConfirmationVisible(false);

        // Ativa a reserva
        setReservedSpot(selectedSpot); 
        setSelectedSpot(null); 
        setIsActiveReservation(true); 
        startJourneyTimer();

        // Redirecionamento e Mensagens Inteligentes
        if (selectedPaymentId === 'pix') {
            navigation.navigate('PixPayment');
            Toast.show({ type: 'success', text1: 'Quase lá!', text2: 'Realize o pagamento PIX para liberar a cancela.' });
        } else {
            Toast.show({ type: 'success', text1: 'Vaga Reservada!', text2: `Sua vaga no ${selectedSpot?.title} está garantida.` });
        }
    };

    const handleNavigateToSpot = () => {
        if (!reservedSpot?.coords) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Localização do estacionamento não encontrada.' });
            return;
        }

        const { latitude, longitude } = reservedSpot.coords;
        const label = reservedSpot.title || "Estacionamento";

        // Monta a URL (URI Scheme) correta para cada sistema operacional
        const url = Platform.select({
            // iOS: Abre o Apple Maps já com a rota traçada para o destino
            ios: `maps://app?daddr=${latitude},${longitude}&q=${encodeURIComponent(label)}`,
            // Android: Abre o Google Maps no modo de navegação
            android: `google.navigation:q=${latitude},${longitude}`
        });

        if (url) {
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    // Fallback: Abre no navegador se o app de mapa não existir
                    const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
                    Linking.openURL(browserUrl);
                }
            }).catch(err => console.error('Erro ao abrir o mapa', err));
        }
    };

    const handleCancelJourney = () => {
        stopJourneyTimer();
        setIsActiveReservation(false);
        setReservedSpot(null);
    };

    const handleCancelReservation = () => {
        stopTimer();
        timerAnim.stopAnimation();
        setIsConfirmationVisible(false);
    };

    // Algoritmo de Haversine: Calcula a distância em KM entre duas coordenadas geográficas
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distância em quilômetros
    };

    // --- Efeito: Intercepta o resultado da Tela de Busca e Filtra o Raio de 1km ---
    useEffect(() => {
        if (route.params?.selectedSpotParams?.coords) {
            const { latitude, longitude } = route.params.selectedSpotParams.coords;

            setTimeout(() => {
                if (mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.04,
                    }, 1000);
                }

                setSearchCenter({ latitude, longitude });

                const labelName = route.params?.selectedSpotParams?.label;
                if (labelName) {
                    setDestinationName(labelName);
                }

                const spotsNearby = MOCK_PARKING_SPOTS.filter(spot => {
                    const distance = calculateDistance(
                        latitude, longitude,
                        spot.coords.latitude, spot.coords.longitude
                    );
                    return distance <= 1; // Raio de 1km
                });

                setParkingSpots(spotsNearby);

                if (spotsNearby.length === 0) {
                    Toast.show({ type: 'info', text1: 'Poxa...', text2: 'Nenhum estacionamento em um raio de 1km.' });
                } else {
                    Toast.show({ type: 'success', text1: 'Destino Encontrado', text2: `Achamos ${spotsNearby.length} opções perto de você!` });
                }

                setTimeout(() => {
                    navigation.setParams({ selectedSpotParams: undefined });
                }, 1500);

            }, 400);
        }
    }, [route.params?.selectedSpotParams]);

    return (
        <View style={styles.container}>

            {/* Mapa ou Loading */}
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
                    onPress={() => setSelectedSpot(null)}
                >
                    {searchCenter && (
                        <Marker
                            coordinate={searchCenter}
                            title="Destino Pesquisado"
                            anchor={{ x: 0.5, y: 0.5 }} // Propriedade que garante que o "centro" da bolinha fique exatamente na rua pesquisada
                        >
                            <View style={{
                                width: 36,
                                height: 36,
                                backgroundColor: currentColors.primary,
                                borderRadius: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 3,
                                borderColor: '#ffffff',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 5,
                            }}>
                                <Ionicons name="flag" size={18} color="#ffffff" />
                            </View>
                        </Marker>
                    )}

                    {/* Esfera com raio de 1km */}
                    {searchCenter && (
                        <Circle
                            center={searchCenter}
                            radius={1000}
                            strokeColor="rgba(3, 187, 133, 0.4)"
                            strokeWidth={2}
                            fillColor="rgba(3, 187, 133, 0.15)"
                        />
                    )}

                    {/* Pinos dos estacionamentos */}
                    {parkingSpots.map(spot => {
                        const isTheReservedSpot = reservedSpot?.id === spot.id;

                        return (
                            <Marker
                                key={spot.id}
                                identifier={spot.id}
                                coordinate={spot.coords}
                                onPress={() => {
                                    if (!isActiveReservation) {
                                        setSelectedSpot(spot);
                                    }
                                }}
                                image={require('../../../assets/images/parking-icon.png')}
                                opacity={isActiveReservation && !isTheReservedSpot ? 0.4 : 1}
                            />
                        );
                    })}
                </MapView>
            ) : (
                <View style={styles.mapPlaceholder}>
                    <ActivityIndicator size="large" color={currentColors.primary} />
                    <Text style={styles.loadingText}>Carregando mapa...</Text>
                </View>
            )}

            {/* Cabeçalho */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Olá, {userName}</Text>
                <TouchableOpacity onPress={toggleTheme}>
                    <Ionicons name={theme === 'light' ? 'moon-outline' : 'sunny-outline'} size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {selectedSpot && (
                <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: sheetAnim }] }]}>
                    <Text style={styles.sheetTitle}>{selectedSpot.title}</Text>
                    <Text style={styles.sheetDescription}>{selectedSpot.description}</Text>

                    <PrimaryButton title="Reservar Vaga" onPress={handleReserveClick} />
                </Animated.View>
            )}

            {/* Modal de confirmação */}
            <Modal animationType="slide" transparent={true} visible={isConfirmationVisible} onRequestClose={handleCancelReservation}>
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmationPanel}>

                        <View style={styles.modalHeader}>
                            <Text style={styles.sheetTitle}>Confirmar Reserva?</Text>
                            <Text style={styles.sheetDescription}>{selectedSpot?.title}</Text>
                            <Text style={styles.sheetSubText}>Chegue em 15 minutos para garantir.</Text>
                        </View>

                        <View style={styles.paymentSection}>
                            <Text style={styles.pickerLabel}>Método de Pagamento:</Text>
                            <View style={styles.paymentContainer}>

                                {/* Mostrando no máximo os 2 últimos cartões*/}
                                {savedPayments.slice(0, 2).map(card => {
                                    const isSelected = selectedPaymentId === card.id;
                                    return (
                                        <TouchableOpacity
                                            key={card.id}
                                            style={[styles.pickerButton, isSelected && styles.pickerButtonSelected]}
                                            onPress={() => setSelectedPaymentId(card.id)}
                                        >
                                            <Ionicons name="card" size={20} color={isSelected ? '#fff' : currentColors.primary} />
                                            <Text style={[styles.pickerButtonText, isSelected && styles.pickerButtonTextSelected]}>
                                                {`${card.brand} •••• ${card.last4}`}
                                            </Text>
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
                                        <Ionicons name="cash-outline" size={20} color={selectedPaymentId === 'dinheiro' ? '#fff' : currentColors.primary} />
                                        <Text style={[styles.pickerButtonText, selectedPaymentId === 'dinheiro' && styles.pickerButtonTextSelected]}>Dinheiro</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => {
                                        setIsPendingReturnToModal(true); 
                                        setIsConfirmationVisible(false); 
                                        navigation.navigate('PaymentMethods'); 
                                    }}
                                >
                                    <Ionicons name="add-circle-outline" size={20} color={currentColors.primary} />
                                    <Text style={styles.addButtonText}>Adicionar novo cartão</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.footerSection}>
                            <View style={styles.timerContainer}>
                                <View style={styles.timerBarBackground}>
                                    <Animated.View style={[styles.timerBarForeground, {
                                        width: timerAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
                                    }]} />
                                </View>
                                <Text style={styles.timerText}>Tempo restante: {formatTime(countdown)}</Text>
                            </View>

                            <View style={styles.actionRow}>
                                <TouchableOpacity onPress={handleCancelReservation}>
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>

                                <PrimaryButton title="Confirmar" onPress={handleConfirmReservation} containerStyle={{ flex: 1, marginLeft: 15 }} />
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>

            {isActiveReservation ? (
                // MODO VIAGEM: Mostra o card de jornada ativa com contagem regressiva, botão de centralizar no mapa, navegação e check-in
                <ActiveJourneyCard
                    spotName={reservedSpot?.title || "Estacionamento"}
                    countdown={journeyCountdown}
                    onCenterMap={goToDestination}

                    onNavigate={handleNavigateToSpot}

                    onCheckin={() => {
                        stopJourneyTimer();
                        setIsActiveReservation(false);
                        Toast.show({ type: 'success', text1: 'Check-in realizado!', text2: 'Bem-vindo ao estacionamento.' });
                    }}
                    onCancel={handleCancelJourney}
                />
            ) : (
                // MODO BUSCA (Padrão): Mostra a barra de busca, botão de GPS e Menu Inferior
                <>
                    {destinationName ? (
                        <View style={[styles.searchBar, { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: currentColors.card, borderColor: currentColors.primary, borderWidth: 1 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, overflow: 'hidden' }}>
                                <Ionicons name="flag" size={20} color={currentColors.primary} style={{ marginRight: 10 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontFamily: 'Inter-Medium', fontSize: 12, color: currentColors.muted }}>Destino selecionado:</Text>
                                    <Text style={{ fontFamily: 'Inter-Bold', fontSize: 15, color: currentColors.text }} numberOfLines={1}>{destinationName}</Text>
                                </View>
                            </View>
                            
                            <TouchableOpacity onPress={handleClearDestination} style={{ padding: 5 }}>
                                <Ionicons name="close-circle" size={24} color={currentColors.muted} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={[styles.searchBar, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => navigation.navigate("Search")}>
                            <Ionicons name="search" size={20} color={currentColors.text} style={{ marginRight: 10 }} />
                            <Text style={[styles.searchBarPlaceholder, { flex: 1 }]} numberOfLines={1}>
                                Onde sua vaga te espera?
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity 
                        style={[styles.recenterButton, destinationName ? { transform: [{ translateY: 25 }] } : {}]} 
                        onPress={goToMyLocation}
                    >
                        <Ionicons name="locate" size={24} color={currentColors.text} />
                    </TouchableOpacity>

                    <BottomNavBar currentRoute="Home" />
                </>
            )}
        </View>
    );
};

export default HomeScreen;