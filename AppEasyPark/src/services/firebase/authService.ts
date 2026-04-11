import { auth } from "./firebaseConfig";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    updateProfile,
    updateEmail
} from 'firebase/auth';

export const authService = {
    
    // Fazer login
    login: async (email: string, pass: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            return { user: userCredential.user, error: null };
        } catch (error: any) {
            return { user: null, error: error.message };
        }
    },

    // Criar Conta
    register: async (email: string, pass: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            // Salva o nome de usuário no perfil do Firebase logo após criar a conta
            await updateProfile(userCredential.user, { displayName: name });
            return { user: userCredential.user, error: null };
        } catch (error: any) {
            return { user: null, error: error.message };
        }
    },

    // Sair / Deslogar
    logout: async () => {
        try {
            await signOut(auth);
            return { success: true, error: null };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    // Atualizar o Perfil (Nome e Email)
    updateUserProfile: async (newName: string, newEmail: string) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Usuário não está logado");

            if (newName && newName !== user.displayName) {
                await updateProfile(user, { displayName: newName });
            }

            if (newEmail && newEmail !== user.email) {
                await updateEmail(user, newEmail);
            }

            return { success: true, error: null };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};