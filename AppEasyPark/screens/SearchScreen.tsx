import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard, ListRenderItemInfo, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../src/context/ThemeContext';
import { colors, ThemeColors } from '../src/theme/colors';

interface RecentSearchItem {
    id: string;
    line1: string;
    line2: string;
}
interface NominatimAddress {
    road?: string;
    house_number?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
}
interface NominatimResult {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
    address: NominatimAddress;
}
type SearchListItem = RecentSearchItem | NominatimResult;

const RECENT_SEARCHES_KEY = '@recent_searches';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, "Search">;

interface Props {
    navigation: SearchScreenNavigationProp;
}

const formatNominatimAddress = (addr: NominatimAddress): { line1: string, line2: string } => {
    const road = addr.road || '';
    const number = addr.house_number || '';
    const suburb = addr.suburb || '';
    const city = addr.county || addr.city || '';
    const postcode = addr.postcode || '';

    let line1 = road;
    if (number) line1 += `, ${number}`;
    if (suburb) line1 += ` - ${suburb}`;

    let line2 = city;
    if (addr.state === 'São Paulo' && city !== 'São Paulo') line2 += ', SP';
    if (postcode) line2 += ` - ${postcode}`;

    const line1Clean = line1.trim().replace(/, $/, '');
    const line2Clean = line2.trim().replace(/, $/, '').replace(/^- /, '');

    if (!line1Clean && line2Clean) {
        return { line1: line2Clean, line2: '' };
    }
    return { line1: line1Clean, line2: line2Clean };
};

