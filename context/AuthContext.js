import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getReactNativePersistence
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAHg5AhA4zQfRmIbXyTBwSg0mhAgCvhGI4",
  authDomain: "tasks-login-firebase-infnet.firebaseapp.com",
  projectId: "tasks-login-firebase-infnet",
  storageBucket: "tasks-login-firebase-infnet.firebasestorage.app",
  messagingSenderId: "850325712145",
  appId: "1:850325712145:web:e393ee3e77b72d106bb0b0"
};

// Inicializa o Firebase apenas se não houver uma instância existente
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializa a autenticação com persistência
let auth;
try {
  auth = getAuth(app);
} catch (error) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se há usuário salvo no AsyncStorage ao iniciar
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('@user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listener para mudanças no estado de autenticação
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
        };
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
        setUser(userData);
      } else {
        await AsyncStorage.removeItem('@user');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
      };
      await AsyncStorage.setItem('@user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
      };
      await AsyncStorage.setItem('@user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, message: 'Usuário cadastrado com sucesso' };
    } catch (error) {
      console.error('Erro no registro:', error);
      let message = 'Erro ao cadastrar usuário';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email já cadastrado';
      }
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('@user');
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return null; // ou um componente de loading
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 