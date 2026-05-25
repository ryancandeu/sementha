import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#32B768',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return false;
    }
  }

  return true;
}

export async function schedulePlantNotifications(taskCount: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (taskCount === 0) return;

  try {
    const savedTime = await AsyncStorage.getItem('@sementha:notifTime') || '09:00';
    const [hourStr, minuteStr] = savedTime.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const now = new Date();

    const trigger1 = new Date();
    trigger1.setHours(hour, minute, 0, 0);

    if (trigger1 > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Bom dia! 🌱',
          body: `Você tem ${taskCount} planta(s) precisando de cuidados hoje.`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE, 
          date: trigger1,
          channelId: 'default',
        },
      });
    }

    const trigger2 = new Date();
    const urgentHour = Math.min(hour + 3, 23); 
    trigger2.setHours(urgentHour, minute, 0, 0);

    if (trigger2 > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Atenção! 🚨',
          body: 'Suas plantas estão morrendo de sede! Vá regá-las.',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE, 
          date: trigger2,
          channelId: 'default',
        },
      });
    }

    const trigger3 = new Date();
    trigger3.setHours(18, 0, 0, 0);

    if (trigger3 > now && urgentHour < 18) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Última chance do dia! 🌙',
          body: `Não vá dormir sem cuidar das suas ${taskCount} planta(s).`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE, 
          date: trigger3,
          channelId: 'default',
        },
      });
    }

  } catch (error) {
    console.log("Erro ao agendar notificações: ", error);
  }
}