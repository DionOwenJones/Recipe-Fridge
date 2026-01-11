import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Haptic feedback utilities for better UX
// Only triggers on iOS/Android, silently fails on web

export const haptics = {
  // Light tap - for selections, toggles
  light: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },

  // Medium tap - for button presses
  medium: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },

  // Heavy tap - for important actions
  heavy: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },

  // Success feedback - for completed actions
  success: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },

  // Warning feedback - for destructive actions
  warning: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },

  // Error feedback - for failed actions
  error: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },

  // Selection change - for pickers, lists
  selection: () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  },
};
