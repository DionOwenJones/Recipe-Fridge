import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ingredient, getExpiryStatus, formatExpiryDate } from '../types/ingredient';
import { colors, borderRadius, shadows, spacing } from '../theme';

interface Props {
  ingredient: Ingredient;
  onPress: () => void;
  onDelete: () => void;
}

export function IngredientCard({ ingredient, onPress, onDelete }: Props) {
  const categoryColor = colors.categories[ingredient.category] || colors.categories.Unknown;
  const expiryStatus = getExpiryStatus(ingredient.expiresAt);

  const formatAmount = (amount: number, unit: string) => {
    if (unit === 'g' && amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}kg`;
    }
    if (unit === 'ml' && amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}L`;
    }
    if (Number.isInteger(amount)) {
      return `${amount}${unit}`;
    }
    return `${amount.toFixed(1)}${unit}`;
  };

  const getExpiryColor = () => {
    switch (expiryStatus) {
      case 'expired':
        return colors.error;
      case 'expiring-soon':
        return colors.warning;
      default:
        return colors.textMuted;
    }
  };

  const isExpired = expiryStatus === 'expired';
  const isExpiringSoon = expiryStatus === 'expiring-soon';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isExpired && styles.containerExpired,
        isExpiringSoon && styles.containerExpiringSoon,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.categoryBar, { backgroundColor: categoryColor }]} />
      <View style={styles.content}>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, isExpired && styles.nameExpired]}>{ingredient.name}</Text>
            {(isExpired || isExpiringSoon) && (
              <Ionicons
                name={isExpired ? 'alert-circle' : 'warning'}
                size={16}
                color={getExpiryColor()}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
          <View style={styles.metaRow}>
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}15` }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {ingredient.category}
              </Text>
            </View>
            {ingredient.expiresAt && (
              <Text style={[styles.expiryText, { color: getExpiryColor() }]}>
                {formatExpiryDate(ingredient.expiresAt)}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={[styles.amount, isExpired && styles.amountExpired]}>
            {formatAmount(ingredient.amount, ingredient.unit)}
          </Text>
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },
  containerExpired: {
    backgroundColor: `${colors.error}08`,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
  },
  containerExpiringSoon: {
    backgroundColor: `${colors.warning}08`,
    borderWidth: 1,
    borderColor: `${colors.warning}30`,
  },
  categoryBar: {
    width: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  nameExpired: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  expiryText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    minWidth: 60,
    textAlign: 'right',
  },
  amountExpired: {
    color: colors.textMuted,
  },
  deleteBtn: {
    padding: spacing.xs,
  },
});
