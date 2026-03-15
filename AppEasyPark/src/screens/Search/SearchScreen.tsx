import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ListRenderItemInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigation e Context
import { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Componentes, Hooks and Utils
import { Header } from '../../components/Header/Header';
import { useDebounce } from '../../hooks/useDebounce';
import { formatNominatimAddress } from '../../utils/formatters';
import { STORAGE_KEYS } from '../../utils/constants';
import { NominatimResult, RecentSearchItem, SearchListItem } from '../../types/models';

const SearchScreen: React.FC<RootStackScreenProps<'Search'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    // --- Estados ---
    const [destinationQuery, setDestinationQuery] = useState('');
    const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
    const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const destinationInputRef = useRef<TextInput>(null);

    // Aplicando o Hook: Atraso de 600ms após o usuário parar de digitar
    const debouncedQuery = useDebounce(destinationQuery, 600);

    // Carrega buscas recentes ao iniciar
    useEffect(() => {
        const loadRecentSearches = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
                if (jsonValue) setRecentSearches(JSON.parse(jsonValue));
            } catch (e) {
                console.error("Falha ao carregar buscas", e);
            }
        };
        loadRecentSearches();
        setTimeout(() => destinationInputRef.current?.focus(), 150);
    }, []);

    // Efeito limpo que reage apenas ao hook de debounce
    useEffect(() => {
        if (debouncedQuery.trim().length >= 3) {
            handleSearch(debouncedQuery);
        } else {
            setSearchResults([]); // Limpa os resultados se o texto for menor que 3 chars
            setIsLoading(false);
        }
    }, [debouncedQuery]);

    // Função de busca na API
    const handleSearch = async (query: string) => {
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

    // Salva busca recente
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
            await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updatedRecents));
        } catch (e) {
            console.error("Falha ao salvar busca recente", e);
        }
    };

    const renderItem = ({ item }: ListRenderItemInfo<SearchListItem>) => {
        if (!('address' in item)) {
            const recent = item as RecentSearchItem;
            return (
                <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => {
                        const fullQuery = [recent.line1, recent.line2].filter(Boolean).join(' ');
                        setDestinationQuery(fullQuery);
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

        const result = item as NominatimResult;
        const { line1, line2 } = formatNominatimAddress(result.address);
        const displayName = line1 || result.display_name;

        return (
            <TouchableOpacity style={styles.resultItem} onPress={() => {
                saveRecentSearch(result, displayName, line2);
                navigation.goBack(); // Simula a volta para o mapa
            }}>
                <Ionicons name="location-outline" size={23} color={currentColors.muted} style={styles.resultIcon} />
                <View style={styles.resultTextContainer}>
                    <Text style={styles.resultNameLine1} numberOfLines={1}>{displayName}</Text>
                    {line2 ? <Text style={styles.resultNameLine2} numberOfLines={1}>{line2}</Text> : null}
                </View>
            </TouchableOpacity>
        );
    };

    const isSearching = destinationQuery.trim().length > 0;
    const dataToShow = isSearching ? searchResults : recentSearches;
    const listTitle = isSearching ? "Resultados da Busca" : "Buscas Recentes";

    return (
        <View style={styles.container}>
        
            <Header title="Encontre seu estacionamento" />

            <View style={styles.inputArea}>
                <View style={styles.searchIcon}>
                    <Ionicons name="search" size={20} color={currentColors.text} />
                </View>
                <TextInput
                    ref={destinationInputRef}
                    style={styles.input}
                    placeholder="Vamos estacionar por onde?"
                    placeholderTextColor={currentColors.muted}
                    value={destinationQuery}
                    onChangeText={setDestinationQuery}
                    autoFocus={true}
                    returnKeyType="search"
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
                keyExtractor={(item) => ('address' in item) ? item.place_id : item.id}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <>
                        {(dataToShow.length > 0 || isLoading) && (
                            <Text style={styles.listTitle}>{listTitle}</Text>
                        )}
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

export default SearchScreen;