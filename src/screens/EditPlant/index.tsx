// src/screens/EditPlant/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext'; 
import { LogoIcon } from '../../components/LogoIcon';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ImagePickerButton } from '../../components/ImagePickerButton';

export function EditPlant() {
  const { theme } = useTheme(); 
  const currentStyles = styles(theme); 

  const navigation = useNavigation<any>();
  const route = useRoute();
  const { plantId } = route.params as { plantId: string };

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [waterFrequency, setWaterFrequency] = useState('');
  const [fertilizerFrequency, setFertilizerFrequency] = useState('');
  const [substrateFrequency, setSubstrateFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadPlant() {
      try {
        const docRef = doc(db, 'plants', plantId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setSpecies(data.species || '');
          setWaterFrequency(data.waterFrequency ? String(data.waterFrequency) : '');
          setFertilizerFrequency(data.fertilizerFrequency ? String(data.fertilizerFrequency) : '');
          setSubstrateFrequency(data.substrateFrequency ? String(data.substrateFrequency) : '');
          setNotes(data.notes || '');
          setImageUri(data.imageUrl || null);
        } else {
          Alert.alert('Erro', 'Planta não encontrada.');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar dados da planta.');
      } finally {
        setIsLoading(false);
      }
    }
    loadPlant();
  }, [plantId]);

  async function handleUpdatePlant() {
    if (!name || !species) return Alert.alert('Atenção', 'Nome e Espécie são obrigatórios.');
    setIsSaving(true);
    try {
      const docRef = doc(db, 'plants', plantId);
      await updateDoc(docRef, {
        name, species,
        waterFrequency: Number(waterFrequency) || 0,
        fertilizerFrequency: Number(fertilizerFrequency) || 0,
        substrateFrequency: Number(substrateFrequency) || 0,
        notes, imageUrl: imageUri || '',
      });
      Alert.alert('Sucesso!', 'Planta atualizada com sucesso.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a planta.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View style={currentStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={currentStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* CABEÇALHO LIMPO COM SETA DE VOLTAR */}
      <View style={currentStyles.headerRow}>
        <TouchableOpacity style={currentStyles.circleButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <LogoIcon size={50} />
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={currentStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={currentStyles.header}>
          <Text style={currentStyles.title}>Editar Planta</Text>
          <Text style={currentStyles.subtitle}>Atualize as informações necessárias</Text>
        </View>

        <View style={currentStyles.formContainer}>
          <Input label="Nome da Planta:" value={name} onChangeText={setName} />
          <Input label="Espécie da Planta:" value={species} onChangeText={setSpecies} />
          <ImagePickerButton imageUri={imageUri} onImageSelected={setImageUri} />
          <Input label="Frequência de Rega (a cada X dias):" keyboardType="numeric" value={waterFrequency} onChangeText={setWaterFrequency} />
          <Input label="Frequência de Adubagem (a cada X dias):" keyboardType="numeric" value={fertilizerFrequency} onChangeText={setFertilizerFrequency} />
          <Input label="Troca de Substrato (a cada X dias):" keyboardType="numeric" value={substrateFrequency} onChangeText={setSubstrateFrequency} />
          <Input label="Outros cuidados (opcional):" value={notes} onChangeText={setNotes} multiline={true} />

          <Button title="Salvar Alterações" onPress={handleUpdatePlant} isLoading={isSaving} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md },
  circleButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.inputBackground, alignItems: 'center', justifyContent: 'center', ...theme.shadow },
  scrollContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  header: { alignItems: 'center', marginBottom: theme.spacing.xl },
  title: { fontFamily: theme.fonts.bold, fontSize: 28, color: theme.colors.primary },
  subtitle: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.textSecondary, marginTop: -4 },
  formContainer: { width: '100%' }
});