const SearchScreen: React.FC<Props> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    const [destinationQuery, setDestinationQuery] = useState('');
    const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
    const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const destinationInputRef = useRef<TextInput>(null);
    const searchTimer = useRef<NodeJS.Timeout | null>(null);

    // Carrega as buscas recentes ao iniciar a tela
    useEffect(() => {
        const loadRecentSearches = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
                if (jsonValue !== null) {
                    setRecentSearches(JSON.parse(jsonValue));
                }
            } catch (e) {
                console.error("Falha ao carregar buscas recentes", e);
            }
        };
        loadRecentSearches();
        setTimeout(() => destinationInputRef.current?.focus(), 150);
    }, []);

    // Salva uma nova busca recente
    const saveRecentSearch = async (item: NominatimResult, line1: string, line2: string) => {
        try {
            const newRecent: RecentSearchItem = {
                id: item.place_id,
                line1: line1 || item.display_name,
                line2: line2 || ''
            };
            const filteredRecents = recentSearches.filter(r => r.id !== newRecent.id);
            const updatedRecents = [newRecent, ...filteredRecents].slice(0, 5); 

            setRecentSearches(updatedRecents);
            await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedRecents));
        } catch (e) {
            console.error("Falha ao salvar busca recente", e);
        }
    };

    // Função de busca na API (Nominatim)
    const handleSearch = async (query: string) => {
        if (query.trim().length < 3) {
            setSearchResults([]);
            return;
        }
        
        setIsLoading(true);
        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=br&limit=10&addressdetails=1`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'User-Agent': 'EasyParkApp/1.0 (seuemail@dominio.com)' }
            });
            const data: NominatimResult[] = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Falha ao buscar endereço:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Efeito de DEBOUNCE: Pesquisa conforme o usuário digita
    useEffect(() => {
        if (searchTimer.current) clearTimeout(searchTimer.current);

        if (destinationQuery.trim().length === 0) {
            setSearchResults([]);
            setIsLoading(false);
            return;
        }
        
        if (destinationQuery.trim().length < 3) { 
            return;
        }

        searchTimer.current = setTimeout(() => {
            handleSearch(destinationQuery);
        }, 500);

        return () => {
            if (searchTimer.current) clearTimeout(searchTimer.current);
        };
    }, [destinationQuery]);

    // Função de renderização
    const renderItem = ({ item }: ListRenderItemInfo<SearchListItem>) => {
        
        // Type Guard: Verifica se é um item de Busca Recente
        if (!('address' in item)) {
            const recent = item as RecentSearchItem;
            return (
                <TouchableOpacity 
                    style={styles.resultItem}
                    onPress={() => {
                        if (searchTimer.current) clearTimeout(searchTimer.current);
                        const fullQuery = [recent.line1, recent.line2].filter(Boolean).join(' ');
                        setDestinationQuery(fullQuery);
                        handleSearch(fullQuery); // Busca imediata
                    }}
                >
                    <Ionicons name="time-outline" size={23} color={currentColors.muted} style={styles.resultIcon} />
                    <View style={styles.resultTextContainer}>
                        <Text style={styles.resultNameLine1}>{recent.line1}</Text>
                        {recent.line2 ? <Text style={styles.resultNameLine2}>{recent.line2}</Text> : null}
                    </View>
                </TouchableOpacity>
            );
        }

        // É um Resultado da API (NominatimResult)
        const result = item as NominatimResult;
        const { line1, line2 } = formatNominatimAddress(result.address);
        
        const displayName = line1 || result.display_name;

        return (
            <TouchableOpacity style={styles.resultItem} onPress={() => {
                saveRecentSearch(result, displayName, line2);
                console.log('Navegar para:', { lat: result.lat, lon: result.lon });
                // navigation.navigate('Home', { selectedLocation: { lat: parseFloat(result.lat), lon: parseFloat(result.lon) } });
            }}>
                <Ionicons name="location-outline" size={23} color={currentColors.muted} style={styles.resultIcon} />
                <View style={styles.resultTextContainer}>
                    <Text style={styles.resultNameLine1} numberOfLines={1}>{displayName}</Text>
                    {line2 ? <Text style={styles.resultNameLine2} numberOfLines={1}>{line2}</Text> : null}
                </View>
            </TouchableOpacity>
        );
    };

    // CORREÇÃO DA LÓGICA DA LISTA:
    // Se estiver digitando, mostre os resultados. Se o input estiver vazio, mostre os recentes.
    const isSearching = destinationQuery.trim().length > 0;
    const dataToShow = isSearching ? searchResults : recentSearches;
    const listTitle = isSearching ? "Resultados da Busca" : "Buscas Recentes";

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
                <TouchableOpacity onPress={() => handleSearch(destinationQuery)} style={styles.searchIcon}>
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
                        if (searchTimer.current) clearTimeout(searchTimer.current);
                        handleSearch(destinationQuery);
                    }}
                />
                {destinationQuery.length > 0 && (
                    <TouchableOpacity onPress={() => {
                        setDestinationQuery('');
                        setSearchResults([]);
                    }} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color={currentColors.muted} />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={dataToShow}
                renderItem={renderItem}
                keyExtractor={(item) => (item as RecentSearchItem).id || (item as NominatimResult).place_id.toString()}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <>
                        {dataToShow.length > 0 || isLoading ? (
                            <Text style={styles.listTitle}>{listTitle}</Text>
                        ) : null}
                        {isLoading && (
                            <ActivityIndicator size="large" color={currentColors.primary} style={{ marginVertical: 20 }} />
                        )}
                    </>
                }
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
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: currentColors.card,
        borderBottomWidth: 1,
        borderBottomColor: currentColors.border,
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: currentColors.text,
        paddingVertical: 15,
    },
    clearButton: {
        padding: 5,
        marginLeft: 10,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
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
        borderBottomColor: currentColors.border,
    },
    resultIcon: {
        marginRight: 15,
    },
    resultTextContainer: {
        flex: 1,
    },
    resultNameLine1: {
        fontSize: 16,
        fontWeight: 'bold',
        color: currentColors.text,
        marginBottom: 4,
    },
    resultNameLine2: {
        fontSize: 14,
        color: currentColors.muted,
    },
});

export default SearchScreen;