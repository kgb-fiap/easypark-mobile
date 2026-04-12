import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';

// Navigation e Context
import { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { getStyles } from './styles';

// Componentes e Utils
import { Header } from '../../components/Header/Header';

// Firebase Services
import { profileService } from '../../services/firebase/profileService';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const { width: SCREEN_WIDTH } = Dimensions.get('window'); // Largura exata da tela

// Tipagem para salvar as coordenadas no histórico
export interface RecentSearchItem {
    id: string;
    line1: string;
    line2: string;
    lat?: number; 
    lng?: number; 
}

const SearchScreen: React.FC<RootStackScreenProps<'Search'>> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];
    const styles = getStyles(currentColors);

    const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const googleRef = useRef<GooglePlacesAutocompleteRef>(null);

    const hasBottomList = isTyping || (!isTyping && recentSearches.length > 0);

    useEffect(() => {
        const loadRecentSearches = async () => {
            try {
                const history = await profileService.getSearchHistory();
                if (history && history.length > 0) {
                    // Fazemos um cast para garantir que o TypeScript entenda o formato
                    setRecentSearches(history as RecentSearchItem[]);
                }
            } catch (e) { 
                console.error("Erro ao carregar histórico da nuvem", e); 
            }
        };
        
        loadRecentSearches();
        setTimeout(() => googleRef.current?.focus(), 200);
    }, []);

    const handleSelectPlace = async (data: any, details: any) => {
        if (!details) return;

        const { lat, lng } = details.geometry.location;
        const placeName = data.structured_formatting?.main_text || data.description;
        const placeDetails = data.structured_formatting?.secondary_text || '';

        try {
            const newRecent: RecentSearchItem = { id: data.place_id, line1: placeName, line2: placeDetails, lat, lng };
            
            const filteredRecents = recentSearches.filter(r => r.id !== newRecent.id);
            const updatedRecents = [newRecent, ...filteredRecents].slice(0, 5);
            setRecentSearches(updatedRecents);
            
            await profileService.saveSearchHistory(newRecent);
        } catch (e) {
            console.error("Erro ao salvar histórico na nuvem", e);
        }

        // Volta para a Home e passa o nome do local pesquisado
        navigation.navigate('Home', { 
            selectedSpotParams: { 
                id: data.place_id, 
                type: 'spot',
                label: placeName, 
                coords: { latitude: lat, longitude: lng } 
            } 
        });
    };

    return (
        <View style={styles.container}>
            <Header title="Encontre seu estacionamento" />

            <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: Platform.OS === 'android' ? 20 : 40, zIndex: 10 }}>
                
                <GooglePlacesAutocomplete
                    ref={googleRef}
                    placeholder="Para onde você vai?"
                    fetchDetails={true}
                    onPress={handleSelectPlace}
                    query={{ key: GOOGLE_API_KEY, language: 'pt-BR', components: 'country:br' }}
                    debounce={400} minLength={3} enablePoweredByContainer={false} 
                    
                    textInputProps={{
                        placeholderTextColor: currentColors.muted,
                        onChangeText: (text) => setIsTyping(text.length > 0),
                    }}

                    renderLeftButton={() => (
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 5 }}>
                            <Ionicons name="search" size={20} color={currentColors.primary} />
                        </View>
                    )}

                    renderRow={(rowData) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: SCREEN_WIDTH - 70 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: currentColors.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                                <Ionicons name="location-outline" size={20} color={currentColors.primary} />
                            </View>
                            
                            <View style={{ flex: 1, overflow: 'hidden' }}>
                                <Text 
                                    style={{ fontFamily: 'Inter-Medium', fontSize: 15, color: currentColors.text }} 
                                    numberOfLines={1} 
                                    ellipsizeMode="tail"
                                >
                                    {rowData.structured_formatting?.main_text || rowData.description}
                                </Text>
                                {rowData.structured_formatting?.secondary_text && (
                                    <Text 
                                        style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: currentColors.muted, marginTop: 2 }} 
                                        numberOfLines={1} 
                                        ellipsizeMode="tail"
                                    >
                                        {rowData.structured_formatting.secondary_text}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}

                    styles={{
                        container: { flex: isTyping ? 1 : 0 },
                        textInputContainer: { 
                            height: 56,
                            backgroundColor: currentColors.card,
                            borderWidth: 1,
                            borderColor: currentColors.border,
                            borderTopLeftRadius: 14,
                            borderTopRightRadius: 14,
                            borderBottomLeftRadius: hasBottomList ? 0 : 14,
                            borderBottomRightRadius: hasBottomList ? 0 : 14,
                        },
                        textInput: { flex: 1, backgroundColor: 'transparent', color: currentColors.text, fontSize: 16, fontFamily: 'Inter-Medium', height: '100%', marginTop: 0, marginBottom: 0 },
                        
                        listView: { 
                            flexGrow: 0, 
                            backgroundColor: currentColors.card,
                            borderWidth: 1,
                            borderTopWidth: 0, 
                            borderColor: currentColors.border,
                            borderBottomLeftRadius: 14,
                            borderBottomRightRadius: 14,
                            overflow: 'hidden',
                        },
                        row: { 
                            backgroundColor: currentColors.card, 
                            paddingVertical: 15, 
                            paddingHorizontal: 15, 
                            borderBottomWidth: 1, 
                            borderBottomColor: currentColors.border,
                            width: SCREEN_WIDTH - 40 
                        },
                        separator: { height: 0 } 
                    }}
                />

                {/* Buscas Recentes */}
                {!isTyping && recentSearches.length > 0 && (
                    <View style={{ 
                        flexShrink: 1, 
                        backgroundColor: currentColors.card,
                        borderWidth: 1,
                        borderTopWidth: 0, 
                        borderColor: currentColors.border,
                        borderBottomLeftRadius: 14,
                        borderBottomRightRadius: 14,
                        zIndex: 5,
                    }}>
                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 13, color: currentColors.muted, marginHorizontal: 15, marginTop: 15, marginBottom: 5, textTransform: 'uppercase' }}>
                            Buscas Recentes
                        </Text>
                        <FlatList
                            data={recentSearches}
                            keyExtractor={(item) => item.id}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: currentColors.border }}
                                    onPress={() => {
                                        if (item.lat && item.lng) {
                                            navigation.navigate('Home', { 
                                                selectedSpotParams: { id: item.id, type: 'spot', label: item.line1, coords: { latitude: item.lat, longitude: item.lng } } 
                                            });
                                        } else {
                                            googleRef.current?.setAddressText(item.line1);
                                            setIsTyping(true);
                                            googleRef.current?.focus();
                                        }
                                    }}
                                >
                                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: currentColors.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                                        <Ionicons name="time-outline" size={20} color={currentColors.primary} />
                                    </View>
                                    <View style={{ flex: 1, overflow: 'hidden' }}>
                                        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 15, color: currentColors.text }} numberOfLines={1}>{item.line1}</Text>
                                        {item.line2 ? <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: currentColors.muted }} numberOfLines={1}>{item.line2}</Text> : null}
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

export default SearchScreen;