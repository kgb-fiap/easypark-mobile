import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ListRenderItemInfo, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigation e Context
import { RootStackScreenProps } from '../../../navigation/types';
import { useTheme } from '../../../context/ThemeContext';
import { colors } from '../../../theme/colors';
import { getStyles } from './styles';

// Components, Hooks, Types e Utils
import { Header } from '../../../components/Header/Header';
import { CustomInput } from '../../../components/CustomInput/CustomInput';
import { PrimaryButton } from '../../../components/PrimaryButton/PrimaryButton';
import { STORAGE_KEYS } from '../../../utils/constants';

interface PaymentItem {
    id: string;
    type: 'credit';
    brand?: 'Visa' | 'Mastercard';
    last4?: string;
}

const PaymentMethodsScreen: React.FC<RootStackScreenProps<'PaymentMethods'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // --- Estados ---
    const [methods, setMethods] = useState<PaymentItem[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    // --- Estados do formulário do modal ---
    const [cardLast4, setCardLast4] = useState('');
    const [cardBrand, setCardBrand] = useState<'Visa' | 'Mastercard'>('Visa');

    // Efeito para CARREGAR os métodos salvos (roda ao abrir a tela)
    useEffect(() => {
        const loadMethods = async () => {
            try {
                const savedMethodsJson = await AsyncStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS);
                if (savedMethodsJson !== null) {
                    setMethods(JSON.parse(savedMethodsJson));
                }
            } catch (e) {
                console.error('Failed to load payment methods.', e);
            }
        };
        loadMethods();
    }, []);

    // Efeito para SALVAR os métodos (roda toda vez que a lista 'methods' é alterada)
    useEffect(() => {
        const saveMethods = async () => {
            try {
                const methodsJson = JSON.stringify(methods);
                await AsyncStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, methodsJson);
            } catch (e) {
                console.error('Failed to save payment methods.', e);
            }
        };
        saveMethods();
    }, [methods]);

    // Adiciona um novo cartão à lista 'methods' após validação
    const handleAddMethod = () => {
        if (cardLast4.length !== 4) {
            Alert.alert("Erro", "Por favor, insira os 4 últimos dígitos do cartão.");
            return;
        }

        const newMethod: PaymentItem = {
            id: Date.now().toString(),
            type: 'credit',
            brand: cardBrand,
            last4: cardLast4,
        };

        setMethods(prevMethods => [...prevMethods, newMethod]);
        setModalVisible(false);
        setCardLast4('');
    };

    // Remove um método de pagamento da lista 'methods' com base no ID
    const handleDeleteMethod = (id: string) => {
        setMethods(prevMethods => prevMethods.filter(method => method.id !== id));
    };

    // Renderiza um único item da lista de cartões
    const renderPaymentItem = ({ item }: ListRenderItemInfo<PaymentItem>) => (
        <View style={styles.paymentMethodCard}>
            <Ionicons name="card" size={24} color={currentColors.primary} />
            <View style={styles.methodDetails}>
                <Text style={styles.brandText}>{item.brand}</Text>
                <Text style={styles.lastFourText}>Final •••• {item.last4}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteMethod(item.id)}>
                <Ionicons name="trash-outline" size={22} color={currentColors.muted} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>

            <Header title="Formas de Pagamento" />

            <FlatList
                data={methods}
                renderItem={renderPaymentItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                        <Ionicons name="add-circle-outline" size={22} color={currentColors.primary} />
                        <Text style={styles.addButtonText}>Adicionar novo cartão</Text>
                    </TouchableOpacity>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhuma forma de pagamento cadastrada.</Text>
                    </View>
                }
            />

            {/* Modal para Adicionar Cartão */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Adicionar Novo Cartão</Text>

                        <View style={styles.brandSelector}>
                            <TouchableOpacity
                                style={[styles.brandButton, cardBrand === 'Visa' && styles.brandButtonSelected]}
                                onPress={() => setCardBrand('Visa')}
                            >
                                <Text style={[styles.brandButtonText, cardBrand === 'Visa' && styles.brandButtonTextSelected]}>Visa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.brandButton, cardBrand === 'Mastercard' && styles.brandButtonSelected]}
                                onPress={() => setCardBrand('Mastercard')}
                            >
                                <Text style={[styles.brandButtonText, cardBrand === 'Mastercard' && styles.brandButtonTextSelected]}>Mastercard</Text>
                            </TouchableOpacity>
                        </View>

                        <CustomInput
                            placeholder="Últimos 4 dígitos"
                            value={cardLast4}
                            onChangeText={setCardLast4}
                            keyboardType="number-pad"
                            maxLength={4}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <PrimaryButton 
                                title="Salvar" 
                                onPress={handleAddMethod} 
                                containerStyle={{ flex: 1, marginLeft: 15 }} 
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PaymentMethodsScreen;