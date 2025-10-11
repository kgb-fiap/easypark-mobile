import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextData {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [theme, setTheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() || 'light');

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('@theme');
                if (savedTheme !== null) {
                    setTheme(savedTheme as 'light' | 'dark');
                }
            } catch (error) {
                console.error("Failed to load theme from storage", error);
            }
        };

        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem('@theme', newTheme);
        } catch (error) {
            console.error("Failed to save theme to storage", error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

function useTheme(): ThemeContextData {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export { ThemeProvider, useTheme };