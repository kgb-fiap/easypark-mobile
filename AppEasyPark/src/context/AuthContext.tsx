import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/firebaseConfig';

interface AuthContextData {
    user: User | null;
    loading: boolean;
    signed: boolean;
}

// Criação do Contexto
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provedor do Contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // O Firebase observa automaticamente se há um usuário no AsyncStorage
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // Para de carregar assim que o Firebase responde
        });

        // Limpa o listener da memória quando o componente for desmontado
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, signed: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};