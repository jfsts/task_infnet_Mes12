import { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const users = await AsyncStorage.getItem('@users');
      const parsedUsers = users ? JSON.parse(users) : [];
      
      const foundUser = parsedUsers.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        const userData = {
          email: foundUser.email,
          id: foundUser.id
        };
        
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (email, password) => {
    try {
      // Buscar usuários existentes ou iniciar array vazio
      const existingUsers = await AsyncStorage.getItem('@users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Verificar se o email já existe
      const userExists = users.some(user => user.email === email);
      if (userExists) {
        return { success: false, message: 'Email já cadastrado' };
      }

      // Gerar um novo ID
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

      // Adicionar o novo usuário ao array
      const newUser = {
        id: newId,
        email: email,
        password: password
      };
      users.push(newUser);

      // Salvar os usuários atualizados no AsyncStorage
      await AsyncStorage.setItem('@users', JSON.stringify(users));

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
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 