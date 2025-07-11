import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { User, Mail, Phone, Lock, Upload, CheckSquare, Briefcase, Calendar, FileText, Users } from 'lucide-react-native';

export default function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [terms, setTerms] = useState(false);
  const [role, setRole] = useState('');
  const [sexe, setSexe] = useState('male');
  const [diplome, setDiplome] = useState('');
  const [experience, setExperience] = useState('0');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setAvatar(result);
    }
  };

  const handleSubmit = async () => {
    if (!terms) {
      return Alert.alert('Vous devez accepter les termes et conditions');
    }
    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('sexe', sexe);
    formData.append('diplome', diplome);
    formData.append('annee_experience', experience);
    formData.append('terms', terms);
    if (avatar) {
      formData.append('avatar', {
        uri: avatar.uri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      const response = await fetch('https://your-api-endpoint.com/api/assistant_admins', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Inscription réussie!', JSON.stringify(data));
      } else {
        Alert.alert('Erreur à l\u2019inscription', JSON.stringify(data));
      }
    } catch (error) {
      Alert.alert('Erreur réseau', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <View style={styles.inputGroup}>
        <User size={20} />
        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <View style={styles.inputGroup}>
        <Mail size={20} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputGroup}>
        <Phone size={20} />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />
      </View>
      <View style={styles.inputGroup}>
        <Lock size={20} />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
        <Upload size={16} />
        <Text style={styles.uploadText}>
          {avatar ? 'Changer Avatar' : 'Télécharger Avatar'}
        </Text>
      </TouchableOpacity>
      {avatar && <Image source={{ uri: avatar.uri }} style={styles.avatarPreview} />}
      <View style={styles.optionGroup}>
        <Text style={styles.label}>Rôle</Text>
        <View style={styles.roleOptions}>
          <TouchableOpacity
            style={[styles.roleBtn, role === '1' && styles.roleSelected]}
            onPress={() => setRole('1')}
          >
            <Users size={16} /><Text>Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === '2' && styles.roleSelected]}
            onPress={() => setRole('2')}
          >
            <Users size={16} /><Text>Assistant</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.optionGroup}>
        <Text style={styles.label}>Sexe</Text>
        <View style={styles.roleOptions}>
          <TouchableOpacity
            style={[styles.roleBtn, sexe === 'male' && styles.roleSelected]}
            onPress={() => setSexe('male')}
          >
            <Briefcase size={16} /><Text>Homme</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, sexe === 'female' && styles.roleSelected]}
            onPress={() => setSexe('female')}
          >
            <Briefcase size={16} /><Text>Femme</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <FileText size={20} />
        <TextInput
          style={styles.input}
          placeholder="Diplôme"
          value={diplome}
          onChangeText={setDiplome}
        />
      </View>
      <View style={styles.inputGroup}>
        <Calendar size={20} />
        <TextInput
          style={styles.input}
          placeholder="Années d'expérience"
          value={experience}
          keyboardType="numeric"
          onChangeText={setExperience}
        />
      </View>
      <TouchableOpacity style={styles.checkGroup} onPress={() => setTerms(!terms)}>
        <CheckSquare size={20} />
        <Text style={styles.checkText}>J'accepte les termes et conditions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>S'inscrire</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'stretch' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  input: { marginLeft: 10, flex: 1 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderWidth: 1, borderColor: '#aaa', borderRadius: 8, marginBottom: 15 },
  uploadText: { marginLeft: 8 },
  avatarPreview: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, alignSelf: 'center' },
  optionGroup: { marginBottom: 15 },
  label: { marginBottom: 5, fontWeight: 'bold' },
  roleOptions: { flexDirection: 'row', justifyContent: 'space-between' },
  roleBtn: { flexDirection: 'row', alignItems: 'center', padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, flex: 1, justifyContent: 'center', marginHorizontal: 5 },
  roleSelected: { backgroundColor: '#e0f7fa', borderColor: '#00acc1' },
  checkGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkText: { marginLeft: 8 },
  submitBtn: { backgroundColor: '#007aff', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
