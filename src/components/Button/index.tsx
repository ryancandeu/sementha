import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TouchableOpacityProps,
  ActivityIndicator,
  StyleProp,
  ViewStyle
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>; 
}

export function Button({ title, isLoading = false, style, ...rest }: ButtonProps) {
  const { theme } = useTheme();
  const currentStyles = styles(theme);

  return (
    <TouchableOpacity 
      style={[currentStyles.container, style]} 
      activeOpacity={0.8}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.colors.surface} />
      ) : (
        <Text style={currentStyles.title}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.shape.buttonRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.surface,
  }
});