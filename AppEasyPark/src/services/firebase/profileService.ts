import { db, auth } from './firebaseConfig';
import { doc, setDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { updateProfile, updateEmail } from 'firebase/auth';

export const profileService = {

    // Atualizar perfil (Nome e E-mail)
    updateUser: async (newName: string, newEmail: string) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Utilizador não autenticado");

            // Atualiza no Auth (para o Login)
            if (newName !== user.displayName) {
                await updateProfile(user, { displayName: newName });
            }
            
            // Atualiza no Firestore (para histórico e dados extras)
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { 
                name: newName, 
                email: newEmail,
                updatedAt: new Date()
            }, { merge: true });

            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    // Salvar histórico de busca
    saveSearchHistory: async (searchItem: any) => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            // Caminho: users -> {userId} -> history -> {documento}
            const historyRef = collection(db, 'users', user.uid, 'history');
            await addDoc(historyRef, {
                ...searchItem,
                timestamp: new Date()
            });
        } catch (e) {
            console.error("Erro ao salvar histórico:", e);
        }
    },

    // Procurar histórico do usuário logado
    getSearchHistory: async () => {
        try {
            const user = auth.currentUser;
            if (!user) return [];

            const historyRef = collection(db, 'users', user.uid, 'history');
            const q = query(historyRef, orderBy('timestamp', 'desc'), limit(5));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (e) {
            console.error("Erro ao procurar histórico:", e);
            return [];
        }
    },

    // Buscar histórico de reservas (Pagamentos)
    getReservationHistory: async () => {
        try {
            const user = auth.currentUser;
            if (!user) return [];

            // Lemos de uma coleção nova chamada 'reservations'
            const historyRef = collection(db, 'users', user.uid, 'reservations');
            
            // Ordenamos da mais recente para a mais antiga
            const q = query(historyRef, orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (e) {
            console.error("Erro ao procurar histórico de reservas:", e);
            return [];
        }
    }
};