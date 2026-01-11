import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Ingredient, getExpiryStatus, getDaysUntilExpiry } from '../types/ingredient';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request permission for notifications
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get notification permissions');
    return false;
  }

  // Set notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('expiry-alerts', {
      name: 'Expiry Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B6B',
    });
  }

  return true;
}

// Schedule notification for expiring ingredient
export async function scheduleExpiryNotification(ingredient: Ingredient): Promise<string | null> {
  if (!ingredient.expiresAt) return null;

  const daysUntil = getDaysUntilExpiry(ingredient.expiresAt);
  if (daysUntil === null || daysUntil < 0) return null;

  // Cancel any existing notification for this ingredient
  await cancelNotificationForIngredient(ingredient.id);

  // Schedule notification for 1 day before expiry, at 9 AM
  const notifyDate = new Date(ingredient.expiresAt);
  notifyDate.setDate(notifyDate.getDate() - 1);
  notifyDate.setHours(9, 0, 0, 0);

  // If notification date is in the past, schedule for tomorrow 9 AM
  if (notifyDate.getTime() < Date.now()) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    notifyDate.setTime(tomorrow.getTime());
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Ingredient Expiring Soon!',
        body: `${ingredient.name} will expire tomorrow. Consider using it in a recipe!`,
        data: { ingredientId: ingredient.id, type: 'expiry-warning' },
        sound: true,
      },
      trigger: {
        date: notifyDate,
        channelId: Platform.OS === 'android' ? 'expiry-alerts' : undefined,
      } as any,
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

// Cancel notification for specific ingredient
export async function cancelNotificationForIngredient(ingredientId: string): Promise<void> {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduledNotifications) {
    if (notification.content.data?.ingredientId === ingredientId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

// Cancel all expiry notifications
export async function cancelAllExpiryNotifications(): Promise<void> {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduledNotifications) {
    if (notification.content.data?.type === 'expiry-warning') {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

// Check and schedule notifications for all expiring ingredients
export async function scheduleAllExpiryNotifications(ingredients: Ingredient[]): Promise<void> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  // Cancel all existing expiry notifications first
  await cancelAllExpiryNotifications();

  // Schedule new notifications for ingredients expiring soon
  for (const ingredient of ingredients) {
    const status = getExpiryStatus(ingredient.expiresAt);
    if (status === 'expiring-soon' || status === 'fresh') {
      const days = getDaysUntilExpiry(ingredient.expiresAt);
      // Only schedule if expiring within 7 days
      if (days !== null && days >= 0 && days <= 7) {
        await scheduleExpiryNotification(ingredient);
      }
    }
  }
}

// Get list of expiring ingredients (for display)
export function getExpiringIngredients(ingredients: Ingredient[]): Ingredient[] {
  return ingredients
    .filter((ing) => {
      const status = getExpiryStatus(ing.expiresAt);
      return status === 'expiring-soon' || status === 'expired';
    })
    .sort((a, b) => {
      const daysA = getDaysUntilExpiry(a.expiresAt) ?? Infinity;
      const daysB = getDaysUntilExpiry(b.expiresAt) ?? Infinity;
      return daysA - daysB;
    });
}

// Send immediate notification for testing
export async function sendTestNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Test Notification',
      body: 'Expiry notifications are working!',
      sound: true,
    },
    trigger: null, // Immediate
  });
}
