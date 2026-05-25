import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext'; 
import { LogoIcon } from '../../components/LogoIcon';
import { Button } from '../../components/Button';
import { PlantProps } from '../../types';

interface TaskItemProps { plantName: string; daysRemaining: number; }

export function Tasks() {
  const { theme } = useTheme(); 
  const currentStyles = styles(theme);

  const navigation = useNavigation<any>();
  const [waterTasks, setWaterTasks] = useState<TaskItemProps[]>([]);
  const [fertilizerTasks, setFertilizerTasks] = useState<TaskItemProps[]>([]);
  const [substrateTasks, setSubstrateTasks] = useState<TaskItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function calculateDaysRemaining(lastActionTimestamp: number, frequency: number): number {
    if (!frequency || frequency <= 0) return -1;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const actionDate = new Date(lastActionTimestamp); actionDate.setHours(0, 0, 0, 0);
    const msDiff = today.getTime() - actionDate.getTime();
    const daysPassed = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    if (daysPassed >= frequency) return 0; 
    return frequency - daysPassed;
  }

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, 'plants'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const water: TaskItemProps[] = []; const fert: TaskItemProps[] = []; const subs: TaskItemProps[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as PlantProps;
        const createdAt = data.createdAt || Date.now();
        if (data.waterFrequency > 0) water.push({ plantName: data.name, daysRemaining: calculateDaysRemaining(data.lastWatered || createdAt, data.waterFrequency) });
        if (data.fertilizerFrequency > 0) fert.push({ plantName: data.name, daysRemaining: calculateDaysRemaining(data.lastFertilized || createdAt, data.fertilizerFrequency) });
        if (data.substrateFrequency > 0) subs.push({ plantName: data.name, daysRemaining: calculateDaysRemaining(data.lastSubstrate || createdAt, data.substrateFrequency) });
      });
      const sortTasks = (a: TaskItemProps, b: TaskItemProps) => a.daysRemaining - b.daysRemaining;
      setWaterTasks(water.sort(sortTasks)); setFertilizerTasks(fert.sort(sortTasks)); setSubstrateTasks(subs.sort(sortTasks));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  function renderTaskLine(task: TaskItemProps) {
    const isToday = task.daysRemaining === 0;
    return (
      <View key={task.plantName} style={currentStyles.taskLine}>
        <Text style={currentStyles.plantNameText} numberOfLines={1}>• {task.plantName}</Text>
        <View style={[currentStyles.badge, isToday ? currentStyles.badgeToday : currentStyles.badgeFuture]}>
          <Text style={[currentStyles.badgeText, isToday ? currentStyles.badgeTextToday : currentStyles.badgeTextFuture]}>
            {isToday ? 'Hoje' : `Em ${task.daysRemaining} dias`}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.headerRow}>
        <TouchableOpacity style={currentStyles.circleButton} onPress={() => navigation.navigate('Home')}>
          <Feather name="home" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <LogoIcon size={50} />
        <TouchableOpacity style={currentStyles.circleButton} onPress={() => navigation.navigate('Profile')}>
          <Feather name="user" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={currentStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={currentStyles.titleContainer}><Text style={currentStyles.title}>Tarefas</Text></View>

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <View style={currentStyles.content}>
            <View style={currentStyles.row}>
              <View style={currentStyles.taskBoxContainer}>
                <View style={currentStyles.taskBoxHeader}><Text style={currentStyles.taskBoxTitle}>💧 Regar</Text></View>
                <View style={currentStyles.taskBoxBody}>{waterTasks.length > 0 ? waterTasks.map(renderTaskLine) : <Text style={currentStyles.emptyText}>Sem tarefas.</Text>}</View>
              </View>

              <View style={currentStyles.taskBoxContainer}>
                <View style={currentStyles.taskBoxHeader}><Text style={currentStyles.taskBoxTitle}>🌱 Adubar</Text></View>
                <View style={currentStyles.taskBoxBody}>{fertilizerTasks.length > 0 ? fertilizerTasks.map(renderTaskLine) : <Text style={currentStyles.emptyText}>Sem tarefas.</Text>}</View>
              </View>
            </View>

            <View style={currentStyles.fullWidthTaskBox}>
              <View style={currentStyles.taskBoxHeader}><Text style={currentStyles.taskBoxTitle}>🪴 Trocar Substrato</Text></View>
              <View style={currentStyles.taskBoxBody}>{substrateTasks.length > 0 ? substrateTasks.map(renderTaskLine) : <Text style={currentStyles.emptyText}>Nenhuma troca pendente.</Text>}</View>
            </View>
          </View>
        )}

        <Button title="Minhas Plantas" onPress={() => navigation.navigate('MyPlants')} style={{ marginTop: theme.spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md },
  circleButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.inputBackground, alignItems: 'center', justifyContent: 'center', ...theme.shadow },
  scrollContainer: { paddingHorizontal: theme.spacing.lg, paddingBottom: 40 },
  titleContainer: { alignItems: 'center', marginBottom: theme.spacing.lg },
  title: { fontFamily: theme.fonts.bold, fontSize: 28, color: theme.colors.primary, marginTop: 4 },
  content: { width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.md },
  taskBoxContainer: { width: '48%', backgroundColor: theme.colors.primaryLight, borderRadius: theme.shape.borderRadius, overflow: 'hidden', ...theme.shadow },
  fullWidthTaskBox: { width: '100%', backgroundColor: theme.colors.primaryLight, borderRadius: theme.shape.borderRadius, overflow: 'hidden', marginBottom: theme.spacing.md, ...theme.shadow },
  taskBoxHeader: { backgroundColor: theme.colors.primaryLight, paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.primary },
  taskBoxTitle: { fontFamily: theme.fonts.bold, fontSize: 14, color: theme.colors.text },
  taskBoxBody: { backgroundColor: theme.colors.background, padding: theme.spacing.sm, minHeight: 100 },
  taskLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.inputBackground },
  plantNameText: { fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.text, flex: 1, marginRight: 4 },
  badge: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  badgeToday: { backgroundColor: theme.colors.danger },
  badgeFuture: { backgroundColor: theme.colors.primaryLight },
  badgeText: { fontFamily: theme.fonts.bold, fontSize: 10 },
  badgeTextToday: { color: '#FFF' },
  badgeTextFuture: { color: theme.colors.primary },
  emptyText: { fontFamily: theme.fonts.regular, fontSize: 12, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 20 }
});