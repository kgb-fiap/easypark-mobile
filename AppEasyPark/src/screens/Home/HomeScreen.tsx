import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    Animated, Easing, Modal, ScrollView, BackHandler, StyleSheet
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import MapView, { Marker, MarkerPressEvent } from 'react-native-maps';

// Arquitetura e Contexto
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { lightMapStyle, darkMapStyle } from '../../theme/mapStyles';
import { getStyles } from './styles';

// Componentes e Hooks Reutilizáveis
import { BottomNavBar } from '../../components/BottomNavBar/BottomNavBar';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import { useLocation } from '../../hooks/useLocation';
import { useCountdown } from '../../hooks/useCountdown';
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

const HomeScreen: React.FC<RootStackScreenProps<'Home'>> = ({ navigation }) => {
    const { theme, toggleTheme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors, theme);

    // 1. Invocando os Hooks de Regra de Negócio
    const { location, initialRegion } = useLocation();
    const { countdown, isActive: isTimerActive, startTimer, stopTimer } = useCountdown(30);

    // 2. Estados da UI
    const [userName, setUserName] = useState<string>('Usuário');
    const [parkingSpots, setParkingSpots] = useState(MOCK_PARKING_SPOTS);
    const [selectedSpot, setSelectedSpot] = useState<any>(null);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [savedPayments, setSavedPayments] = useState<PaymentItem[]>([]);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

    // 3. Refs para Animações e Mapa
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

    // Carrega Métodos de Pagamento quando a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS)
                .then(val => val && setSavedPayments(JSON.parse(val)))
                .catch(e => console.error(e));
        }, [])
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
        if (isConfirmationVisible && isTimerActive && countdown === 0) {
            setIsConfirmationVisible(false);
            setSelectedSpot(null);
            Toast.show({ type: 'error', text1: 'Tempo Esgotado', text2: 'A reserva não foi confirmada a tempo.' });
        }
    }, [countdown, isTimerActive, isConfirmationVisible]);

    // --- Handlers ---
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

    const handleReserveClick = () => {
        setSelectedPaymentId(savedPayments.length > 0 ? savedPayments[0].id : null);
        setIsConfirmationVisible(true);
        startTimer(); // Aciona o Hook
        
        // Aciona a animação visual da barra
        timerAnim.setValue(100);
        Animated.timing(timerAnim, {
            toValue: 0,
            duration: 30000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    };

    const handleConfirmReservation = () => {
        if (!selectedPaymentId) {
            Toast.show({ type: 'error', text1: 'Atenção', text2: 'Escolha um método de pagamento.' });
            return;
        }
        stopTimer(); // Para o Hook
        Toast.show({ type: 'success', text1: 'Vaga Reservada!', text2: `Sua vaga no ${selectedSpot?.title} está garantida.` });
        setIsConfirmationVisible(false);
        setSelectedSpot(null);
    };

    const handleCancelReservation = () => {
        stopTimer(); // Para o hook
        setIsConfirmationVisible(false);
    };

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
                    {parkingSpots.map(spot => (
                        <Marker
                            key={spot.id}
                            identifier={spot.id}
                            coordinate={spot.coords}
                            onPress={() => setSelectedSpot(spot)}
                            image={require('../../../assets/images/parking-icon.png')}
                        />
                    ))}
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

            {/* Barra de Busca e GPS */}
            <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate("Search")}>
                <Ionicons name="search" size={20} color={currentColors.text} />
                <Text style={styles.searchBarPlaceholder}>Onde sua vaga te espera?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recenterButton} onPress={goToMyLocation}>
                <Ionicons name="locate" size={24} color={currentColors.text} />
            </TouchableOpacity>

            {/* Painel Inferior de Vaga */}
            {selectedSpot && (
                <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: sheetAnim }] }]}>
                    <Text style={styles.sheetTitle}>{selectedSpot.title}</Text>
                    <Text style={styles.sheetDescription}>{selectedSpot.description}</Text>
                    
                    <PrimaryButton title="Reservar Vaga" onPress={handleReserveClick} />
                </Animated.View>
            )}

            {/* Modal de Confirmação (Agora mais limpo usando PrimaryButton) */}
            <Modal animationType="slide" transparent={true} visible={isConfirmationVisible} onRequestClose={handleCancelReservation}>
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmationPanel}>
                        <Text style={styles.sheetTitle}>Confirmar Reserva?</Text>
                        <Text style={styles.sheetDescription}>{selectedSpot?.title}</Text>
                        <Text style={styles.sheetSubText}>Chegue em 15 minutos para garantir.</Text>

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
                                    <Ionicons name="cash-outline" size={18} color={selectedPaymentId === 'dinheiro' ? '#fff' : currentColors.primary} />
                                    <Text style={[styles.pickerButtonText, selectedPaymentId === 'dinheiro' && styles.pickerButtonTextSelected]}>Dinheiro</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => { setIsConfirmationVisible(false); navigation.navigate('PaymentMethods'); }}
                            >
                                <Ionicons name="add-circle-outline" size={20} color={currentColors.primary} />
                                <Text style={styles.addButtonText}>Adicionar novo cartão</Text>
                            </TouchableOpacity>
                        </ScrollView>

                        <View style={styles.timerContainer}>
                            <View style={styles.timerBarBackground}>
                                <Animated.View style={[styles.timerBarForeground, {
                                    width: timerAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
                                }]} />
                            </View>
                            <Text style={styles.timerText}>Tempo restante: {countdown}s</Text>
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity onPress={handleCancelReservation}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <PrimaryButton title="Confirmar" onPress={handleConfirmReservation} containerStyle={{ flex: 1, marginLeft: 20 }} />
                        </View>
                    </View>
                </View>
            </Modal>

            <BottomNavBar currentRoute="Home" />
        </View>
    );
};

export default HomeScreen;