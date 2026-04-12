import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ListRenderItemInfo, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Navigation e Context
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Components and Utils
import { Header } from '../../components/Header/Header';
import { BottomNavBar } from '../../components/BottomNavBar/BottomNavBar';
import { PaymentBadge } from '../../components/PaymentBadge/PaymentBadge';

// Firebase Services
import { profileService } from '../../services/firebase/profileService';

// Tipagens
interface PaymentItemMock {
    type: 'credit' | 'pix' | 'money';
    last4?: string;
}

interface HistoryItem {
    id: string;
    date: string;
    value: string;
    placeName?: string;
    payment: PaymentItemMock;
}

const HistoryScreen: React.FC<RootStackScreenProps<'History'>> = () => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // --- Estados da Tela ---
    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- Carregamento Dinâmico ---
    useFocusEffect(
        useCallback(() => {
            const fetchHistory = async () => {
                setIsLoading(true);
                try {
                    const data = await profileService.getReservationHistory();
                    
                    // Se não houver histórico de reservas é feito um Mock para simular como ficaria a tela com dados de reservas.
                    if (data.length === 0) {
                        setHistoryData([
                            { id: '1', placeName: 'Estacionamento Fiap', date: '10 out, 2025, 19:30', value: 'R$9,50', payment: { type: 'credit', last4: '4321' } },
                            { id: '2', placeName: 'Estacionamento Centro', date: '28 set, 2025, 12:15', value: 'R$15,00', payment: { type: 'pix' } }
                        ]);
                    } else {
                        setHistoryData(data as HistoryItem[]);
                    }
                     
                } catch (error) {
                    console.error("Falha ao carregar histórico", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchHistory();
        }, [])
    );

    // Renderização com alta performance
    const renderHistoryItem = ({ item }: ListRenderItemInfo<HistoryItem>) => {
        return (
            <View style={styles.historyItem}>
                <View>
                    <Text style={styles.itemPlace}>{item.placeName || 'Estacionamento Easypark'}</Text>
                    <Text style={styles.itemDate}>{item.date}</Text>
                    
                    {/* Componente Modular de Pagamento */}
                    <PaymentBadge type={item.payment?.type || 'money'} last4={item.payment?.last4} />
                </View>
                <Text style={styles.itemValue}>{item.value}</Text>
            </View>
        );
    };
    
    // Componente de lista vazia
    const renderEmptyState = () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontFamily: 'Inter-Medium', color: currentColors.muted, fontSize: 16 }}>
                Você ainda não possui reservas.
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header title="Histórico" showBackButton={false} />

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={currentColors.primary} />
                </View>
            ) : (
                <FlatList
                    data={historyData}
                    renderItem={renderHistoryItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyState}
                />
            )}

            <BottomNavBar currentRoute="History" />
        </View>
    );
};

export default HistoryScreen;