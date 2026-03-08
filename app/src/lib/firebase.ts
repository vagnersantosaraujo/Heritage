import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDI8lW8VOiDX0wysiyIUySL6YLNMuda_IU",
    authDomain: "heritage-app-vsa.firebaseapp.com",
    projectId: "heritage-app-vsa",
    storageBucket: "heritage-app-vsa.firebasestorage.app",
    messagingSenderId: "442528421973",
    appId: "1:442528421973:web:9b3aaf1e2d44e2980a9cdc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Helpers para autenticação
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Erro na autenticação do Google:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
};

export { onAuthStateChanged };
