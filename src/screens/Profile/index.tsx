// src/screens/Profile/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateProfile, signOut, deleteUser } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { auth, db } from '../../services/firebase';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext'; 
import { LogoIcon } from '../../components/LogoIcon';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PlantProps } from '../../types';
import { schedulePlantNotifications } from '../../services/notifications'; 

export function Profile() {
  const { theme, isDarkMode, toggleTheme } = useTheme(); 
  const currentStyles = styles(theme); 

  const navigation = useNavigation<any>();
  const user = auth.currentUser;

  const [name, setName] = useState(user?.displayName || '');
  const [notificationTime, setNotificationTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const savedTime = await AsyncStorage.getItem('@sementha:notifTime');
        if (savedTime) setNotificationTime(savedTime);
      } catch (error) {
        console.log("Erro ao carregar configurações", error);
      }
    }
    loadSettings();
  }, []);

  function handleTimeChange(text: string) {
    let rawText = text.replace(/[^0-9]/g, '');
    if (rawText.length > 2) {
      rawText = `${rawText.substring(0, 2)}:${rawText.substring(2, 4)}`;
    }
    setNotificationTime(rawText);
  }

  function calculateDaysRemaining(lastActionTimestamp: number, frequency: number): number {
    if (!frequency || frequency <= 0) return -1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const actionDate = new Date(lastActionTimestamp);
    actionDate.setHours(0, 0, 0, 0);
    const msDiff = today.getTime() - actionDate.getTime();
    const daysPassed = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    if (daysPassed >= frequency) return 0; 
    return frequency - daysPassed;
  }

  async function handleSaveProfile() {
    setIsLoading(true);
    try {
      if (user && name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      await AsyncStorage.setItem('@sementha:notifTime', notificationTime);

      if (user) {
        const q = query(collection(db, 'plants'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const plants: PlantProps[] = [];
        snapshot.forEach((doc) => plants.push({ id: doc.id, ...doc.data() } as PlantProps));
        
        const todayTasks = plants.filter(plant => {
          if (!plant.waterFrequency || plant.waterFrequency <= 0) return false;
          const lastWatered = plant.lastWatered || plant.createdAt || Date.now();
          return calculateDaysRemaining(lastWatered, plant.waterFrequency) === 0;
        }).length;

        await schedulePlantNotifications(todayTasks);
      }

      Alert.alert('Sucesso', 'Perfil e configurações atualizados!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Atenção!',
      'Tem certeza que deseja excluir sua conta? Todos os seus dados serão apagados permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, excluir',
          style: 'destructive',
          onPress: async () => {
            if (user) {
              try {
                await deleteUser(user);
                await AsyncStorage.clear();
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
              } catch (error: any) {
                if (error.code === 'auth/requires-recent-login') {
                  Alert.alert('Erro de Segurança', 'Para excluir a conta, você precisa sair e fazer login novamente.');
                } else {
                  Alert.alert('Erro', 'Não foi possível excluir a conta.');
                }
              }
            }
          }
        }
      ]
    );
  }

  return (
    <View style={currentStyles.container}>
      
      <View style={currentStyles.headerRow}>
        <TouchableOpacity style={currentStyles.circleButton} onPress={() => navigation.navigate('Home')}>
          <Feather name="home" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <LogoIcon size={50} />
        
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={currentStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={currentStyles.greetingContainer}>
          <Text style={currentStyles.greetingTitle}>Olá, {name || 'Usuário'}</Text>
          <Text style={currentStyles.greetingSubtitle}>Gerencie sua conta e configurações</Text>
        </View>

        {/* CONTROLE DE MODO ESCURO */}
        <View style={currentStyles.section}>
          <Text style={currentStyles.sectionTitle}>Aparência</Text>
          <View style={currentStyles.switchRow}>
            <Text style={currentStyles.helperText}>Ativar Modo Escuro</Text>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleTheme} 
              trackColor={{ false: theme.colors.inputBackground, true: theme.colors.primaryLight }}
              thumbColor={isDarkMode ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={currentStyles.section}>
          <Text style={currentStyles.sectionTitle}>Dados Pessoais</Text>
          <Input 
            label="Nome:" 
            placeholder="Seu nome" 
            value={name} 
            onChangeText={setName} 
          />
          <Input 
            label="E-mail (Apenas leitura):" 
            value={user?.email || ''} 
            editable={false}
          />
        </View>

        <View style={currentStyles.section}>
          <Text style={currentStyles.sectionTitle}>Notificações</Text>
          <Text style={currentStyles.helperText}>A que horas você prefere ser lembrado de cuidar das suas plantas?</Text>
          <View style={{ marginTop: theme.spacing.sm }}>
            <Input 
              label="Horário (HH:MM):" 
              placeholder="Ex: 09:00" 
              value={notificationTime} 
              onChangeText={handleTimeChange}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>

        <Button 
          title="Salvar Alterações" 
          onPress={handleSaveProfile} 
          isLoading={isLoading} 
          style={{ marginBottom: theme.spacing.xl }}
        />

        <View style={currentStyles.dangerZone}>
          <TouchableOpacity style={currentStyles.actionRow} onPress={handleSignOut}>
            <Feather name="log-out" size={20} color={theme.colors.textSecondary} />
            <Text style={currentStyles.signOutText}>Sair da Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={currentStyles.actionRow} onPress={handleDeleteAccount}>
            <Feather name="trash-2" size={20} color={theme.colors.danger} />
            <Text style={currentStyles.deleteText}>Excluir Conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md },
  circleButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.inputBackground, alignItems: 'center', justifyContent: 'center', ...theme.shadow },
  scrollContainer: { paddingHorizontal: theme.spacing.lg, paddingBottom: 40 },
  greetingContainer: { alignItems: 'center', marginBottom: theme.spacing.xl, marginTop: theme.spacing.sm },
  greetingTitle: { fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.primary },
  greetingSubtitle: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  section: { marginBottom: theme.spacing.lg },
  sectionTitle: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.text, marginBottom: theme.spacing.md },
  helperText: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.textSecondary },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.inputBackground, padding: 16, borderRadius: theme.shape.borderRadius, marginTop: theme.spacing.xs },
  dangerZone: { borderTopWidth: 1, borderTopColor: theme.colors.inputBackground, paddingTop: theme.spacing.lg },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md },
  signOutText: { fontFamily: theme.fonts.medium, fontSize: 16, color: theme.colors.textSecondary, marginLeft: theme.spacing.sm },
  deleteText: { fontFamily: theme.fonts.medium, fontSize: 16, color: theme.colors.danger, marginLeft: theme.spacing.sm }
});