import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../_contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Headset, LogOut, Phone, UsersRound } from 'lucide-react-native';

const DashboardScreen = () => {
  const authContext = useAuth();
  const user = authContext?.user;
  const logout = authContext?.logout;
  const router = useRouter();



  // Ne pas naviguer tant que la navigation n’est pas prête
  /*useEffect(() => {
    if (user === null && typeof window !== 'undefined') {
      const timeout = setTimeout(() => {
        router.push('/');
      }, 0); // attend que la navigation soit prête
      return () => clearTimeout(timeout);
    }
  }, [user]);*/

  useEffect(() => {
    // Vérifie si la navigation est prête avant de rediriger
    if (typeof window !== 'undefined' && !user) {
      const timeout = setTimeout(() => {
        router.push('/');
      }, 0); // Attend que la navigation soit prête
      return () => clearTimeout(timeout);
    }
  }, [router, user]);

  /*const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Oui", onPress: () => logout() },
      ]
    );
  };*/

 



  return (
    <View style={styles.container}>
      {/* Header avec avatar + nom/prénom */}
      <View style={styles.header}>
        <Image
          source={
             require('../../../assets/images/avatar.jpg') // avatar par défaut
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>Bienvenue {user?.email || 'Utilisateur'} </Text>
      </View>

      {/* Navigation / Menu */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('./DashboardScreenSuperAdmin')}
        >
          <Text style={styles.menuText}> <UsersRound /> Suivre mon enfant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/')}
        >
          <Text style={styles.menuText}><Phone /> Contact support</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={logout}
        >
          <Text style={styles.menuText}><LogOut /> Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems:'center',
    
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menu: {
    flexDirection: 'row', // Alignement horizontal
    justifyContent: 'space-around', // Espace entre les éléments
    padding: 10,
    gap:20,
    flexWrap: 'wrap'
  },
  menuItem: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:8,
    
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    padding:5
  },
});
