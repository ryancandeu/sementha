import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../contexts/ThemeContext'; 
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LogoIcon } from '../../components/LogoIcon';

export function Login() {
  const { theme } = useTheme(); 
  const currentStyles = styles(theme); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<any>();

  async function handleLogin() {
    if (email === '' || password === '') return Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error: any) {
      Alert.alert('Erro', 'Usuário não encontrado ou senha incorreta.');
    } finally {
      setIsLoading(false); 
    }
  }

  return (
    <KeyboardAvoidingView style={currentStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LogoIcon />
      <View style={currentStyles.formContainer}>
        <Input label="E-mail:" placeholder="Insira seu e-mail aqui" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <Input label="Senha:" placeholder="Insira sua senha aqui" secureTextEntry={true} value={password} onChangeText={setPassword} />
        <TouchableOpacity style={currentStyles.forgotPasswordButton} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={currentStyles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        <Button title="Entrar" onPress={handleLogin} isLoading={isLoading} />
        <View style={currentStyles.registerContainer}>
          <Text style={currentStyles.registerText}>Ainda não possui conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={currentStyles.registerLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg, justifyContent: 'center' },
  formContainer: { width: '100%' },
  forgotPasswordButton: { alignSelf: 'flex-start', marginTop: -8, marginBottom: theme.spacing.lg },
  forgotPasswordText: { fontFamily: theme.fonts.regular, fontSize: 12, color: theme.colors.textSecondary, textDecorationLine: 'underline' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: theme.spacing.lg },
  registerText: { fontFamily: theme.fonts.regular, fontSize: 12, color: theme.colors.text },
  registerLink: { fontFamily: theme.fonts.bold, fontSize: 12, color: theme.colors.textSecondary, textDecorationLine: 'underline' }
});