import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { PlantProps } from '../../types';

interface PlantCardProps {
  data: PlantProps;
}

export function PlantCard({ data }: PlantCardProps) {
  const { theme } = useTheme();
  const currentStyles = styles(theme);
  
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      style={currentStyles.container}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PlantDetails', { plantId: data.id })}
    >
      {data.imageUrl ? (
        <Image source={{ uri: data.imageUrl }} style={currentStyles.image} />
      ) : (
        <View style={currentStyles.imagePlaceholder}>
          <Text style={currentStyles.imageText}>Foto</Text>
        </View>
      )}

      <Text style={currentStyles.name}>{data.name}</Text>
      <Text style={currentStyles.species}>{data.species}</Text>
    </TouchableOpacity>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    maxWidth: '48%', 
    ...theme.shadow,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing.sm,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.colors.surface, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  imageText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.medium,
    fontSize: 12,
  },
  name: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
  },
  species: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 2,
  },
});