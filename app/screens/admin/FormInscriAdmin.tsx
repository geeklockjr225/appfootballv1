import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { User, Mail, Phone, Lock, Image as ImageIcon, CheckSquare } from 'lucide-react-native';

export default function RegistrationForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [terms, setTerms] = useState(false);
  const [role, setRole] = useState('0');
  const [sexe, setSexe] = useState('male');

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied for media library');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!terms) {
      alert('Veuillez accepter les termes et conditions');
      return;
    }
    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('sexe', sexe);
    formData.append('terms', terms ? '1' : '0');
    if (avatar) {
      formData.append('avatar', {
        uri: avatar,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      const response = await fetch('https://your-api.com/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert('Inscription réussie !');
      } else {
        alert('Erreur: ' + (data.message || 'Impossible de s\'inscrire'));
      }
    } catch (error) {
      console.error(error);
      alert('Erreur réseau');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inscription Admin</Text>
      <View style={styles.inputGroup}>
        <User color="#333" size={20} />
        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <View style={styles.inputGroup}>
        <Mail color="#333" size={20} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputGroup}>
        <Phone color="#333" size={20} />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>
      <View style={styles.inputGroup}>
        <Lock color="#333" size={20} />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.avatarPicker} onPress={pickAvatar}>
        <ImageIcon color="#333" size={20} />
        <Text style={styles.avatarText}>{avatar ? 'Changer Avatar' : 'Choisir Avatar'}</Text>
      </TouchableOpacity>
      {avatar && <Image source={{ uri: avatar }} style={styles.avatarPreview} />}
      <View style={styles.switchGroup}>
        <CheckSquare color="#333" size={20} />
        <Text style={styles.switchLabel}>Accepter les termes</Text>
        <Switch value={terms} onValueChange={setTerms} />
      </View>
      <View style={styles.pickerGroup}>
        <Text>Rôle (0=SuperAdmin,1=Club,...)</Text>
        <View style={styles.roleButtons}>
          {['0', '1', '2'].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleButton, role === r && styles.roleButtonActive]}
              onPress={() => setRole(r)}
            >
              <Text style={role === r ? styles.roleTextActive : styles.roleText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.pickerGroup}>
        <Text>Sexe</Text>
        <View style={styles.roleButtons}>
          {['male', 'female', 'other'].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.roleButton, sexe === s && styles.roleButtonActive]}
              onPress={() => setSexe(s)}
            >
              <Text style={sexe === s ? styles.roleTextActive : styles.roleText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>S'inscrire</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  input: {
    marginLeft: 10,
    flex: 1,
  },
  avatarPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    marginLeft: 10,
    color: '#333',
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    flex: 1,
    marginLeft: 10,
  },
  pickerGroup: {
    marginBottom: 15,
  },
  roleButtons: {
    flexDirection: 'row',
    marginTop: 5,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  roleButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  roleText: {
    color: '#333',
  },
  roleTextActive: {
    color: '#fff',
  },
  submitBtn: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
