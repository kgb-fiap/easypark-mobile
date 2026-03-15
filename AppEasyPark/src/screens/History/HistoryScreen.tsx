import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

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
    { id: '6', date: '11 jun, 2025, 11:00', value: 'R$22,00', payment: { type: 'credit', last4: '8879' } },
    { id: '7', date: '05 mai, 2025, 20:10', value: 'R$7,50', payment: { type: 'pix' } },
    { id: '8', date: '14 fev, 2025, 14:40', value: 'R$8,00', payment: { type: 'credit', last4: '4321' } },
    { id: '9', date: '20 jan, 2025, 9:30', value: 'R$5,00', payment: { type: 'pix' } },
    { id: '10', date: '5 dez, 2024, 18:00', value: 'R$14,00', payment: { type: 'credit', last4: '8879' } },
];

const HistoryScreen: React.FC<RootStackScreenProps<'History'>> = ({ navigation }) => {
    
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // --- Componente interno para renderizar um único item da lista de histórico ---
    const renderHistoryItem = ({ item }: ListRenderItemInfo<HistoryItem>) => {

        // --- Componente menor para exibir a informação de pagamento (Cartão, Pix ou Dinheiro) ---
        const PaymentInfo = () => {
            if (item.payment.type === 'credit') {
                return (
                    <View style={styles.paymentContainer}>
                        <Ionicons name="card-outline" size={16} color={currentColors.muted} />
                        <Text style={styles.paymentText}>Final •••• {item.payment.last4}</Text>
                    </View>
                );
            }
            if (item.payment.type === 'pix') {
                return (
                    <View style={styles.paymentContainer}>
                        <FontAwesome6 name="pix" size={16} color={currentColors.muted} />
                        <Text style={styles.paymentText}>Pix</Text>
                    </View>
                );
            }
            if (item.payment.type === 'money') {
                return (
                    <View style={styles.paymentContainer}>
                        <Ionicons name="cash-outline" size={16} color={currentColors.muted} />
                        <Text style={styles.paymentText}>Dinheiro</Text>
                    </View>
                );
            }
            return null;
        };

        return (
            <View style={styles.historyItem}>
                <View>
                    <Text style={styles.itemPlace}>Estacionamento</Text>
                    <Text style={styles.itemDate}>{item.date}</Text>
                    <PaymentInfo />
                </View>
                <Text style={styles.itemValue}>{item.value}</Text>
            </View>
        );
    };
    
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>Histórico</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* --- Lista de Histórico de Reservas --- */}
            <FlatList
                data={historyData}
                renderItem={renderHistoryItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />

            {/* --- Barra de Navegação Inferior --- */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={26} color={currentColors.muted} />
                    <Text style={styles.navLabel}>Início</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("History")}>
                    <Ionicons name="time-outline" size={26} color={currentColors.primary} />
                    <Text style={[styles.navLabel, { color: currentColors.primary }]}>Histórico</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomNav} onPress={() => navigation.navigate("Settings")}>
                    <Ionicons name="settings-outline" size={26} color={currentColors.muted} />
                    <Text style={styles.navLabel}>Configurações</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HistoryScreen;