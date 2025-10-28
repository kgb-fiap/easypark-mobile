import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../App';

import { useTheme } from '../src/context/ThemeContext';
import { colors, ThemeColors } from '../src/theme/colors';

// Dados de exemplo para estacionamentos recentes
const recentLocations = [
    { id: '1', name: 'Shopping ABC', address: 'Av. Pereira Barreto, 42 - Santo André' },
    { id: '2', name: 'Estacionamento Centro', address: 'Rua Principal, 123 - Centro' },
    { id: '3', name: 'Aeroporto de Congonhas', address: 'Av. Washington Luís, s/n - São Paulo' },
];

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, "Search">;

interface Props {
    navigation: SearchScreenNavigationProp;
}

const SearchScreen: React.FC<Props> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    const [destinationQuery, setDestinationQuery] = useState('');
    const destinationInputRef = useRef<TextInput>(null);

    useEffect(() => {
        setTimeout(() => destinationInputRef.current?.focus(), 150);
    }, []);

    const renderRecentItem = ({ item }) => (
        <TouchableOpacity style={styles.resultItem}>
            <Ionicons name="time-outline" size={23} color={currentColors.muted} style={styles.resultIcon} />
            <View style={styles.resultTextContainer}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultAddress}>{item.address}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>

            <View style={styles.titleHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="return-down-back" size={24} color={"#ffffff"} />
                </TouchableOpacity>
                <Text style={styles.title}>Encontre seu estacionamento</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.inputArea}>

                <View style={styles.inputColumn}>

                    <View style={styles.inputContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="search" size={20} color={currentColors.text} />
                        </TouchableOpacity>
                        <TextInput
                            ref={destinationInputRef}
                            style={styles.input}
                            placeholder="Vamos estacionar por onde?"
                            placeholderTextColor={currentColors.muted}
                            value={destinationQuery}
                            onChangeText={setDestinationQuery}
                            autoFocus={true}
                            returnKeyType="search"
                            onSubmitEditing={() => {
                                console.log('Buscando por:', destinationQuery);
                                Keyboard.dismiss();
                                // Chamada da função de busca
                            }}
                        />
                        {destinationQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setDestinationQuery('')} style={styles.clearButton}>
                                <Ionicons name="close-circle" size={20} color={currentColors.muted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

            </View>

            <FlatList
                data={recentLocations}
                renderItem={renderRecentItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={<Text style={styles.listTitle}>Recentes</Text>}
                keyboardShouldPersistTaps="handled"
            />

        </View>
    );
};

const getStyles = (currentColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentColors.background,
    },
    titleHeader: {
        backgroundColor: currentColors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomColor: currentColors.card,
    },
    backButton: {
        padding: 5,
        paddingRight: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    iconConnectorColumn: {
        alignItems: 'center',
        marginRight: 10,
    },
    verticalLine: {
        height: 30,
        width: 1,
        backgroundColor: currentColors.muted,
    },
    inputColumn: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    fixedOriginText: {
        fontSize: 16,
        color: currentColors.text,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: currentColors.text,
    },
    separatorLine: {
        height: 1,
        backgroundColor: currentColors.card,
        marginVertical: 5,
    },
    clearButton: {
        padding: 5,
        marginLeft: 10,
    },
    plusButton: {
        marginLeft: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: currentColors.muted,
        borderRadius: 15,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    listTitle: {
        fontSize: 14,
        color: currentColors.muted,
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: currentColors.card,
    },
    resultIcon: {
        marginRight: 15,
    },
    resultTextContainer: {
        flex: 1,
    },
    resultName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: currentColors.text,
        marginBottom: 4,
    },
    resultAddress: {
        fontSize: 12,
        color: currentColors.muted,
    }
});

export default SearchScreen;