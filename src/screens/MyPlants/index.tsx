import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext'; 
import { PlantCard } from '../../components/PlantCard';
import { LogoIcon } from '../../components/LogoIcon';
import { PlantProps } from '../../types';
import { Button } from '../../components/Button';

export function MyPlants() {
  const { theme } = useTheme(); 
  const currentStyles = styles(theme); 

  const navigation = useNavigation<any>();
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filters = ['Todos', 'Por Nome', 'Urgência', 'Frequência', 'Categoria'];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, 'plants'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPlants: PlantProps[] = [];
      querySnapshot.forEach((doc) => fetchedPlants.push({ id: doc.id, ...doc.data() } as PlantProps));
      fetchedPlants.sort((a, b) => b.createdAt - a.createdAt);
      setPlants(fetchedPlants);
      applyFilters(search, activeFilter, fetchedPlants);
      setIsLoading(false);
      setIsRefreshing(false);
    });
    return () => unsubscribe();
  }, []);

  function applyFilters(searchText: string, filterType: string, basePlants: PlantProps[]) {
    let result = [...basePlants];
    if (searchText) result = result.filter(plant => plant.name.toLowerCase().includes(searchText.toLowerCase()));
    
    switch (filterType) {
      case 'Por Nome':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Urgência':
        const today = Date.now();
        const msInDay = 1000 * 60 * 60 * 24;
        result.sort((a, b) => {
          const daysA = Math.floor((today - a.createdAt) / msInDay);
          const urgA = a.waterFrequency > 0 ? a.waterFrequency - (daysA % a.waterFrequency) : 999;
          const daysB = Math.floor((today - b.createdAt) / msInDay);
          const urgB = b.waterFrequency > 0 ? b.waterFrequency - (daysB % b.waterFrequency) : 999;
          return urgA - urgB;
        });
        break;
      case 'Frequência':
        result.sort((a, b) => (a.waterFrequency || 0) - (b.waterFrequency || 0));
        break;
      case 'Categoria':
        result.sort((a, b) => a.species.localeCompare(b.species));
        break;
      case 'Todos':
      default:
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }
    setFilteredPlants(result);
  }

  function handleSearch(text: string) { setSearch(text); applyFilters(text, activeFilter, plants); }
  function handleFilterSelect(filter: string) { setActiveFilter(filter); applyFilters(search, filter, plants); }

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

      <View style={currentStyles.searchContainer}>
        <Feather name="search" size={20} color={theme.colors.textSecondary} style={currentStyles.searchIcon} />
        <TextInput style={currentStyles.searchInput} placeholder="Buscar planta..." placeholderTextColor={theme.colors.textSecondary} value={search} onChangeText={handleSearch} />
      </View>

      <View style={currentStyles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={currentStyles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity key={filter} style={[currentStyles.filterPill, activeFilter === filter && currentStyles.filterPillActive]} onPress={() => handleFilterSelect(filter)}>
              <Text style={[currentStyles.filterText, activeFilter === filter && currentStyles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlantCard data={item} />}
          numColumns={2}
          columnWrapperStyle={currentStyles.row}
          contentContainerStyle={currentStyles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => setIsRefreshing(true)} tintColor={theme.colors.primary} />}
          ListEmptyComponent={() => (
            <View style={currentStyles.emptyContainer}>
              <Feather name="inbox" size={48} color={theme.colors.textSecondary} />
              <Text style={currentStyles.emptyText}>Nenhuma planta encontrada.</Text>
            </View>
          )}
        />
      )}

      <View style={currentStyles.footerContainer}>
        <Button title="+ Cadastrar Nova Planta" onPress={() => navigation.navigate('NewPlant')} style={currentStyles.floatingButton} />
      </View>
    </View>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md },
  circleButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.inputBackground, alignItems: 'center', justifyContent: 'center', ...theme.shadow },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.inputBackground, marginHorizontal: theme.spacing.lg, borderRadius: theme.shape.borderRadius, paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.md },
  searchIcon: { marginRight: theme.spacing.sm },
  searchInput: { flex: 1, paddingVertical: 12, fontFamily: theme.fonts.regular, color: theme.colors.text },
  filtersWrapper: { height: 40, marginBottom: theme.spacing.md },
  filtersContainer: { paddingHorizontal: theme.spacing.lg, gap: theme.spacing.sm },
  filterPill: { backgroundColor: theme.colors.inputBackground, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, justifyContent: 'center' },
  filterPillActive: { backgroundColor: theme.colors.primary },
  filterText: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.textSecondary },
  filterTextActive: { color: '#FFF' },
  listContainer: { paddingHorizontal: theme.spacing.lg, paddingBottom: 120 },
  row: { justifyContent: 'space-between', gap: theme.spacing.md },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.textSecondary, marginTop: theme.spacing.sm },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: theme.spacing.lg, backgroundColor: theme.colors.background + 'E6' },
  floatingButton: { ...theme.shadow }
});