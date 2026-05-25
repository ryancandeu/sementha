import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface LogoIconProps {
  size?: number;
}

export function LogoIcon({ size = 160 }: LogoIconProps) {
  const { theme } = useTheme();
  const currentStyles = styles(theme);

  return (
    <View style={[currentStyles.container, { marginVertical: size > 100 ? theme.spacing.lg : theme.spacing.xs }]}>
      <Image 
        source={require('../../../assets/icon.png')} 
        style={{ width: size, height: size, resizeMode: 'contain' }}
      />
    </View>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});