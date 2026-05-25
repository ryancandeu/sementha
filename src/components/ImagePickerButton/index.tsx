import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../contexts/ThemeContext';

interface ImagePickerButtonProps {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
}

export function ImagePickerButton({ imageUri, onImageSelected }: ImagePickerButtonProps) {
  const { theme } = useTheme();
  const currentStyles = styles(theme);

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.7,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  }

  return (
    <View style={currentStyles.container}>
      <Text style={currentStyles.label}>Foto da Planta:</Text>
      
      <TouchableOpacity 
        style={currentStyles.button} 
        activeOpacity={0.8} 
        onPress={handlePickImage}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={currentStyles.image} />
        ) : (
          <View style={currentStyles.placeholder}>
            <Text style={currentStyles.title}>Importe seus arquivos</Text>
            <Text style={currentStyles.subtitle}>Toque para fazer upload</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  button: {
    width: '100%',
    height: 120,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.shape.borderRadius,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
  },
  placeholder: {
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.primary,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  }
});