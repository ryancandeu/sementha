import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label: string;
}

export function Input({ label, ...rest }: InputProps) {
  const { theme } = useTheme();
  const currentStyles = styles(theme);

  return (
    <View style={currentStyles.container}>
      <Text style={currentStyles.label}>{label}</Text>
      <TextInput 
        style={currentStyles.input} 
        placeholderTextColor={theme.colors.textSecondary}
        {...rest}
      />
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
  input: {
    width: '100%',
    height: 52,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.shape.borderRadius,
    paddingHorizontal: theme.spacing.md,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
  }
});