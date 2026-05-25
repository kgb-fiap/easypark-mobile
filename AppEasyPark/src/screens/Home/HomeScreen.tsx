import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from "react";
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    Animated, Easing, Modal, BackHandler,
    StyleSheet, Linking, Platform
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import MapView, { Marker, Circle } from 'react-native-maps';

// Navigation e Context
import { RootStackScreenProps } from "../../navigation/types";
import { AuthContext } from '../../context/AuthContext';
import { JourneyContext } from '../../context/JourneyContext';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { lightMapStyle, darkMapStyle } from '../../theme/mapStyles';
import { getStyles } from './styles';

// Components e Utils
import { BottomNavBar } from '../../components/BottomNavBar/BottomNavBar';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import { ActiveJourneyCard } from '../../components/ActiveJourneyCard/ActiveJourneyCard';
import { useLocation } from '../../hooks/useLocation';
import { useCountdown } from '../../hooks/useCountdown';
import { formatTime } from '../../utils/formatters';
import { STORAGE_KEYS } from "../../utils/constants";

// API Hooks
import { useEstacionamentos } from '../../api/hooks/useEstacionamentos';

interface PaymentItem {
    id: string;
    type: 'credit';
    brand?: 'Visa' | 'Mastercard';
    last4?: string;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const HomeScreen: React.FC<RootStackScreenProps<'Home'>> = ({ navigation, route }) => {

    const { theme, toggleTheme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors, theme);

    const { signed, user } = useContext(AuthContext);
    const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Visitante';

    const {
        journeyCountdown, startJourneyTimer, stopJourneyTimer,
        isActiveReservation, setIsActiveReservation,
        reservationStatus, setReservationStatus,
        reservedSpot, setReservedSpot,
        isJourneyMinimized, setIsJourneyMinimized
    } = useContext(JourneyContext);

    // Invocando os Hooks
    const { location, initialRegion } = useLocation();
    const { countdown, isActive, startTimer, stopTimer } = useCountdown(300);

    // Chamada da API hospedada na Azure
    const { data: estacionamentosDaApi, isLoading: isLoadingVagas } = useEstacionamentos();

    // Traduzindo os dados para o formato esperado
    const allFormattedSpots = useMemo(() => {
        if (!estacionamentosDaApi) return [];

        return estacionamentosDaApi.map(est => ({
            id: est.id.toString(),
            title: est.nome,
            description: `${est.totalVagas} vagas disponíveis`,
            coords: {
                latitude: est.endereco.latitude,
                longitude: est.endereco.longitude
            }
        }));
    }, [estacionamentosDaApi]);

    // Estados da UI
    const [parkingSpots, setParkingSpots] = useState<any[]>([]);
    const [searchCenter, setSearchCenter] = useState<{ latitude: number, longitude: number } | null>(null);
    const [destinationName, setDestinationName] = useState<string | null>(null);
    const [selectedSpot, setSelectedSpot] = useState<any>(null);
    const [currentDistance, setCurrentDistance] = useState<number>(0);

    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [isPendingReturnToModal, setIsPendingReturnToModal] = useState(false);

    const [savedPayments, setSavedPayments] = useState<PaymentItem[]>([]);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Refs para Animações e Mapa
    const mapRef = useRef<MapView>(null);
    const sheetAnim = useRef(new Animated.Value(300)).current;
    const timerAnim = useRef(new Animated.Value(100)).current;

    // --- Efeitos de Ciclo de Vida ---

    // Solicitação de permissão para Notificações
    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permissão para notificações não concedida.');
            }
        };
        requestPermissions();
    }, []);

    // Sincroniza API com a tela
    useEffect(() => {
        // Só sobrescreve se o usuário não estiver com uma busca ativa
        if (!searchCenter && allFormattedSpots.length > 0) {
            setParkingSpots(allFormattedSpots);
        }
    }, [allFormattedSpots]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => { BackHandler.exitApp(); return true; };
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS)
                .then(val => {
                    if (val) setSavedPayments(JSON.parse(val));

                    if (isPendingReturnToModal && selectedSpot) {
                        setIsConfirmationVisible(true);
                        setIsPendingReturnToModal(false);
                    }
                })
                .catch(e => console.error(e));
        }, [isPendingReturnToModal, selectedSpot])
    );

    useEffect(() => {
        Animated.timing(sheetAnim, {
            toValue: selectedSpot ? 0 : 300,
            duration: 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [selectedSpot]);

    useEffect(() => {
        if (isConfirmationVisible && isActive && countdown === 0) {
            setIsConfirmationVisible(false);
            setSelectedSpot(null);
            Toast.show({ type: 'error', text1: 'Tempo Esgotado', text2: 'A reserva não foi confirmada a tempo.' });
        }
    }, [countdown, isActive, isConfirmationVisible]);

    // --- Efeito de busca com filtro de raio ---
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

                const spotsNearby = allFormattedSpots.filter(spot => {
                    const distance = calculateDistance(
                        latitude, longitude,
                        spot.coords.latitude, spot.coords.longitude
                    );
                    return distance <= 1;
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
    }, [route.params?.selectedSpotParams, allFormattedSpots]);

    // Gatilho de Urgência (Pré-reserva expirando)
    useEffect(() => {
        if (isActive && countdown === 60) {
            Notifications.scheduleNotificationAsync({
                content: {
                    title: '⏳ Tempo Esgotando!',
                    body: 'Sua pré-reserva expira em 1 minuto. Conclua o pagamento para não perder a vaga.',
                    sound: true,
                    data: { tipo: 'alerta_vaga' }, // Útil se for usar analytics depois
                },
                trigger: null, // trigger: null faz disparar imediatamente
            });
        }
    }, [countdown, isActive]);

    // Lógica de Geofencing (Pré-reserva -> Reserva)
    useEffect(() => {
        if (isActiveReservation && reservedSpot && location && reservationStatus === 'PRE_RESERVA') {
            const distanciaKm = calculateDistance(
                location.coords.latitude, location.coords.longitude,
                reservedSpot.coords.latitude, reservedSpot.coords.longitude
            );

            // Se chegou a menos de 500 metros (0.5 km) do estacionamento
            if (distanciaKm <= 0.5) {
                setReservationStatus('RESERVA');
                Toast.show({ type: 'success', text1: 'Destino Próximo!', text2: 'Sua vaga foi confirmada. Catraca liberada.' });
            }
        }
    }, [location, isActiveReservation, reservedSpot, reservationStatus]);

    // Lógica de timeout (Cancela a Pré-reserva se o tempo acabar)
    useEffect(() => {
        if (isActiveReservation && journeyCountdown === 0 && reservationStatus === 'PRE_RESERVA') {
            stopJourneyTimer();
            setIsActiveReservation(false);
            setReservedSpot(null);
            setReservationStatus('PRE_RESERVA');
            Toast.show({ type: 'error', text1: 'Tempo Esgotado', text2: 'Você não chegou a tempo. Pré-reserva cancelada.' });
        }
    }, [journeyCountdown, isActiveReservation, reservationStatus]);

    // --- Handlers ---
    const goToMyLocation = () => {
        if (location) {
            mapRef.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.01,
            }, 1000);

            setParkingSpots(allFormattedSpots);
            setSearchCenter(null);
            setDestinationName(null);
        }
    };

    const handleClearDestination = () => {
        setParkingSpots(allFormattedSpots);
        setSearchCenter(null);
        setDestinationName(null);

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

        if (!signed) {
            setSelectedSpot(null);
            Toast.show({
                type: 'info',
                text1: 'Quase lá!',
                text2: 'Crie uma conta grátis ou faça login para reservar sua vaga.'
            });
            navigation.navigate('Login');
            return;
        }

        setSelectedPaymentId(savedPayments.length > 0 ? savedPayments[0].id : null);
        setIsConfirmationVisible(true);
        startTimer();

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

        if (!acceptedTerms) {
            Toast.show({ type: 'error', text1: 'Termos Obrigatórios', text2: 'Você precisa aceitar as políticas de cancelamento.' });
            return;
        }

        stopTimer();
        setIsConfirmationVisible(false);
        setAcceptedTerms(false);

        setReservedSpot(selectedSpot);
        setSelectedSpot(null);
        setIsActiveReservation(true);
        startJourneyTimer();

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

        const url = Platform.select({
            ios: `maps://app?daddr=${latitude},${longitude}&q=${encodeURIComponent(label)}`,
            android: `google.navigation:q=${latitude},${longitude}`
        });

        if (url) {
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
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
        setAcceptedTerms(false);
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    return (
        <View style={styles.container}>

            {initialRegion && !isLoadingVagas ? (
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
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <View style={{
                                width: 36, height: 36, backgroundColor: currentColors.primary,
                                borderRadius: 18, justifyContent: 'center', alignItems: 'center',
                                borderWidth: 3, borderColor: '#ffffff', shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3,
                                shadowRadius: 4, elevation: 5,
                            }}>
                                <Ionicons name="flag" size={18} color="#ffffff" />
                            </View>
                        </Marker>
                    )}

                    {searchCenter && (
                        <Circle
                            center={searchCenter}
                            radius={1000}
                            strokeColor="rgba(3, 187, 133, 0.4)"
                            strokeWidth={2}
                            fillColor="rgba(3, 187, 133, 0.15)"
                        />
                    )}

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
                    <Text style={styles.loadingText}>
                        {isLoadingVagas ? 'Buscando vagas disponíveis...' : 'Encontrando sua localização...'}
                    </Text>
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

                            <View style={{
                                backgroundColor: theme === 'light' ? '#F9F9F9' : '#252525',
                                padding: 12,
                                borderRadius: 8,
                                marginBottom: 15,
                                borderWidth: 1,
                                borderColor: currentColors.border
                            }}>
                                <Text style={{ fontFamily: 'Inter-Bold', fontSize: 13, color: '#D9534F', marginBottom: 10 }}>
                                    ⚠️ Regras de Cancelamento:
                                </Text>
                                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 11, color: currentColors.text, lineHeight: 16 }}>
                                    • Esta vaga está temporariamente travada para você por 5 minutos. Se o pagamento não for detectado, ela ficará visível para outros motoristas.{'\n'}
                                    • Cancelamento gratuito em até 30 min antes do horário previsto.{'\n'}
                                    • Em caso de não comparecimento (no-show), será retida uma taxa de 20% do valor.
                                </Text>

                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
                                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                                >
                                    <Ionicons
                                        name={acceptedTerms ? "checkbox" : "square-outline"}
                                        size={20}
                                        color={acceptedTerms ? currentColors.primary : currentColors.muted}
                                    />
                                    <Text style={{ fontFamily: 'Inter-Medium', fontSize: 12, color: currentColors.text, marginLeft: 8 }}>
                                        Li e concordo com as regras da vaga.
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.timerContainer}>
                                <View style={styles.timerBarBackground}>
                                    <Animated.View style={[styles.timerBarForeground, {
                                        width: timerAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
                                    }]} />
                                </View>
                                <Text style={styles.timerText}>Tempo restante para pagar: {formatTime(countdown)}</Text>
                            </View>

                            <View style={styles.actionRow}>
                                <TouchableOpacity onPress={handleCancelReservation}>
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>

                                <PrimaryButton
                                    title="Confirmar reserva"
                                    onPress={handleConfirmReservation}
                                    containerStyle={{ flex: 1, marginLeft: 15 }}
                                />
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>

            {isActiveReservation && !isJourneyMinimized ? (
                <ActiveJourneyCard
                    spotName={reservedSpot?.title || "Estacionamento"}
                    countdown={journeyCountdown}
                    status={reservationStatus}
                    distanceKm={currentDistance}
                    onCenterMap={goToDestination}
                    onNavigate={handleNavigateToSpot}
                    onMinimize={() => setIsJourneyMinimized(true)}
                    onCheckin={() => {
                        stopJourneyTimer();
                        setIsActiveReservation(false);
                        setReservationStatus('PRE_RESERVA');
                        setIsJourneyMinimized(false);

                        Notifications.scheduleNotificationAsync({
                            content: {
                                title: '✅ Check-in Realizado',
                                body: `Bem-vindo ao ${reservedSpot?.title}! A catraca já foi liberada para sua entrada.`,
                                sound: true,
                            },
                            trigger: null,
                        });
                        Toast.show({ type: 'success', text1: 'Check-in realizado!', text2: 'Bem-vindo ao estacionamento.' });
                    }}
                    onCancel={() => {
                        handleCancelJourney();
                        setIsJourneyMinimized(false);
                    }}
                />
            ) : (
                <>
                    {!isActiveReservation && (
                        destinationName ? (
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
                        )
                    )}

                    <TouchableOpacity
                        style={[
                            styles.recenterButton,
                            destinationName ? { transform: [{ translateY: 25 }] } : {},
                            (isActiveReservation && isJourneyMinimized) ? { marginTop: -60 } : {}
                        ]}
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