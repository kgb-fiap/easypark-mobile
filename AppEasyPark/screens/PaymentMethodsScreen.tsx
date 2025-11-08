import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ListRenderItemInfo, Modal, TextInput, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../src/context/ThemeContext';
import { colors, ThemeColors } from '../src/theme/colors';

interface PaymentItem {
    id: string;
    type: 'credit';
    brand?: 'Visa' | 'Mastercard';
    last4?: string;
}

type PaymentMethodsScreenNavigationProp = StackNavigationProp<RootStackParamList, "PaymentMethods">;

interface Props {
    navigation: PaymentMethodsScreenNavigationProp;
}

// Chave única para o AsyncStorage
const STORAGE_KEY = '@payment_methods';

const PaymentMethodsScreen: React.FC<Props> = ({ navigation }) => {

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

const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    header: {
        backgroundColor: currentColors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    listContainer: {
        padding: 20,
        flexGrow: 1,
        paddingBottom: 60,
    },
    paymentMethodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: currentColors.card,
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
    },
    methodDetails: {
        flex: 1,
        marginLeft: 15,
    },
    brandText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: currentColors.text,
    },
    lastFourText: {
        fontSize: 14,
        color: currentColors.muted,
        marginTop: 2,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: currentColors.primary,
        borderStyle: 'dashed',
        borderRadius: 12,
    },
    addButtonText: {
        color: currentColors.primary,
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: currentColors.muted,
        fontSize: 16,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: currentColors.card,
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: currentColors.text,
        marginBottom: 20,
    },
    brandSelector: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    brandButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: currentColors.muted,
        marginHorizontal: 5,
    },
    brandButtonSelected: {
        backgroundColor: currentColors.primary,
        borderColor: currentColors.primary,
    },
    brandButtonText: {
        color: currentColors.muted,
    },
    brandButtonTextSelected: {
        color: '#fff',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: currentColors.muted,
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: currentColors.text,
        textAlign: 'center',
        marginBottom: 30,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: currentColors.muted,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: currentColors.primary,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default PaymentMethodsScreen;