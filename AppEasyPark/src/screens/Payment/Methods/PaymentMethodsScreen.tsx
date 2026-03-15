import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ListRenderItemInfo, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackScreenProps } from '../../../navigation/types';
import { useTheme } from '../../../context/ThemeContext';
import { colors } from '../../../theme/colors';
import { getStyles } from './styles';

interface PaymentItem {
    id: string;
    type: 'credit';
    brand?: 'Visa' | 'Mastercard';
    last4?: string;
}

// Chave única para o AsyncStorage
const STORAGE_KEY = '@payment_methods';

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
                const savedMethodsJson = await AsyncStorage.getItem(STORAGE_KEY);
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
                await AsyncStorage.setItem(STORAGE_KEY, methodsJson);
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

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name={"return-down-back"}
                        size={26}
                        color="#ffffff"
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Formas de Pagamento</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={methods} // Usa o estado dinâmico
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

                        <TextInput
                            style={styles.input}
                            placeholder="Últimos 4 dígitos"
                            placeholderTextColor={currentColors.muted}
                            keyboardType="number-pad"
                            maxLength={4}
                            value={cardLast4}
                            onChangeText={setCardLast4}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleAddMethod}>
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default PaymentMethodsScreen;