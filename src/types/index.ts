
export interface PlantProps {
  id: string;
  name: string;
  species: string;
  waterFrequency: number;
  fertilizerFrequency: number;
  substrateFrequency: number;
  notes: string;
  imageUrl: string;
  createdAt: number;
  userId: string;
  lastWatered?: number;
  lastFertilized?: number;
  lastSubstrate?: number;
}