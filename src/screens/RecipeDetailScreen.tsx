import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useKitchen } from '../context/KitchenContext';
import { Recipe } from '../types/recipe';
import { colors, borderRadius, shadows, spacing, typography } from '../theme';

export default function RecipeDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipe } = route.params as { recipe: Recipe };
  const { ingredients, useIngredients, addToShoppingList, addCookedRecipe } = useKitchen();

  const [servings, setServings] = useState(1);

  // Check which ingredients user has
  const checkIngredientAvailability = () => {
    const available: { name: string; have: boolean; recipeAmount: number; unit: string }[] = [];

    recipe.usedIngredients.forEach((ing) => {
      const userHas = ingredients.find(
        (i) => i.name.toLowerCase().includes(ing.name.toLowerCase()) ||
               ing.name.toLowerCase().includes(i.name.toLowerCase())
      );
      available.push({
        name: ing.name,
        have: !!userHas,
        recipeAmount: ing.amount * servings,
        unit: ing.unit,
      });
    });

    recipe.missedIngredients.forEach((ing) => {
      available.push({
        name: ing.name,
        have: false,
        recipeAmount: ing.amount * servings,
        unit: ing.unit,
      });
    });

    return available;
  };

  const ingredientStatus = checkIngredientAvailability();
  const canCook = recipe.missedIngredientCount === 0;

  const handleCook = () => {
    Alert.alert(
      'Cook this recipe?',
      `This will deduct the ingredients from your kitchen for ${servings} serving${servings > 1 ? 's' : ''}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Cook',
          onPress: () => {
            // Deduct ingredients from kitchen
            const toUse = recipe.usedIngredients.map((ing) => ({
              name: ing.name,
              amount: ing.amount * servings,
            }));
            useIngredients(toUse);

            // Record cooked recipe
            addCookedRecipe({
              id: recipe.id,
              title: recipe.title,
              image: recipe.image,
            });

            Alert.alert(
              'Enjoy your meal!',
              'Ingredients have been deducted from your kitchen.',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleAddToShopping = () => {
    const missing = recipe.missedIngredients;
    missing.forEach((ing) => {
      addToShoppingList({
        name: ing.name,
        category: 'Pantry',
        unit: ing.unit || 'pcs',
        amount: ing.amount * servings,
      });
    });

    Alert.alert(
      'Added to Shopping List',
      `${missing.length} item${missing.length !== 1 ? 's' : ''} added to your shopping list.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>{recipe.title}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.statText}>
              {recipe.usedIngredientCount} ingredients you have
            </Text>
          </View>
          {recipe.missedIngredientCount > 0 && (
            <View style={styles.stat}>
              <Ionicons name="cart" size={20} color={colors.warning} />
              <Text style={[styles.statText, { color: colors.warning }]}>
                {recipe.missedIngredientCount} to buy
              </Text>
            </View>
          )}
        </View>

        {/* Servings */}
        <View style={styles.servingsRow}>
          <Text style={styles.servingsLabel}>Servings</Text>
          <View style={styles.servingsControls}>
            <TouchableOpacity
              style={styles.servingBtn}
              onPress={() => setServings(Math.max(1, servings - 1))}
            >
              <Ionicons name="remove" size={20} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.servingsValue}>{servings}</Text>
            <TouchableOpacity
              style={styles.servingBtn}
              onPress={() => setServings(servings + 1)}
            >
              <Ionicons name="add" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsList}>
          {ingredientStatus.map((ing, index) => (
            <View key={index} style={styles.ingredientRow}>
              <Ionicons
                name={ing.have ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={ing.have ? colors.success : colors.error}
              />
              <Text style={styles.ingredientName}>{ing.name}</Text>
              <Text style={styles.ingredientAmount}>
                {ing.recipeAmount} {ing.unit}
              </Text>
            </View>
          ))}
        </View>

        {/* Missing ingredients shopping */}
        {recipe.missedIngredientCount > 0 && (
          <TouchableOpacity
            style={styles.addShoppingBtn}
            onPress={handleAddToShopping}
          >
            <Ionicons name="cart-outline" size={20} color={colors.warning} />
            <Text style={styles.addShoppingBtnText}>
              Add {recipe.missedIngredientCount} missing item{recipe.missedIngredientCount !== 1 ? 's' : ''} to shopping list
            </Text>
          </TouchableOpacity>
        )}

        {/* Cook Button */}
        <TouchableOpacity
          style={[styles.cookBtn, !canCook && styles.cookBtnDisabled]}
          onPress={handleCook}
          disabled={!canCook}
        >
          <MaterialCommunityIcons
            name="chef-hat"
            size={24}
            color={colors.textInverse}
          />
          <Text style={styles.cookBtnText}>
            {canCook ? 'Cook This Recipe' : 'Missing Ingredients'}
          </Text>
        </TouchableOpacity>

        {!canCook && (
          <Text style={styles.cookHint}>
            Add the missing ingredients to your kitchen or shopping list first
          </Text>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: colors.surfaceAlt,
  },
  backBtn: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  servingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  servingsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  servingsControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  servingBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 30,
    textAlign: 'center',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  ingredientsList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
  },
  ingredientName: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  ingredientAmount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  addShoppingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.warning}15`,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  addShoppingBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.warning,
  },
  cookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  cookBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  cookBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textInverse,
  },
  cookHint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
