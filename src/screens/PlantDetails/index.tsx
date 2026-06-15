// src/screens/PlantDetails/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Feather } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { useTheme } from '../../contexts/ThemeContext';
import { LogoIcon } from '../../components/LogoIcon';
import { Button } from '../../components/Button';
import { PlantProps } from '../../types';

export function PlantDetails() {
  const { theme } = useTheme();
  const currentStyles = styles(theme);

  const navigation = useNavigation<any>();
  const route = useRoute();
  
  const params = route.params as any;
  const plantId = params?.plantId || params?.id;

  const [plant, setPlant] = useState<PlantProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  async function fetchPlantData() {
    if (!plantId) {
      Alert.alert('Erro', 'Identificador da planta não foi encontrado.');
      setIsLoading(false);
      return;
    }
    try {
      const docRef = doc(db, 'plants', plantId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPlant({ id: docSnap.id, ...docSnap.data() } as PlantProps);
      else Alert.alert('Ops', 'Esta planta não foi encontrada no banco de dados.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da planta.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchPlantData(); }, [plantId]);

  // AÇÃO SILENCIOSA: Sem interrupção na tela
  async function handleAction(type: 'water' | 'fertilizer' | 'substrate') {
    if (!plant || !plantId) return;
    const actionData = {
      water: { field: 'lastWatered' },
      fertilizer: { field: 'lastFertilized' },
      substrate: { field: 'lastSubstrate' }
    };
    try {
      const docRef = doc(db, 'plants', plantId);
      await updateDoc(docRef, { [actionData[type].field]: Date.now() });
      fetchPlantData(); // Atualiza os dados instantaneamente na tela
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a ação.');
    }
  }

  function handleDelete() {
    if (!plantId) return;
    Alert.alert('Excluir Planta', `Tem certeza que deseja excluir ${plant?.name}?`, [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim, excluir', style: 'destructive', onPress: async () => {
          try { await deleteDoc(doc(db, 'plants', plantId)); navigation.navigate('MyPlants'); } 
          catch (error) { Alert.alert('Erro', 'Não foi possível excluir a planta.'); }
        }
      }
    ]);
  }

  // MENU INFERIOR: Organiza opções secundárias a pedido do professor
  function handleOpenMenu() {
    Alert.alert(
      "Opções da Planta",
      "O que você deseja fazer?",
      [
        { text: "Editar Dados", onPress: () => navigation.navigate('EditPlant', { plantId }) },
        { text: "Excluir Planta", style: "destructive", onPress: handleDelete },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  }

  function formatDate(timestamp: number) {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  async function generatePDF() {
    if (!plant) return;
    setIsGeneratingPDF(true);
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Helvetica, sans-serif; padding: 40px; color: #333; }
            h1 { color: #32B768; font-size: 42px; margin-bottom: 5px; }
            h2 { color: #52665A; font-style: italic; font-size: 24px; font-weight: normal; margin-top: 0; }
            .section { margin-top: 30px; border-top: 2px solid #F0F0F0; padding-top: 20px; }
            .title { font-weight: bold; font-size: 18px; color: #32B768; margin-bottom: 15px; }
            .item { font-size: 16px; margin-bottom: 10px; line-height: 1.5; }
            .footer { margin-top: 50px; font-size: 12px; color: #AAB2AD; text-align: center; }
          </style>
        </head>
        <body>
          <h1>${plant.name}</h1><h2>${plant.species}</h2>
          <div class="section"><div class="title">Frequência de Cuidados</div>
            <div class="item">💧 Rega: a cada ${plant.waterFrequency} dia(s)</div>
            <div class="item">🌱 Adubagem: a cada ${plant.fertilizerFrequency} dia(s)</div>
            <div class="item">🪴 Substrato: a cada ${plant.substrateFrequency} dia(s)</div>
          </div>
          <div class="section"><div class="title">Últimos Registros</div>
            <div class="item">💧 Regada em: ${plant.lastWatered ? formatDate(plant.lastWatered) : 'Sem registro'}</div>
            <div class="item">🌱 Adubada em: ${plant.lastFertilized ? formatDate(plant.lastFertilized) : 'Sem registro'}</div>
            <div class="item">🪴 Substrato trocado em: ${plant.lastSubstrate ? formatDate(plant.lastSubstrate) : 'Sem registro'}</div>
          </div>
          ${plant.notes ? `<div class="section"><div class="title">Observações</div><div class="item">${plant.notes}</div></div>` : ''}
          <div class="footer">Documento gerado pelo aplicativo Sementha.</div>
        </body>
      </html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf', dialogTitle: 'Salvar Ficha da Planta' });
    } catch (error) { Alert.alert('Erro', 'Não foi possível gerar o documento da planta.'); } 
    finally { setIsGeneratingPDF(false); }
  }

  if (isLoading) {
    return (
      <View style={currentStyles.loadingContainer}>
        <LogoIcon size={80} />
        <Text style={currentStyles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={currentStyles.loadingContainer}>
        <LogoIcon size={80} />
        <Text style={currentStyles.loadingText}>Planta indisponível.</Text>
        <Button title="Voltar para a Lista" onPress={() => navigation.goBack()} style={{ marginTop: theme.spacing.md, paddingHorizontal: 20 }} />
      </View>
    );
  }

  return (
    <View style={currentStyles.container}>
      
      {/* HEADER LIMPO: Apenas voltar, Logo e Menu de Opções */}
      <View style={currentStyles.headerRow}>
        <TouchableOpacity style={currentStyles.circleButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        
        <LogoIcon size={50} />
        
        <TouchableOpacity style={currentStyles.circleButton} onPress={handleOpenMenu}>
          <Feather name="more-vertical" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={currentStyles.scrollContent}>
        <View style={currentStyles.brandHeader}>
          <Text style={currentStyles.plantName}>{plant.name}</Text>
          <Text style={currentStyles.plantSpecies}>{plant.species}</Text>
        </View>

        {plant.imageUrl ? (
          <Image source={{ uri: plant.imageUrl }} style={currentStyles.image} resizeMode="cover" fadeDuration={0} />
        ) : (
          <View style={currentStyles.imagePlaceholder}>
            <Feather name="image" size={40} color={theme.colors.textSecondary} />
          </View>
        )}

        {/* BOTÕES DE AÇÃO: Destaque visual total com cor sólida e texto branco */}
        <View style={currentStyles.actionRow}>
          <TouchableOpacity style={currentStyles.actionButton} onPress={() => handleAction('water')} activeOpacity={0.7}>
            <Text style={currentStyles.actionIcon}>💧</Text><Text style={currentStyles.actionLabel}>Regar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={currentStyles.actionButton} onPress={() => handleAction('fertilizer')} activeOpacity={0.7}>
            <Text style={currentStyles.actionIcon}>🌱</Text><Text style={currentStyles.actionLabel}>Adubar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={currentStyles.actionButton} onPress={() => handleAction('substrate')} activeOpacity={0.7}>
            <Text style={currentStyles.actionIcon}>🪴</Text><Text style={currentStyles.actionLabel}>Substrato</Text>
          </TouchableOpacity>
        </View>

        <View style={currentStyles.historySection}>
          <Text style={currentStyles.sectionTitle}>Últimos Cuidados</Text>
          {(!plant.lastWatered && !plant.lastFertilized && !plant.lastSubstrate) ? (
            <Text style={currentStyles.emptyHistory}>Ainda não há registros para esta planta.</Text>
          ) : (
            <View>
              {plant.lastWatered && (<View style={currentStyles.historyItem}><Text style={currentStyles.historyText}>💧 Regada em {formatDate(plant.lastWatered)}</Text></View>)}
              {plant.lastFertilized && (<View style={currentStyles.historyItem}><Text style={currentStyles.historyText}>🌱 Adubada em {formatDate(plant.lastFertilized)}</Text></View>)}
              {plant.lastSubstrate && (<View style={currentStyles.historyItem}><Text style={currentStyles.historyText}>🪴 Substrato trocado em {formatDate(plant.lastSubstrate)}</Text></View>)}
            </View>
          )}
        </View>

        {plant.notes && (
          <View style={currentStyles.notesContainer}>
            <Text style={currentStyles.sectionTitle}>Observações</Text>
            <Text style={currentStyles.notesText}>{plant.notes}</Text>
          </View>
        )}

        <View style={currentStyles.footer}>
          <Button title={isGeneratingPDF ? "Gerando Documento..." : "Exportar Ficha (PDF)"} onPress={generatePDF} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md },
  circleButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.inputBackground, alignItems: 'center', justifyContent: 'center', ...theme.shadow },
  scrollContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: 50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  loadingText: { marginTop: 10, fontFamily: theme.fonts.medium, color: theme.colors.textSecondary },
  brandHeader: { alignItems: 'center', marginBottom: theme.spacing.md },
  plantName: { fontFamily: theme.fonts.bold, fontSize: 28, color: theme.colors.primary, marginTop: 10 },
  plantSpecies: { fontFamily: theme.fonts.regular, fontSize: 16, color: theme.colors.textSecondary, fontStyle: 'italic' },
  image: { width: 250, height: 250, borderRadius: 20, alignSelf: 'center', marginVertical: theme.spacing.lg, ...theme.shadow },
  imagePlaceholder: { width: 250, height: 250, borderRadius: 20, backgroundColor: theme.colors.inputBackground, alignSelf: 'center', marginVertical: theme.spacing.lg, alignItems: 'center', justifyContent: 'center' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xl },
  
  // NOVOS ESTILOS PARA OS BOTÕES (Destaque Principal com Letra Branca)
  actionButton: { width: '30%', backgroundColor: theme.colors.primary, padding: 12, borderRadius: 16, alignItems: 'center', ...theme.shadow },
  actionIcon: { fontSize: 24, marginBottom: 4 },
  actionLabel: { fontFamily: theme.fonts.bold, fontSize: 12, color: '#FFFFFF' }, // TEXTO BRANCO FORÇADO
  
  historySection: { marginBottom: theme.spacing.xl },
  sectionTitle: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.text, marginBottom: theme.spacing.md },
  historyItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.inputBackground },
  historyText: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.text },
  emptyHistory: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.textSecondary, fontStyle: 'italic' },
  notesContainer: { marginBottom: theme.spacing.xl },
  notesText: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20 },
  footer: { marginTop: theme.spacing.xs }
});