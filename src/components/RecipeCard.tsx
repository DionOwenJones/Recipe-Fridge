import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../types/recipe';
import { colors, borderRadius, shadows, spacing } from '../theme';

interface Props {
  recipe: Recipe;
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: Props) {
  const totalIngredients = recipe.usedIngredientCount + recipe.missedIngredientCount;
  const matchPercentage = Math.round((recipe.usedIngredientCount / totalIngredients) * 100);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: recipe.image }} style={styles.image} />

      {/* Match Badge */}
      <View style={[
        styles.matchBadge,
        matchPercentage >= 80 ? styles.matchBadgeHigh :
        matchPercentage >= 50 ? styles.matchBadgeMedium : styles.matchBadgeLow
      ]}>
        <Text style={styles.matchText}>{matchPercentage}% match</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>

        <View style={styles.ingredientInfo}>
          <View style={styles.ingredientRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.ingredientText}>
              {recipe.usedIngredientCount} ingredient{recipe.usedIngredientCount !== 1 ? 's' : ''} you have
            </Text>
          </View>
          {recipe.missedIngredientCount > 0 && (
            <View style={styles.ingredientRow}>
              <Ionicons name="cart-outline" size={16} color={colors.warning} />
              <Text style={[styles.ingredientText, { color: colors.warning }]}>
                {recipe.missedIngredientCount} to buy
              </Text>
            </View>
          )}
        </View>

        {recipe.likes && (
          <View style={styles.likesRow}>
            <Ionicons name="heart" size={14} color={colors.error} />
            <Text style={styles.likesText}>{recipe.likes.toLocaleString()}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.surfaceAlt,
  },
  matchBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  matchBadgeHigh: {
    backgroundColor: colors.success,
  },
  matchBadgeMedium: {
    backgroundColor: colors.warning,
  },
  matchBadgeLow: {
    backgroundColor: colors.error,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textInverse,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  ingredientInfo: {
    gap: spacing.xs,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ingredientText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  likesText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
