import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { colors, shadows, spacing } from '../theme';
import { haptics } from '../utils/haptics';

const TAB_CONFIG: Record<string, { lib: 'feather' | 'material' | 'ionicons'; name: string; label: string }> = {
  Home: { lib: 'feather', name: 'home', label: 'Home' },
  Kitchen: { lib: 'material', name: 'fridge-outline', label: 'Kitchen' },
  Recipes: { lib: 'material', name: 'chef-hat', label: 'Recipes' },
  Shopping: { lib: 'feather', name: 'shopping-cart', label: 'Shop' },
  Settings: { lib: 'ionicons', name: 'settings-outline', label: 'Settings' },
};

function TabIcon({ name, lib, color, size }: { name: string; lib: string; color: string; size: number }) {
  if (lib === 'feather') {
    return <Feather name={name as any} size={size} color={color} />;
  } else if (lib === 'material') {
    return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
  } else {
    return <Ionicons name={name as any} size={size} color={color} />;
  }
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              haptics.light();
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <View style={[styles.tabContent, isFocused && styles.tabContentActive]}>
                <TabIcon
                  name={config.name}
                  lib={config.lib}
                  size={22}
                  color={isFocused ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? colors.primary : colors.textMuted },
                    isFocused && styles.tabLabelActive,
                  ]}
                >
                  {config.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    ...shadows.lg,
    shadowOpacity: 0.12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    minWidth: 56,
  },
  tabContentActive: {
    backgroundColor: colors.primaryLight,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: '600',
  },
});
