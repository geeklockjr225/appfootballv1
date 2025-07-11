import React, { useState } from 'react';
import { 
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Button
} from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8083/api/superadmin/login',
        { email, password },
        {
          headers: { 'Accept': 'application/json' }
        }
      );
      if (response.data.user,response.data.token) {
        router.push('/');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Connexion Super Admin</Text>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Button
          title={loading ? 'Chargement...' : 'SE CONNECTER'}
          onPress={handleLogin}
          disabled={loading}
          color="#007BFF"
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Pas encore de compte ? </Text>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.registerLink}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 25, paddingHorizontal: 5 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 40, fontSize: 16, color: '#333' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: '#666' },
  registerLink: { color: '#007BFF', fontWeight: 'bold' },
});

export default LoginScreen;
