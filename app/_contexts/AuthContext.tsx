/* // contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

// Définir le type du contexte
interface AuthContextType {
  user: null | { id: string; name: string }; // Exemple de structure utilisateur
  token: null | string;
  login: (userData: any, authToken: any) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

// Créer le contexte
const AuthContext = createContext<AuthContextType | null>(null);

// Composant AuthProvider
export const AuthProvider = ({ children }:any) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter()

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (userData: { id: string; name: string }, authToken: string) => {
    try {
      setUser(userData);
      setToken(authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      setUser(null);
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user:null, token:null, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

// Ajouter l'export par défaut requis pour résoudre l'erreur
export default AuthProvider;

*/

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface AuthContextType {
  user: null | { id: string; email: string };
  token: null | string;
  login: (userData: { id: string; email: string }, authToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<null | { id: string; email: string }>(null);
  const [token, setToken] = useState<null | string>(null);
  const router = useRouter();

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
  };

  const login = async (userData: { id: string; email: string }, authToken: string) => {
    try {
      setUser(userData);
      setToken(authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      setUser(null);
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
      router.push('../index'); // Rediriger vers la page de connexion");
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);