import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LogoIcon } from '../../components/LogoIcon';

export function Register() {
  const { theme } = useTheme();
  const currentStyles = styles(theme);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<any>();

  async function handleRegister() {
    if (name === '' || email === '' || password === '') {
      return Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
    }

    if (password.length < 6) {
      return Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] }) 
        }
      ]);
    } catch (error: any) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível criar a conta. Verifique o e-mail inserido.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={currentStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={currentStyles.container}>
          
          <LogoIcon />

          <View style={currentStyles.formContainer}>
            <Input 
              label="Nome:" 
              placeholder="Como quer ser chamado?" 
              value={name}
              onChangeText={setName} 
            />

            <Input 
              label="E-mail:" 
              placeholder="Insira seu e-mail aqui" 
              keyboardType="email-address" 
              autoCapitalize="none" 
              value={email}
              onChangeText={setEmail} 
            />
            
            <Input 
              label="Senha:" 
              placeholder="Crie uma senha (mínimo 6 caracteres)" 
              secureTextEntry={true} 
              value={password}
              onChangeText={setPassword}
            />

            <Button 
              title="Cadastrar" 
              onPress={handleRegister} 
              isLoading={isLoading} 
              style={{ marginTop: theme.spacing.md }}
            />

            <View style={currentStyles.loginContainer}>
              <Text style={currentStyles.loginText}>Já possui uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={currentStyles.loginLink}>Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  loginText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.text,
  },
  loginLink: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textDecorationLine: 'underline',
  }
});