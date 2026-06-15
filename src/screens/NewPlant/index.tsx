// src/screens/NewPlant/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext'; 
import { LogoIcon } from '../../components/LogoIcon';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ImagePickerButton } from '../../components/ImagePickerButton';
import { fetchPlantDetails } from '../../services/api';

export function NewPlant() {
  const { theme } = useTheme(); 
  const currentStyles = styles(theme); 

  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [waterFrequency, setWaterFrequency] = useState('');
  const [fertilizerFrequency, setFertilizerFrequency] = useState('');
  const [substrateFrequency, setSubstrateFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  async function handleAutoFill() {
    if (!name) return Alert.alert('Atenção', 'Digite o nome da planta primeiro para podermos pesquisar!');
    setIsSearching(true);
    const plantData = await fetchPlantDetails(name);
    setIsSearching(false);

    if (plantData) {
      setSpecies(plantData.species);
      setWaterFrequency(plantData.waterFrequency);
      setFertilizerFrequency(plantData.fertilizerFrequency);
      setSubstrateFrequency(plantData.substrateFrequency);
      setNotes(plantData.notes);
      Alert.alert('Dados Preenchidos', 'As informações foram sugeridas pela nossa base de dados mundial.', [{ text: 'Conferir e Editar' }, { text: 'Manter Dados' }]);
    }
  }

  async function handleRegisterPlant() {
    if (!name || !species) return Alert.alert('Atenção', 'Preencha pelo menos o Nome e a Espécie da planta.');
    const user = auth.currentUser;
    if (!user) return Alert.alert('Erro', 'Você precisa estar logado para cadastrar uma planta.');

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'plants'), {
        userId: user.uid, name, species,
        waterFrequency: Number(waterFrequency) || 0,
        fertilizerFrequency: Number(fertilizerFrequency) || 0,
        substrateFrequency: Number(substrateFrequency) || 0,
        notes, createdAt: Date.now(), imageUrl: imageUri || '',
      });
      Alert.alert('Sucesso!', 'Sua planta foi cadastrada com sucesso.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar a planta.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={currentStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={currentStyles.container}>
          
          {/* CABEÇALHO LIMPO COM SETA DE VOLTAR ADICIONADO AQUI */}
          <View style={currentStyles.headerRow}>
            <TouchableOpacity style={currentStyles.circleButton} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <LogoIcon size={50} />
            <View style={{ width: 44 }} />
          </View>

          <View style={currentStyles.header}>
            <Text style={currentStyles.title}>Nova Planta</Text>
            <Text style={currentStyles.subtitle}>Preencha os dados com base na espécie</Text>
          </View>

          <View style={currentStyles.formContainer}>
            <Input label="Nome da Planta:" placeholder="Ex: Minha Costela de Adão" value={name} onChangeText={setName} />
            <TouchableOpacity style={currentStyles.autoFillButton} onPress={handleAutoFill} disabled={isSearching}>
              <Text style={currentStyles.autoFillText}>{isSearching ? 'Buscando dados...' : '✨ Preencher automaticamente'}</Text>
            </TouchableOpacity>
            <Input label="Espécie da Planta:" placeholder="Ex: Monstera deliciosa" value={species} onChangeText={setSpecies} />
            <ImagePickerButton imageUri={imageUri} onImageSelected={setImageUri} />
            <Input label="Frequência de Rega (a cada X dias):" placeholder="Ex: 2" keyboardType="numeric" value={waterFrequency} onChangeText={setWaterFrequency} />
            <Input label="Frequência de Adubagem (a cada X dias):" placeholder="Ex: 30" keyboardType="numeric" value={fertilizerFrequency} onChangeText={setFertilizerFrequency} />
            <Input label="Troca de Substrato (a cada X dias):" placeholder="Ex: 365" keyboardType="numeric" value={substrateFrequency} onChangeText={setSubstrateFrequency} />
            <Input label="Outros cuidados (opcional):" placeholder="Ex: Gosta de borrifar água nas folhas" value={notes} onChangeText={setNotes} multiline={true} />

            <Button title="Cadastrar" onPress={handleRegisterPlant} isLoading={isLoading} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg, paddingTop: 50, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl },
  circleButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.inputBackground, alignItems: 'center', justifyContent: 'center', ...theme.shadow },
  header: { alignItems: 'center', marginBottom: theme.spacing.xl },
  title: { fontFamily: theme.fonts.bold, fontSize: 28, color: theme.colors.primary },
  subtitle: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.textSecondary, marginTop: -4 },
  formContainer: { width: '100%' },
  autoFillButton: { backgroundColor: theme.colors.primaryLight, paddingVertical: 12, borderRadius: theme.shape.buttonRadius, alignItems: 'center', marginTop: -8, marginBottom: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.primary },
  autoFillText: { fontFamily: theme.fonts.bold, color: theme.colors.primary, fontSize: 14 }
});