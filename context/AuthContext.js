import { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('@user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return { success: false };
      }

      // Buscar lista de usuários
      const usersStr = await AsyncStorage.getItem('@users');
      const users = usersStr ? JSON.parse(usersStr) : [];

      // Procurar usuário com email e senha correspondentes
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          email: foundUser.email
        };
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        Alert.alert(
          'Erro no Login',
          'Email ou senha incorretos',
          [{ text: 'OK' }]
        );
        return { success: false };
      }
    } catch (error) {
      console.log('Erro no login:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
      return { success: false };
    }
  };

  const register = async (email, password) => {
    try {
      if (!email || !password) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return { success: false };
      }

      // Buscar lista de usuários existente
      const usersStr = await AsyncStorage.getItem('@users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      // Verificar se o email já está cadastrado
      if (users.some(u => u.email === email)) {
        Alert.alert('Erro', 'Este email já está cadastrado');
        return { success: false, message: 'Email já cadastrado' };
      }

      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        email,
        password
      };

      // Adicionar à lista de usuários
      users.push(newUser);
      await AsyncStorage.setItem('@users', JSON.stringify(users));

      // Login automático após registro
      const userData = {
        id: newUser.id,
        email: newUser.email
      };
      await AsyncStorage.setItem('@user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, message: 'Usuário cadastrado com sucesso' };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro ao cadastrar usuário' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 