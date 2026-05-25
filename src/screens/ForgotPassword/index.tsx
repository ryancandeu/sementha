import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';

import { useTheme } from '../../contexts/ThemeContext'; 
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export function ForgotPassword() {
  const { theme } = useTheme(); 
  const currentStyles = styles(theme); 

  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleResetPassword() {
    if (!email) return Alert.alert('Atenção', 'Por favor, insira seu e-mail cadastrado.');
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('E-mail enviado!', 'Verifique sua caixa de entrada e a pasta de spam para redefinir sua senha.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'Formato de e-mail inválido.');
      } else {
        Alert.alert('Erro', 'Não foi possível enviar o e-mail. Verifique o endereço digitado.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.header}>
        <Text style={currentStyles.title}>Recuperar Senha</Text>
        <Text style={currentStyles.subtitle}>
          Insira seu e-mail abaixo e enviaremos um link para você criar uma nova senha.
        </Text>
      </View>

      <View style={currentStyles.formContainer}>
        <Input 
          label="E-mail cadastrado:" 
          placeholder="Insira seu e-mail aqui" 
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Button title="Enviar link de recuperação" onPress={handleResetPassword} isLoading={isLoading} />

        <TouchableOpacity style={currentStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={currentStyles.backButtonText}>Voltar para o Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg, justifyContent: 'center' },
  header: { marginBottom: theme.spacing.xl },
  title: { fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.primary, marginBottom: theme.spacing.sm },
  subtitle: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20 },
  formContainer: { width: '100%' },
  backButton: { marginTop: theme.spacing.lg, alignItems: 'center' },
  backButtonText: { fontFamily: theme.fonts.bold, fontSize: 14, color: theme.colors.textSecondary, textDecorationLine: 'underline' }
});