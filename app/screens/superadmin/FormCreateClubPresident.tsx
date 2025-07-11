
// CreateClub.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { User, Mail, Lock, Phone, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../_contexts/AuthContext';
import axios from 'axios';

const CreateClub = () => {
  const { login }:any = useAuth();
  const router = useRouter();

  const [clubInfo, setClubInfo] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    logo: '',
    description: '',
  });

  const [presidentInfo, setPresidentInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '1', // 1 = admin par défaut
    terms: false,
    avatar: '', // Pour l'image du président
  });

  const [loading, setLoading] = useState(false);

  const pickClubLogo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setClubInfo({ ...clubInfo, logo: result.assets[0].uri });
    }
  };

  const pickPresidentAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPresidentInfo({ ...presidentInfo, avatar: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    if (!presidentInfo.terms) {
      Alert.alert('Erreur', 'Le président doit accepter les conditions');
      return;
    }

    setLoading(true);
    try {
      const formDataAdmin = new FormData();
      formDataAdmin.append('name', presidentInfo.fullName);
      formDataAdmin.append('email', presidentInfo.email);
      formDataAdmin.append('phone', presidentInfo.phone);
      formDataAdmin.append('password', presidentInfo.password);
      formDataAdmin.append('confirm_password', presidentInfo.confirmPassword);
      formDataAdmin.append('terms', '1');
      formDataAdmin.append('is_role', parseInt(presidentInfo.role) );
      formDataAdmin.append('avatar', presidentInfo.avatar );

      

      const response = await axios.post(
        'http://127.0.0.1:8083/api/register',
        formDataAdmin,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
        }
      );

      if (response.data.user) {
        login(response.data.user, response.data.token);
        router.push('/DashboardScreenClubAdmin');
      }
    } catch (error:any) {
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
    
    // Simuler l'envoi à l'API
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Succès', 'Club créé avec succès !');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.mainTitle}>Création de Club</Text>
        
        {/* Informations du club */}
        <Text style={styles.sectionTitle}>Informations du club</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nom du club"
            value={clubInfo.name}
            onChangeText={(text) => setClubInfo({ ...clubInfo, name: text })}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Adresse"
            value={clubInfo.address}
            onChangeText={(text) => setClubInfo({ ...clubInfo, address: text })}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email du club"
            keyboardType="email-address"
            value={clubInfo.email}
            onChangeText={(text) => setClubInfo({ ...clubInfo, email: text })}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Téléphone du club"
            keyboardType="phone-pad"
            value={clubInfo.phone}
            onChangeText={(text) => setClubInfo({ ...clubInfo, phone: text })}
          />
        </View>
        
        <TouchableOpacity onPress={pickClubLogo} style={styles.logoContainer}>
          {clubInfo.logo ? (
            <Image source={{ uri: clubInfo.logo }} style={styles.logo} />
          ) : (
            <Text>Choisir un logo pour le club</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.description]}
            placeholder="Description du club"
            multiline
            numberOfLines={4}
            value={clubInfo.description}
            onChangeText={(text) => setClubInfo({ ...clubInfo, description: text })}
          />
        </View>

        {/* Informations du président */}
        <Text style={styles.sectionTitle}>Informations du président</Text>
        
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={pickPresidentAvatar} style={styles.avatarContainer}>
            {presidentInfo.avatar ? (
              <Image source={{ uri: presidentInfo.avatar }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text>Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Shield size={20} color="#777" style={styles.icon} />
          <Picker
            selectedValue={presidentInfo.role}
            onValueChange={(itemValue) => setPresidentInfo({ ...presidentInfo, role: itemValue })}
            style={styles.picker}
          >
            <Picker.Item label="Administrateur" value="1" />
          </Picker>
        </View>
        
        <View style={styles.inputContainer}>
          <User size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nom complet"
            value={presidentInfo.fullName}
            onChangeText={(text) => setPresidentInfo({ ...presidentInfo, fullName: text })}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Mail size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={presidentInfo.email}
            onChangeText={(text) => setPresidentInfo({ ...presidentInfo, email: text })}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Phone size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            keyboardType="phone-pad"
            value={presidentInfo.phone}
            onChangeText={(text) => setPresidentInfo({ ...presidentInfo, phone: text })}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Lock size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={presidentInfo.password}
            onChangeText={(text) => setPresidentInfo({ ...presidentInfo, password: text })}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Lock size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmer mot de passe"
            secureTextEntry
            value={presidentInfo.confirmPassword}
            onChangeText={(text) => setPresidentInfo({ ...presidentInfo, confirmPassword: text })}
          />
        </View>

        {/* Checkbox conditions */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, presidentInfo.terms && styles.checked]}
            onPress={() => setPresidentInfo({ ...presidentInfo, terms: !presidentInfo.terms })}
          >
            {presidentInfo.terms && <Text style={styles.checkmark}>✔</Text>}
          </TouchableOpacity>
          <Text style={styles.label}>J&apos;accepte les conditions d&apos;utilisation</Text>
        </View>

        {/* Bouton de soumission */}
        <Button 
          title={loading ? 'Création en cours...' : 'Créer le club'} 
          onPress={handleSubmit} 
          disabled={loading}
          color="#007BFF"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  description: {
    height: 100,
    textAlignVertical: 'top',
  },
  logoContainer: {
    width: 200,
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007BFF',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007BFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
});

export default CreateClub;