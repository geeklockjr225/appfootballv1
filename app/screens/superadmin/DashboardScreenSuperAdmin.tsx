
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';
import { useAuth } from '../../_contexts/AuthContext';
import { useRouter } from 'expo-router';
import { 
  LogOut, 
  UsersRound, 
  Home, 
  Settings, 
  Bell, 
  User,
  ChevronRight
} from 'lucide-react-native';
import { AsyncLocalStorage } from 'async_hooks';



const { width } = Dimensions.get('window');

const DashboardScreenSuperAdmin = () => {
  const { user, logout } :any  = useAuth();
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Vérification utilisateur avec protection contre navigation prématurée
  useEffect(() => {
    // Animations d'entrée pour tous les cas
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true
      })
    ]).start();
    
    // Redirection sécurisée avec setTimeout
    if (!user) {
      const timeout = setTimeout(() => {
        router.push('/');
      }, 100); // Petit délai pour assurer le montage complet
      return () => clearTimeout(timeout);
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Déconnecter", 
          onPress: async () => 
          {
            try{
               await logout()
            } catch (error) {
              console.error('erreur de deconnexion',error);
              Alert.alert('')
              
            }
          },
            
          style: "destructive" 
        },
      ],
      { cancelable: true }
    );
  };

  const navigateTo = (route) => {
    router.push(route);
  };

  // Extraire initiales pour l'avatar de secours
  const getInitials = () => {
    if (!user?.name) return "U";
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0];
  };

  const menuItems = [
    {
      id: 'create-club',
      icon: <UsersRound size={32} color="#ffffff" />,
      title: 'Créer un Club',
      subtitle: 'Gérer vos clubs',
      route: './FormCreateClub',
      color: '#4C6EF5'
    },
    {
      id: 'settings',
      icon: <Settings size={32} color="#ffffff" />,
      title: 'Paramètres',
      subtitle: 'Configuration',
      route: './settings',
      color: '#12B886'
    },
    {
      id: 'notifications',
      icon: <Bell size={32} color="#ffffff" />,
      title: 'Notifications',
      subtitle: '3 nouvelles',
      route: './notifications',
      color: '#FD7E14'
    },
    {
      id: 'profile',
      icon: <User size={32} color="#ffffff" />,
      title: 'Profil',
      subtitle: 'Vos informations',
      route: './profile',
      color: '#7950F2'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <Animated.View 
        style={[
          styles.container, 
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        {/* Header avec info utilisateur */}
        <View style={styles.header}>
          <View style={styles.userInfoContainer}>
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
            )}
            
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>Bienvenue,</Text>
              <Text style={styles.name}>{user?.name || 'Utilisateur'}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.logoutButton}
            
            onPress={handleLogout}
          >
            <LogOut size={22} color="#FF6B6B" />
            <Text>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        {/* Carte résumé */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tableau de bord</Text>
          <Text style={styles.summaryText}>
            Gérez facilement vos clubs et accédez à toutes les fonctionnalités
          </Text>
        </View>

        {/* Menu items en grille */}
        <View style={styles.menuGrid}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridItem}
              onPress={() => navigateTo(item.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconContainer, { backgroundColor: item.color }]}>
                {item.icon}
              </View>
              <Text style={styles.gridItemTitle}>{item.title}</Text>
              <Text style={styles.gridItemSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>App version 1.0.0</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4C6EF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userTextContainer: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#868E96',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  logoutButton: {
    padding: 10,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridItem: {
    width: (width - 50) / 2, // Deux par ligne avec espace entre les deux
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    aspectRatio: 1, // Format carré
  },
  gridIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 6,
    textAlign: 'center',
  },
  gridItemSubtitle: {
    fontSize: 13,
    color: '#868E96',
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#ADB5BD',
  },
});

export default DashboardScreenSuperAdmin;