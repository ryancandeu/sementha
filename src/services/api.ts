import { Alert } from 'react-native';

const API_KEY = 'sk-w5L96a13be0a7744417558'; 
const BASE_URL = 'https://perenual.com/api';

async function translateToEnglish(text: string): Promise<string> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|en`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    return text; 
  } catch (error) {
    return text;
  }
}

export async function fetchPlantDetails(plantName: string) {
  try {
    const translatedName = await translateToEnglish(plantName);
    
    const response = await fetch(`${BASE_URL}/species-list?key=${API_KEY}&q=${translatedName}`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      Alert.alert('Ops', `Não encontramos "${plantName}" na base de dados.`);
      return null;
    }

    const plant = data.data[0];

    let waterDays = 7;
    const apiWatering = plant.watering?.toLowerCase();
    if (apiWatering === 'frequent') waterDays = 2;
    if (apiWatering === 'average') waterDays = 7;
    if (apiWatering === 'minimum') waterDays = 14;

    let sunlightInfo = '';
    if (Array.isArray(plant.sunlight)) sunlightInfo = plant.sunlight.join(', ');
    else if (typeof plant.sunlight === 'string') sunlightInfo = plant.sunlight;

    const notes = (sunlightInfo && !sunlightInfo.includes('http')) 
      ? `Recomendação de Luz: ${sunlightInfo}` 
      : '';
    
    return {
      species: plant.scientific_name[0] || plant.common_name,
      waterFrequency: String(waterDays),
      fertilizerFrequency: '30',
      substrateFrequency: '365',
      notes: notes
    };

  } catch (error) {
    console.log(error);
    Alert.alert('Erro', 'Falha ao buscar os dados.');
    return null;
  }
}