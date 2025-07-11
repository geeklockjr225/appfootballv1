// Correction pour DashboardScreenAssistant.tsx
import React from 'react';
import { View, Text } from 'react-native';

// Votre code de composant existant ici
export const DashboardScreenAssistant = () => {
  return (
    <View>
      <Text>Tableau de bord Assistant</Text>
    </View>
  );
};

// Ajouter l'export par défaut
export default DashboardScreenAssistant;

// Corrections similaires pour les autres fichiers de route :
// DashboardScreenClubAdmin.tsx
// DashboardScreenCoatch.tsx
// DashboardScreenParentEnfant.tsx
// Chacun doit avoir `export default NomDuComposant;` à la fin