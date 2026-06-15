// src/components/LogoIcon/index.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

// 🏆 O SEGREDO DO CACHE ESTÁ AQUI:
// Colocando o require do lado de fora, o arquivo é decodificado e salvo na
// memória RAM do celular apenas 1 vez durante a inicialização do app.
const LOGO_IMAGE = require('../../../assets/icon.png');

interface LogoIconProps {
  size?: number;
}

export function LogoIcon({ size = 160 }: LogoIconProps) {
  const { theme } = useTheme();
  const currentStyles = styles(theme);

  return (
    <View style={[currentStyles.container, { marginVertical: size > 100 ? theme.spacing.lg : theme.spacing.xs }]}>
      <Image 
        source={LOGO_IMAGE} 
        style={{ width: size, height: size, resizeMode: 'contain' }}
        fadeDuration={0} // Mantemos o 0 para evitar o efeito de piscar
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