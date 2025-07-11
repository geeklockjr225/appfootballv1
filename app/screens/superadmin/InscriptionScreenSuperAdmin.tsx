import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Alert,
  Button
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { User, Mail, Lock, Phone, Shield, Image as ImageIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const RegisterScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('superadmin'); // 1 = super admin par défaut
  const [sexe, setSexe] = useState('Homme');
  const [isChecked, setIsChecked] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // demander la permission pour la galerie
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de l accès à vos photos pour sélectionner un avatar.');
      }
    })();
  }, []);

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    if (!isChecked) {
      Alert.alert('Erreur', 'Vous devez accepter les conditions');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      formData.append('terms', isChecked ? '1' : '0');
      formData.append('role', role);
      formData.append('sexe', sexe);

      if (avatar) {
        const uri = avatar.uri;
        const name = avatar.fileName || `avatar.${uri.split('.').pop()}`;
        const mimeType = uri.endsWith('.png') ? 'image/png' : 'image/jpeg';
        formData.append('avatar', { uri, name, type: mimeType });
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/superadmin/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        }
      );

      if (response.data.user,response.data.token) {
        router.push('/');
      } else {
        Alert.alert('Erreur', 'Réponse inattendue du serveur');
      }
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        let errorMessage = '';
        Object.keys(errors).forEach(key => {
          errorMessage += `${errors[key].join(', ')}\n`;
        });
        Alert.alert('Erreur', errorMessage);
      } else {
        Alert.alert('Erreur', error.message || 'Erreur d\'inscription');
      }
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
        <Text style={styles.headerText}>Créez votre compte Super Admin</Text>

        {/* Avatar picker */}
        <TouchableOpacity style={styles.profileImageContainer} onPress={pickAvatar}>
          {avatar ? (
            <Image source={{ uri: avatar.uri }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <ImageIcon size={50} color="#777" />
              <Text>Choisir un avatar</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Role picker */}
        <View style={styles.inputContainer}>
          <Shield size={20} color="#777" style={styles.icon} />
          <Picker
            selectedValue={role}
            onValueChange={setRole}
            style={styles.picker}
          >
            <Picker.Item label="Super Admin" value="superadmin" />
          </Picker>
        </View>

        {/* Sexe picker */}
        <View style={styles.inputContainer}>
          <User size={20} color="#777" style={styles.icon} />
          <Picker
            selectedValue={sexe}
            onValueChange={setSexe}
            style={styles.picker}
          >
            <Picker.Item label="Homme" value="Homme" />
            <Picker.Item label="Femme" value="Femme" />
          </Picker>
        </View>

        {/* Nom complet */}
        <View style={styles.inputContainer}>
          <User size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nom complet"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Mail size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Téléphone */}
        <View style={styles.inputContainer}>
          <Phone size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Mot de passe */}
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

        {/* Confirmer mot de passe */}
        <View style={styles.inputContainer}>
          <Lock size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmer mot de passe"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Checkbox conditions */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, isChecked && styles.checked]}
            onPress={() => setIsChecked(!isChecked)}
          >
            {isChecked && <Text style={styles.checkmark}>✔</Text>}
          </TouchableOpacity>
          <Text style={styles.label}>J'accepte les conditions d'utilisation</Text>
        </View>

        {/* Bouton d'inscription */}
        <Button
          title={loading ? 'Chargement...' : 'S\'INSCRIRE'}
          onPress={handleRegister}
          disabled={loading}
          color="#007BFF"
        />

        {/* Lien connexion */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Déjà inscrit ? </Text>
          <TouchableOpacity onPress={() => router.push('/')}> 
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#333' },
  profileImageContainer: { alignItems: 'center', marginBottom: 30 },
  profileImage: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#f0f0f0' },
  placeholderImage: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 25, paddingHorizontal: 5 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 40, fontSize: 16, color: '#333' },
  picker: { flex: 1, height: 40, color: '#333' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, paddingHorizontal: 5 },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: '#007BFF', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: '#007BFF' },
  checkmark: { color: '#fff', fontSize: 16 },
  label: { fontSize: 14, color: '#666' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { color: '#666' },
  loginLink: { color: '#007BFF', fontWeight: 'bold' },
});

export default RegisterScreen;
