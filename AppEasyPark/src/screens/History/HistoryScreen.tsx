import React from 'react';
import { View, Text, FlatList, ListRenderItemInfo } from 'react-native';

// Navigation e Context
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Components, Hooks, Types e Utils
import { Header } from '../../components/Header/Header';
import { BottomNavBar } from '../../components/BottomNavBar/BottomNavBar';
import { PaymentBadge } from '../../components/PaymentBadge/PaymentBadge';

interface PaymentItemMock {
    type: 'credit' | 'pix' | 'money';
    last4?: string;
}

interface HistoryItem {
    id: string;
    date: string;
    value: string;
    payment: PaymentItemMock;
}

const historyData: HistoryItem[] = [
    { id: '1', date: '10 out, 2025, 19:30', value: 'R$9,50', payment: { type: 'credit', last4: '4321' } },
    { id: '2', date: '28 set, 2025, 12:15', value: 'R$15,00', payment: { type: 'pix' } },
    { id: '3', date: '15 set, 2025, 08:00', value: 'R$6,00', payment: { type: 'money' } },
    { id: '4', date: '02 ago, 2025, 17:45', value: 'R$11,00', payment: { type: 'pix' } },
    { id: '5', date: '20 jul, 2025, 14:20', value: 'R$8,50', payment: { type: 'money' } },
];

const HistoryScreen: React.FC<RootStackScreenProps<'History'>> = () => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // Renderização com alta performance (sem anti-patterns)
    const renderHistoryItem = ({ item }: ListRenderItemInfo<HistoryItem>) => {
        return (
            <View style={styles.historyItem}>
                <View>
                    <Text style={styles.itemPlace}>Estacionamento Easypark</Text>
                    <Text style={styles.itemDate}>{item.date}</Text>
                    
                    {/* Componente Modular de Pagamento */}
                    <PaymentBadge type={item.payment.type} last4={item.payment.last4} />
                </View>
                <Text style={styles.itemValue}>{item.value}</Text>
            </View>
        );
    };
    
    return (
        <View style={styles.container}>
            <Header title="Histórico" showBackButton={false} />

            <FlatList
                data={historyData}
                renderItem={renderHistoryItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            <BottomNavBar currentRoute="History" />
        </View>
    );
};

export default HistoryScreen;