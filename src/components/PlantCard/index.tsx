// src/components/PlantCard/index.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { PlantProps } from '../../types';

interface PlantCardProps {
  data: PlantProps;
}

export function PlantCard({ data }: PlantCardProps) {
  const { theme, isDarkMode } = useTheme();
  
  // Passamos o isDarkMode para o style para ajustar a borda/sombra no modo noturno
  const currentStyles = styles(theme, isDarkMode);
  
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      style={currentStyles.container}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PlantDetails', { plantId: data.id })}
    >
      {/* HEADER MEDIA: Imagem "Full-bleed" colada nas bordas do topo (Padrão M3) */}
      {data.imageUrl ? (
        <Image 
          source={{ uri: data.imageUrl }} 
          style={currentStyles.image} 
          resizeMode="cover"
          fadeDuration={0} // Sem piscar!
        />
      ) : (
        <View style={currentStyles.imagePlaceholder}>
          <Text style={currentStyles.imageText}>Sem Foto</Text>
        </View>
      )}

      {/* CONTENT: Textos alinhados à esquerda (Padrão M3) */}
      <View style={currentStyles.content}>
        <Text style={currentStyles.name} numberOfLines={1}>{data.name}</Text>
        <Text style={currentStyles.species} numberOfLines={1}>{data.species}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    width: '48%', // Garante o alinhamento no grid de 2 colunas
    backgroundColor: theme.colors.background,
    borderRadius: 12, // Padrão M3 para Cards
    marginBottom: theme.spacing.md,
    overflow: 'hidden', // Corta a imagem para ela respeitar o arredondamento do topo
    
    // SOMBRAS M3 (Elevated Card Variant)
    elevation: 2,
    shadowColor: isDarkMode ? '#000' : theme.colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    
    // No modo escuro, uma bordinha sutil ajuda na legibilidade (Outlined Card Hybrid)
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: theme.colors.inputBackground,
  },
  image: {
    width: '100%',
    height: 120, // Imagem ocupando toda a área superior
    backgroundColor: theme.colors.inputBackground,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: theme.colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.medium,
    fontSize: 12,
  },
  content: {
    padding: 12, // Área de respiro inferior
    alignItems: 'flex-start', // Material Design 3 exige textos alinhados à esquerda
  },
  name: {
    fontFamily: theme.fonts.bold,
    fontSize: 14, // M3 Headline
    color: theme.colors.text,
    marginBottom: 2,
  },
  species: {
    fontFamily: theme.fonts.regular,
    fontSize: 12, // M3 Subhead
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});