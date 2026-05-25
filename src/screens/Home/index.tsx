import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { auth, db } from '../../services/firebase';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons'; 
import * as Location from 'expo-location';

import { useTheme } from '../../contexts/ThemeContext'; 
import { Button } from '../../components/Button';
import { LogoIcon } from '../../components/LogoIcon';
import { PlantProps } from '../../types';
import { registerForPushNotificationsAsync, schedulePlantNotifications } from '../../services/notifications';

export function Home() {
  const { theme } = useTheme(); 
  const currentStyles = styles(theme); 

  const navigation = useNavigation<any>();
  const user = auth.currentUser;
  
  const [greeting, setGreeting] = useState('');
  const [waterCount, setWaterCount] = useState(0);

  const [weatherTemp, setWeatherTemp] = useState<number | null>(null);
  const [weatherCity, setWeatherCity] = useState<string>('');
  const [weatherCode, setWeatherCode] = useState<number>(0);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

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

  function getWeatherEmoji(code: number) {
    if (code === 0) return '☀️'; 
    if (code >= 1 && code <= 3) return '⛅'; 
    if (code >= 51 && code <= 67) return '🌧️'; 
    if (code >= 80 && code <= 82) return '🌦️'; 
    if (code >= 95) return '⛈️'; 
    return '🌡️';
  }

  useEffect(() => { registerForPushNotificationsAsync(); }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setWeatherCity('Permissão negada');
          setIsWeatherLoading(false);
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
        if (geocode.length > 0) setWeatherCity(geocode[0].city || geocode[0].subregion || 'Sua região');

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        
        setWeatherTemp(Math.round(data.current_weather.temperature));
        setWeatherCode(data.current_weather.weathercode);
      } catch (error) {
        setWeatherCity('Indisponível');
      } finally {
        setIsWeatherLoading(false);
      }
    }
    fetchWeather();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'plants'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const plants: PlantProps[] = [];
      querySnapshot.forEach((doc) => plants.push({ id: doc.id, ...doc.data() } as PlantProps));

      const toWaterToday = plants.filter(plant => {
        if (!plant.waterFrequency || plant.waterFrequency <= 0) return false;
        const lastWatered = plant.lastWatered || plant.createdAt || Date.now();
        return calculateDaysRemaining(lastWatered, plant.waterFrequency) === 0;
      });

      setWaterCount(toWaterToday.length);
      schedulePlantNotifications(toWaterToday.length);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <ScrollView style={currentStyles.container} contentContainerStyle={currentStyles.contentContainer} showsVerticalScrollIndicator={false}>
      
      <View style={currentStyles.header}>
        <View style={currentStyles.userInfo}>
          <LogoIcon size={40} />
          <View>
            <Text style={currentStyles.greeting}>{greeting},</Text>
            <Text style={currentStyles.userName}>{user?.displayName || 'Usuário'}</Text>
          </View>
        </View>

        <TouchableOpacity style={currentStyles.profileButton} onPress={() => navigation.navigate('Profile')} activeOpacity={0.7}>
          <Feather name="user" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={currentStyles.weatherCard}>
        {isWeatherLoading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : weatherTemp !== null ? (
          <View style={currentStyles.weatherContent}>
            <Text style={currentStyles.weatherEmoji}>{getWeatherEmoji(weatherCode)}</Text>
            <View style={currentStyles.weatherTextContainer}>
              <Text style={currentStyles.weatherCity}>{weatherCity}</Text>
              <Text style={currentStyles.weatherText}>
                {weatherTemp}°C - {weatherCode >= 51 ? 'Vai chover! Cuidado com a rega dupla.' : 'Tempo seco, confira suas tarefas!'}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={currentStyles.weatherText}>Clima indisponível no momento.</Text>
        )}
      </View>

      <View style={currentStyles.menuGrid}>
        <TouchableOpacity style={currentStyles.menuCard} onPress={() => navigation.navigate('MyPlants')} activeOpacity={0.8}>
          <View style={currentStyles.cardIconContainer}>
            <Image source={require('../../../assets/minhas-plantas.png')} style={currentStyles.pngIcon} />
          </View>
          <Text style={currentStyles.cardTitle}>Minhas Plantas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={currentStyles.menuCard} onPress={() => navigation.navigate('NewPlant')} activeOpacity={0.8}>
          <View style={currentStyles.cardIconContainer}>
            <Image source={require('../../../assets/nova-planta.png')} style={currentStyles.pngIcon} />
          </View>
          <Text style={currentStyles.cardTitle}>Nova Planta</Text>
        </TouchableOpacity>
      </View>

      <View style={currentStyles.tasksSummary}>
        <Text style={currentStyles.tasksTitle}>Resumo de hoje</Text>
        <View style={currentStyles.taskItem}>
          <Text style={currentStyles.taskEmoji}>💧</Text>
          <Text style={currentStyles.taskText}>{waterCount > 0 ? `${waterCount} planta(s) precisam de rega hoje.` : 'Tudo certo com a rega por hoje!'}</Text>
        </View>
        <View style={currentStyles.taskItem}>
          <Text style={currentStyles.taskEmoji}>🌱</Text>
          <Text style={currentStyles.taskText}>Verifique as tarefas completas para adubagem.</Text>
        </View>
        <Button title="Ir para Tarefas" onPress={() => navigation.navigate('Tasks')} style={{ marginTop: theme.spacing.md }} />
      </View>
    </ScrollView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { padding: theme.spacing.lg, paddingTop: 60, paddingBottom: theme.spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  greeting: { fontFamily: theme.fonts.regular, fontSize: 16, color: theme.colors.textSecondary },
  userName: { fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.text, marginTop: -4 },
  profileButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center', ...theme.shadow },
  weatherCard: { backgroundColor: theme.colors.primaryLight, padding: theme.spacing.md, borderRadius: theme.shape.borderRadius, marginBottom: theme.spacing.xl, alignItems: 'center', justifyContent: 'center', minHeight: 70, borderWidth: 1, borderColor: theme.colors.primary + '30' },
  weatherContent: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  weatherEmoji: { fontSize: 32, marginRight: theme.spacing.md },
  weatherTextContainer: { flex: 1 },
  weatherCity: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.primary },
  weatherText: { fontFamily: theme.fonts.regular, fontSize: 13, color: theme.colors.text, marginTop: 2 },
  menuGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xl },
  menuCard: { width: '48%', height: 160, backgroundColor: theme.colors.primary, borderRadius: theme.shape.borderRadius, padding: theme.spacing.md, justifyContent: 'space-between', ...theme.shadow },
  cardIconContainer: { alignItems: 'flex-start', marginTop: theme.spacing.xs },
  pngIcon: { width: 90, height: 90, resizeMode: 'contain', tintColor: '#FFF' },
  cardTitle: { fontFamily: theme.fonts.bold, fontSize: 16, color: '#FFF', marginBottom: theme.spacing.xs },
  tasksSummary: { backgroundColor: theme.colors.inputBackground, borderRadius: theme.shape.borderRadius, padding: theme.spacing.md, ...theme.shadow },
  tasksTitle: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.text, marginBottom: theme.spacing.md },
  taskItem: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  taskEmoji: { fontSize: 20, marginRight: theme.spacing.sm },
  taskText: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.text, flex: 1 }
});