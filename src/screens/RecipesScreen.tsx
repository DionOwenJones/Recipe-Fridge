import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, shadows } from "../theme";
import { useKitchen } from "../context/KitchenContext";
import { findRecipesByIngredients } from "../services/mealdb";
import { RecipeCard } from "../components/RecipeCard";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";

export default function RecipesScreen({
  onShowHelp,
}: {
  onShowHelp?: () => void;
}) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { ingredients } = useKitchen();

  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Auto-fetch recipes when kitchen changes and not empty
  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes([]);
      setHasFetched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setHasFetched(true);
    const fetchRecipes = async () => {
      try {
        const ingredientNames = ingredients.map((i) => i.name);
        const withExpiry = ingredients.map((i) => ({
          name: i.name,
          expiresAt: i.expiresAt,
        }));
        const results = await findRecipesByIngredients(
          ingredientNames,
          withExpiry
        );
        setRecipes(results);
      } catch (e) {
        setError("Failed to fetch recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ingredients)]);

  // Manual refresh
  const handleGenerate = () => {
    if (ingredients.length > 0) {
      setHasFetched(false);
      setTimeout(() => setHasFetched(true), 10); // retrigger useEffect
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Recipes</Text>
          {ingredients.length > 0 && (
            <TouchableOpacity
              style={styles.generateBtn}
              onPress={handleGenerate}
              activeOpacity={0.85}
            >
              <Ionicons name="refresh" size={18} color={colors.textInverse} />
              <Text style={styles.generateBtnText}>Refresh</Text>
            </TouchableOpacity>
          )}
          {onShowHelp && (
            <TouchableOpacity
              onPress={onShowHelp}
              style={styles.helpBtn}
              accessibilityLabel="Show help"
            >
              <Ionicons
                name="help-circle-outline"
                size={28}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Kitchen ingredients pill row */}
        {ingredients.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsContainer}
            style={{ marginBottom: spacing.md }}
          >
            {ingredients.map((ingredient) => {
              const color =
                colors.categories[ingredient.category] ||
                colors.categories.Unknown;
              return (
                <View
                  key={ingredient.id}
                  style={[styles.pill, { backgroundColor: `${color}20` }]}
                >
                  <View style={[styles.pillDot, { backgroundColor: color }]} />
                  <Text style={[styles.pillText, { color }]}>
                    {ingredient.name}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
        {ingredients.length === 0 ? (
          <View style={styles.emptyPromptCompact}>
            <MaterialCommunityIcons
              name="fridge-outline"
              size={40}
              color={colors.textMuted}
            />
            <Text style={styles.emptyTitleCompact}>
              Nothing in your kitchen yet...
            </Text>
            <Text style={styles.emptySubtitleCompact}>
              Add some ingredients to see recipe ideas!
            </Text>
          </View>
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Finding recipes for you...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : recipes.length > 0 ? (
          <View style={styles.listContent}>
            {recipes.map((r, idx) => {
              const recipeObj = {
                id: r.recipe.id,
                title: r.recipe.title,
                image: r.recipe.image,
                usedIngredientCount: r.matchedIngredients.length,
                missedIngredientCount: r.missingIngredients.length,
                usedIngredients: r.matchedIngredients.map((name: string) => ({
                  id: 0,
                  name,
                  amount: 0,
                  unit: "",
                  original: name,
                })),
                missedIngredients: r.missingIngredients.map((name: string) => ({
                  id: 0,
                  name,
                  amount: 0,
                  unit: "",
                  original: name,
                })),
              };
              return (
                <RecipeCard
                  key={r.recipe.id + "-" + idx}
                  recipe={recipeObj}
                  onPress={() =>
                    navigation.navigate("RecipeDetail", { recipe: recipeObj })
                  }
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyPromptCompact}>
            <MaterialCommunityIcons
              name="chef-hat"
              size={40}
              color={colors.textMuted}
            />
            <Text style={styles.emptyTitleCompact}>No recipes found</Text>
            <Text style={styles.emptySubtitleCompact}>
              Try adding more ingredients to your kitchen or try again.
            </Text>
          </View>
        )}
        {/* ...existing code... */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pillsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    ...shadows.md,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textInverse,
    marginLeft: 4,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.lg,
    color: colors.textMuted,
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    marginTop: spacing.xl,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  emptyPrompt: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  emptyPromptCompact: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyTitleCompact: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: 2,
  },
  emptySubtitleCompact: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  helpBtn: {
    marginLeft: 12,
    padding: 4,
  },
});
