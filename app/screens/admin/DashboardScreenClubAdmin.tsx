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
import { ExternalPathString, RelativePathString, UnknownInputParams, useRouter } from 'expo-router';
import {
  LogOut,
  Settings,
  Bell,
  User,
  ChevronRight,
  UserPlus,
  Users
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const DashboardScreenAdmin = () => {
  const { user, logout } = useAuth()!;
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
    ]).start();

    if (!user) {
      const timeout = setTimeout(() => router.push('/'), 100);
      return () => clearTimeout(timeout);
    }
  }, [fadeAnim, router, slideAnim, user]);

   /*const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            try { await logout(); }
            catch (e) { console.error('Déconnexion échouée', e); }
          }
        }
      ],
      { cancelable: true }
    );
  }; */

  const navigateTo = (route: string | { pathname: RelativePathString; params?: UnknownInputParams; } | { pathname: ExternalPathString; params?: UnknownInputParams; } | { pathname: `/`; params?: UnknownInputParams; } | { pathname: `/_sitemap`; params?: UnknownInputParams; } | { pathname: `/screens/admin/DashboardScreenClubAdmin`; params?: UnknownInputParams; } | { pathname: `/screens/admin/FormInscriAdmin`; params?: UnknownInputParams; } | { pathname: `/screens/assistant/DashboardScreenAssistant`; params?: UnknownInputParams; } | { pathname: `/screens/assistant/FormInscriAssistant`; params?: UnknownInputParams; } | { pathname: `/screens/coatch/DashboardScreenCoatch`; params?: UnknownInputParams; } | { pathname: `/screens/coatch/FormInscriCoatch`; params?: UnknownInputParams; } | { pathname: `/screens/parent/DashboardScreenParentEnfant`; params?: UnknownInputParams; } | { pathname: `/screens/parent/FormInscriParentEnfant`; params?: UnknownInputParams; } | { pathname: `/screens/superadmin/DashboardScreenSuperAdmin`; params?: UnknownInputParams; } | { pathname: `/screens/superadmin/FormCreateClubPresident`; params?: UnknownInputParams; } | { pathname: `/screens/superadmin/InscriptionScreenSuperAdmin`; params?: UnknownInputParams; } | { pathname: `/screens/superadmin/LoginScreenSuperAdmin`; params?: UnknownInputParams; } | { pathname: `/_contexts/AuthContext`; params?: UnknownInputParams; }) => router.push(route);

  const getInitials = () => {
    if (!user?.email) return 'U';
    const parts = user.email.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`
      : parts[0][0];
  };

  const menuItems = [
    
    {
      id: 'create-coach',
      icon: <UserPlus size={32} color="#fff" />, title: 'Créer Coaches', subtitle: 'Ajouter un coach',
      route: './FormInscriCoatch', color: '#51CF66'
    },
    {
      id: 'create-player',
      icon: <Users size={32} color="#fff" />, title: 'Créer Joueurs', subtitle: 'Ajouter un joueur',
      route: './FormInscriParentEnfant', color: '#339AF0'
    },
    {
      id: 'create-assistant',
      icon: <User size={32} color="#fff" />, title: 'Créer Assistant Admin', subtitle: 'Ajouter un assistant',
      route: './FormInscriAssistant', color: '#F08F3F'
    },
    {
      id: 'settings',
      icon: <Settings size={32} color="#fff" />, title: 'Paramètres', subtitle: 'Configuration',
      route: './settings', color: '#12B886'
    },
    {
      id: 'notifications',
      icon: <Bell size={32} color="#fff" />, title: 'Notifications', subtitle: '3 nouvelles',
      route: './notifications', color: '#FD7E14'
    },
    {
      id: 'profile',
      icon: <User size={32} color="#fff" />, title: 'Profil', subtitle: 'Vos informations',
      route: './profile', color: '#7950F2'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>        
        <View style={styles.header}>
          <View style={styles.userInfoContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}><Text style={styles.avatarText}>{getInitials()}</Text></View>
            )}
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>Bienvenue,</Text>
              <Text style={styles.name}>{user?.email || 'Utilisateur'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <LogOut size={22} color="#FF6B6B" />
            <Text>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tableau de bord</Text>
          <Text style={styles.summaryText}>Gérez facilement vos membres et accédez à toutes les fonctionnalités</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map(item => (
            <TouchableOpacity key={item.id} style={styles.gridItem} onPress={() => navigateTo(item.route)} activeOpacity={0.7}>
              <View style={[styles.gridIconContainer, { backgroundColor: item.color }]}>
                {item.icon}
              </View>
              <Text style={styles.gridItemTitle}>{item.title}</Text>
              <Text style={styles.gridItemSubtitle}>{item.subtitle}<ChevronRight size={16} /></Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}><Text style={styles.footerText}>App version 1.0.0</Text></View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea:
   { 
    flex:1, backgroundColor:'#f8f9fa' 

   },

  container:
  { flex:1,paddingTop:20,paddingHorizontal:20 },

  header:
  { flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:24 },

  userInfoContainer:
  { flexDirection:'row',alignItems:'center' },

  avatar:
  { width:50,height:50,borderRadius:25 },

  avatarFallback:
  { width:50,height:50,borderRadius:25,backgroundColor:'#4C6EF5',justifyContent:'center',alignItems:'center' },

  avatarText:
  { color:'#fff',fontSize:18,fontWeight:'bold' },

  userTextContainer:
  { marginLeft:12 },
  welcomeText:
  { fontSize:14,color:'#868E96' },
  name:
  { fontSize:18,fontWeight:'700',color:'#212529' },

  logoutButton:
  { padding:10,flexDirection:'row',alignItems:'center',gap:4 },
  summaryCard:
  { backgroundColor:'white',borderRadius:16,padding:20,marginBottom:24,shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.05,shadowRadius:8,elevation:3 },
  summaryTitle:
  { fontSize:20,fontWeight:'700',color:'#212529',marginBottom:8 },
  summaryText:
  { fontSize:14,color:'#495057',lineHeight:20 },
  menuGrid:
  { flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',marginBottom:24 },
  gridItem:
  { width:(width-50)/2,backgroundColor:'white',borderRadius:16,padding:16,marginBottom:16,alignItems:'center',justifyContent:'center',shadowColor:'#000',shadowOffset:{width:0,height:3},shadowOpacity:0.05,shadowRadius:8,elevation:3,aspectRatio:1 },
  gridIconContainer:
  { width:70,height:70,borderRadius:22,justifyContent:'center',alignItems:'center',marginBottom:16 },

  gridItemTitle:
  { fontSize:16,fontWeight:'700',color:'#212529',marginBottom:6,textAlign:'center' },
  gridItemSubtitle:
  { fontSize:13,color:'#868E96',textAlign:'center' },
  footer:
  { marginTop:'auto',alignItems:'center',paddingBottom:20 },
  footerText:
  { fontSize:12,color:'#ADB5BD' }
});

export default DashboardScreenAdmin;


