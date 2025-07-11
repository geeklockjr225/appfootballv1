import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { User, Mail, Phone, Lock, Image as ImageIcon } from 'lucide-react-native';
import {Checkbox} from 'expo-checkbox';
import axios from 'axios';

export default function TwoStepRegistration() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [parentData, setParentData] = useState({ parent_full_name: '', parent_email: '', parent_phone: '', parent_password: '', parent_avatar: '' as string | null, parent_terms: false, parent_role: 'parent', parent_sexe: 'Femme' });
  const [playerData, setPlayerData] = useState({ joueur_full_name: '', joueur_email: '', joueur_phone: '', joueur_avatar: '' as string | null, joueur_terms: false, joueur_sexe: 'Homme', joueur_date_de_naissance: '', joueur_classe: '', joueur_antecedent: '', joueur_categorie: '', joueur_taille: '', joueur_poids: '', joueur_position: '' });

  const pickImage = async (target: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) {
      if (target === 'parent') {
        setParentData({ ...parentData, parent_avatar: result.assets[0].uri });
      } else {
        setPlayerData({ ...playerData, joueur_avatar: result.assets[0].uri });
      }
    }
  };

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();

    // Combine les données des deux étapes
    const combinedData = { ...parentData, ...playerData };

    // Ajoute les données combinées au FormData
    Object.entries(combinedData).forEach(async ([key, value]) => {
      if (value !== null && value !== '') {
        if (key === 'avatar' && typeof value === 'string') {
          let uriParts: string[] = [];
          if (typeof value === 'string') {
            uriParts = value.split('.');
          }
          const fileType = uriParts[uriParts.length - 1];
          // Convertir l'URI en un Blob
      const response = await fetch(value);
      const blob = await response.blob();

          data.append('avatar', blob, `avatar.${fileType}`);
        } else {
          data.append(key, value.toString());
        }
      }
    });

    try {
      // Envoie toutes les données vers un seul lien
      const response = await axios.post('http://127.0.0.1:8000/api/admin/register-parent-joueur', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Success:', response.data);
      // TODO: navigation après succès
    } catch (error:any) {
      //console.error('Error:', error);
      if (error.response?.status === 422) {
        const apiErrors = error.response.data.errors;
        console.log('Validation errors:', apiErrors);
    
        // Concaténez tous les messages pour un alert simple :
        const allMessages = Object.values(apiErrors)
          .flat()
          .join('\n');
    
        Alert.alert('Erreur de validation', allMessages);
      } else {
        Alert.alert('Erreur', error.response?.data.message || error.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === 1 ? (
        <View style={styles.formBox}>
          <Text style={styles.title}>Inscription Parents</Text>

          {/* Nom */}
          <View style={styles.inputGroup}>
            <User size={20} />
            <TextInput
              placeholder="Nom complet"
              style={styles.input}
              value={parentData.parent_full_name}
              onChangeText={(text) => setParentData({ ...parentData, parent_full_name: text })}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Mail size={20} />
            <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={parentData.parent_email}
              onChangeText={(text) => setParentData({ ...parentData, parent_email: text })}
            />
          </View>

          {/* Téléphone */}
          <View style={styles.inputGroup}>
            <Phone size={20} />
            <TextInput
              placeholder="Téléphone"
              style={styles.input}
              keyboardType="phone-pad"
              value={parentData.parent_phone}
              onChangeText={(text) => setParentData({ ...parentData, parent_phone: text })}
            />
          </View>

          {/* Mot de passe */}
          <View style={styles.inputGroup}>
            <Lock size={20} />
            <TextInput
              placeholder="Mot de passe"
              style={styles.input}
              secureTextEntry
              value={parentData.parent_password}
              onChangeText={(text) => setParentData({ ...parentData, parent_password: text })}
            />
          </View>

          {/* Avatar */}
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('parent')}>
            <ImageIcon size={20} />
            <Text style={styles.imageText}>{parentData.parent_avatar ? 'Changer Avatar' : 'Choisir Avatar'}</Text>
          </TouchableOpacity>

          {/* Terms */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={parentData.parent_terms}
              onValueChange={(val) => setParentData({ ...parentData, parent_terms: val })}
            />
            <Text>J&apos;accepte les termes et conditions</Text>
          </View>

          {/* Sexe */}
          <View style={styles.radioGroup}>
            <TouchableOpacity
              onPress={() => setParentData({ ...parentData, parent_sexe: 'Homme' })}
              style={[styles.radio, parentData.parent_sexe === 'Homme' && styles.radioSelected]}
            >
              <Text>Homme</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setParentData({ ...parentData, parent_sexe: 'Femme' })}
              style={[styles.radio, parentData.parent_sexe === 'Femme' && styles.radioSelected]}
            >
              <Text>Femme</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Suivant</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formBox}>
          <Text style={styles.title}>Inscription Joueurs</Text>

          {/* Nom */}
          <View style={styles.inputGroup}>
            <User size={20} />
            <TextInput
              placeholder="Nom complet"
              style={styles.input}
              value={playerData.joueur_full_name}
              onChangeText={(text) => setPlayerData({ ...playerData, joueur_full_name: text })}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Mail size={20} />
            <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={playerData.joueur_email}
              onChangeText={(text) => setPlayerData({ ...playerData, joueur_email: text })}
            />
          </View>

          {/* Téléphone */}
          <View style={styles.inputGroup}>
            <Phone size={20} />
            <TextInput
              placeholder="Téléphone"
              style={styles.input}
              keyboardType="phone-pad"
              value={playerData.joueur_phone}
              onChangeText={(text) => setPlayerData({ ...playerData, joueur_phone: text })}
            />
          </View>

          {/* Avatar */}
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('player')}>
            <ImageIcon size={20} />
            <Text style={styles.imageText}>{playerData.joueur_avatar ? 'Changer Avatar' : 'Choisir Avatar'}</Text>
          </TouchableOpacity>

          {/* Terms */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={playerData.joueur_terms}
              onValueChange={(val) => setPlayerData({ ...playerData, joueur_terms: val })}
            />
            <Text>J&apos;accepte les termes et conditions</Text>
          </View>

          {/* Sexe */}
          <View style={styles.radioGroup}>
            <TouchableOpacity
              onPress={() => setPlayerData({ ...playerData, joueur_sexe: 'Homme' })}
              style={[styles.radio, playerData.joueur_sexe === 'Homme' && styles.radioSelected]}
            >
              <Text>Homme</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPlayerData({ ...playerData, joueur_sexe: 'Femme' })}
              style={[styles.radio, playerData.joueur_sexe === 'Femme' && styles.radioSelected]}
            >
              <Text>Femme</Text>
            </TouchableOpacity>
          </View>

          {/* Date de naissance */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Date de naissance (YYYY-MM-DD)"
              style={styles.input}
              value={playerData.joueur_date_de_naissance}
              onChangeText={(text) => setPlayerData({ ...playerData, joueur_date_de_naissance: text })}
            />
          </View>

          {/* Classe */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Classe"
              style={styles.input}
              value={playerData.joueur_classe}
              onChangeText={(text) => setPlayerData({ ...playerData, joueur_classe: text })}
            />
          </View>

          {/* Antécédent */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Antécédent"
              style={styles.input}
              value={playerData.joueur_antecedent}
              onChangeText={(text) => setPlayerData({ ...playerData, joueur_antecedent: text })}
            />
          </View>

          {/* Catégorie */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Catégorie"
              style={styles.input}
              value={playerData.joueur_categorie}
              onChangeText={(text) => setPlayerData({ ...playerData, joueur_categorie: text })}
            />
          </View>

          {/* Taille */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Taille"
              style={styles.input}
              value={playerData.joueur_taille}
              onChangeText={(text) => setPlayerData({ ...playerData, joueur_taille: text })}
            />
          </View>

          {/* Poids */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Poids"
              style={styles.input}
              value={playerData.joueur_poids}
              onChangeText={(text) => setPlayerData({ ...playerData, joueur_poids: text })}
            />
          </View>

          {/* Position */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Position"
              style={styles.input}
              value={playerData.joueur_position}
              onChangeText={(text) => setPlayerData({ ...playerData, joueur_position: text })}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleBack} disabled={loading}>
            <Text style={styles.buttonText}>Retour</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Envoyer</Text>}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  formBox: { marginBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  input: { flex: 1, marginLeft: 10 },
  imagePicker: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  imageText: { marginLeft: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  radioGroup: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  radio: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  radioSelected: { backgroundColor: '#e6f7ff', borderColor: '#1890ff' },
  button: { backgroundColor: '#1890ff', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
