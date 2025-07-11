import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { User, Lock } from 'lucide-react-native';
import { Link,router } from 'expo-router';
import { useAuth } from './_contexts/AuthContext';
import axios from 'axios'

const LoginScreen = () => {
  const { login }:any = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://192.168.1.67:8000/api/users/login', {
        username,
        password
      });

      if (response.data.user && response.data.token) {
        login(response.data.user, response.data.token);
        const role = response.data.user.role;

switch (role) {
  case 'parent':
    router.replace('./screens/parent/DashboardScreenParentEnfant');
    break;
  case 'admin':
    router.replace('./screens/admin/DashboardScreenClubAdmin');
    break;
    case 'coach':
    router.replace('./screens/coatch/DashboardScreenCoatch');
    break;
    case 'assistant':
    router.replace('./screens/assistant/DashboardScreenAssistant');
    break;
  default:
    Alert.alert('Erreur', 'Rôle utilisateur inconnu.');
    break;
}
      }
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || 'Erreur de connexion';
      Alert.alert('Erreur', errorMessage);
      console.log(error);
      
    } finally {
      setLoading(false);
    }
  };
 
  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.jpeg')}
            style={styles.logo}
          />
        </View>

        <Text style={styles.headerText}>Accédez à votre espace</Text>

        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <User size={20} color="#777" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Lock size={20} color="#777" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Mot de passe oublié ? </Text>
          <TouchableOpacity>
            <Link  href="/screens/admin/DashboardScreenClubAdmin" style={styles.registerLink}>Recuperer</Link>
          </TouchableOpacity>
          
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>SE CONNECTER</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5f5',
    marginTop:-200,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 30,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:30,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 25,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  registerText: {
    color: '#666',
  },
  registerLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 19,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
