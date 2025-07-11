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
  Image,
  Alert,
  Button,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Shield, 
  Image as ImageIcon,
  Calendar,
  Award 
} from 'lucide-react-native';

const CoachRegistrationScreen = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    avatar: '',
    terms: false,
    role: '3', // 3 = coach par défaut
    sexe: 'M', // M par défaut
    specialite: '',
    annee_experience: '',
  });
  
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    // Demander les permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission requise', 'Vous devez autoriser l\'accès à la galerie de photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFormData({ ...formData, avatar: result.assets[0].uri });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validateForm = () => {
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return false;
    }

    // Validation du numéro de téléphone
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide');
      return false;
    }

    // Validation du mot de passe
    if (formData.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    // Confirmation du mot de passe
    if (formData.password !== formData.confirm_password) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    // Vérification des conditions d'utilisation
    if (!formData.terms) {
      Alert.alert('Erreur', 'Vous devez accepter les conditions d\'utilisation');
      return false;
    }

    // Validation des années d'expérience
    if (formData.annee_experience && isNaN(parseInt(formData.annee_experience))) {
      Alert.alert('Erreur', 'Les années d\'expérience doivent être un nombre');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Création de FormData pour envoyer les données y compris l'image
      const apiFormData = new FormData();
      
      // Ajout des champs texte
      apiFormData.append('full_name', formData.full_name);
      apiFormData.append('email', formData.email);
      apiFormData.append('phone', formData.phone);
      apiFormData.append('password', formData.password);
      apiFormData.append('role', parseInt(formData.role));
      apiFormData.append('sexe', formData.sexe);
      apiFormData.append('specialite', formData.specialite || '');
      apiFormData.append('annee_experience', formData.annee_experience ? parseInt(formData.annee_experience) : 0);
      apiFormData.append('terms', formData.terms ? 1 : 0);
      
      // Ajout de l'avatar si sélectionné
      if (formData.avatar) {
        const filename = formData.avatar.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        apiFormData.append('avatar', {
          uri: formData.avatar,
          name: filename,
          type,
        });
      }

      // Simuler l'appel API (à remplacer par votre véritable endpoint)
      console.log('Envoi des données:', apiFormData);
      
      // Simpler un délai pour montrer le chargement
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Inscription réussie', 
          'Votre compte coach a été créé avec succès!',
          [{ text: 'OK', onPress: () => console.log('Redirection vers la page de connexion') }]
        );
      }, 1500);
      
      // Pour une vraie API, décommentez le code ci-dessous et ajustez-le selon vos besoins
      /*
      const response = await fetch('https://votre-api.com/api/coach/register', {
        method: 'POST',
        body: apiFormData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        Alert.alert('Inscription réussie', 'Votre compte coach a été créé avec succès!');
        // Redirection ou autres actions après succès
      } else {
        Alert.alert('Erreur', responseData.message || 'Une erreur est survenue lors de l\'inscription');
      }
      */
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
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
        <Text style={styles.headerText}>Inscription Coach</Text>
        
        {/* Avatar */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={pickImage}>
            {formData.avatar ? (
              <Image source={{ uri: formData.avatar }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <ImageIcon size={40} color="#777" />
                <Text style={styles.placeholderText}>Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Informations personnelles */}
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        
        <View style={styles.inputContainer}>
          <User size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nom complet"
            value={formData.full_name}
            onChangeText={(text) => handleInputChange('full_name', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Phone size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
          />
        </View>

        {/* Mot de passe */}
        <View style={styles.inputContainer}>
          <Lock size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmer mot de passe"
            secureTextEntry
            value={formData.confirm_password}
            onChangeText={(text) => handleInputChange('confirm_password', text)}
          />
        </View>

        {/* Rôle */}
        <View style={styles.inputContainer}>
          <Shield size={20} color="#777" style={styles.icon} />
          <Text style={styles.pickerLabel}>Rôle:</Text>
          <Picker
            selectedValue={formData.role}
            onValueChange={(itemValue) => handleInputChange('role', itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Coach" value="3" />
            <Picker.Item label="Coach Principal" value="4" />
          </Picker>
        </View>

        {/* Sexe */}
        <View style={styles.inputContainer}>
          <User size={20} color="#777" style={styles.icon} />
          <Text style={styles.pickerLabel}>Sexe:</Text>
          <Picker
            selectedValue={formData.sexe}
            onValueChange={(itemValue) => handleInputChange('sexe', itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Masculin" value="M" />
            <Picker.Item label="Féminin" value="F" />
          </Picker>
        </View>

        {/* Informations professionnelles */}
        <Text style={styles.sectionTitle}>Informations professionnelles</Text>

        <View style={styles.inputContainer}>
          <Award size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Spécialité (ex: Musculation, Yoga, Natation...)"
            value={formData.specialite}
            onChangeText={(text) => handleInputChange('specialite', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Calendar size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Années d'expérience"
            keyboardType="numeric"
            value={formData.annee_experience}
            onChangeText={(text) => handleInputChange('annee_experience', text)}
          />
        </View>

        {/* Conditions d'utilisation */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, formData.terms && styles.checked]}
            onPress={() => handleInputChange('terms', !formData.terms)}
          >
            {formData.terms && <Text style={styles.checkmark}>✔</Text>}
          </TouchableOpacity>
          <Text style={styles.label}>J'accepte les conditions d'utilisation</Text>
        </View>

        {/* Bouton d'inscription */}
        <Button 
          title={loading ? 'Inscription en cours...' : 'S\'INSCRIRE'} 
          onPress={handleSubmit} 
          disabled={loading}
          color="#007BFF"
        />

        {/* Lien connexion */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Déjà inscrit ? </Text>
          <TouchableOpacity onPress={() => console.log('Navigation vers login')}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerText: {
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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
  placeholderText: {
    marginTop: 5,
    color: '#777',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 25,
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
  pickerLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#555',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default CoachRegistrationScreen;