import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useKitchen } from "../context/KitchenContext";
import { RootStackParamList } from "../navigation/types";
import { colors, borderRadius, shadows, spacing, typography } from "../theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen({
  onShowHelp,
}: {
  onShowHelp?: () => void;
}) {
  const navigation = useNavigation<NavigationProp>();
  const { ingredients, shoppingList, cookedRecipes } = useKitchen();

  const recentRecipes = cookedRecipes.slice(0, 3);

  const navigateTo = (
    screen: "Kitchen" | "Recipes" | "Shopping" | "Settings"
  ) => {
    navigation.navigate("Main", { screen });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Chef!</Text>
            <Text style={styles.subtitle}>
              What would you like to cook today?
            </Text>
          </View>
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

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigateTo("Kitchen")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <MaterialCommunityIcons
                name="fridge-outline"
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={styles.statValue}>{ingredients.length}</Text>
            <Text style={styles.statLabel}>In Kitchen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigateTo("Shopping")}
            activeOpacity={0.7}
          >
            <View
              style={[styles.statIcon, { backgroundColor: colors.accentLight }]}
            >
              <Ionicons name="cart-outline" size={24} color={colors.accent} />
            </View>
            <Text style={styles.statValue}>
              {shoppingList.filter((i) => !i.checked).length}
            </Text>
            <Text style={styles.statLabel}>To Buy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigateTo("Recipes")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.secondaryLight },
              ]}
            >
              <MaterialCommunityIcons
                name="chef-hat"
                size={24}
                color={colors.secondary}
              />
            </View>
            <Text style={styles.statValue}>{cookedRecipes.length}</Text>
            <Text style={styles.statLabel}>Cooked</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigateTo("Recipes")}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: colors.secondaryLight },
                ]}
              >
                <MaterialCommunityIcons
                  name="chef-hat"
                  size={26}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.actionTitle}>Find Recipes</Text>
              <Text style={styles.actionSubtitle}>
                Based on {ingredients.length} ingredients
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigateTo("Kitchen")}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Ionicons name="add-circle" size={26} color={colors.primary} />
              </View>
              <Text style={styles.actionTitle}>Add Items</Text>
              <Text style={styles.actionSubtitle}>Update your kitchen</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Kitchen */}
        {ingredients.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Kitchen</Text>
              <TouchableOpacity onPress={() => navigateTo("Kitchen")}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ingredientPillsContainer}
            >
              {ingredients.slice(0, 8).map((ingredient) => {
                const categoryColor =
                  colors.categories[ingredient.category] ||
                  colors.categories.Unknown;
                return (
                  <View
                    key={ingredient.id}
                    style={[
                      styles.ingredientPill,
                      { backgroundColor: `${categoryColor}20` },
                    ]}
                  >
                    <View
                      style={[
                        styles.ingredientDot,
                        { backgroundColor: categoryColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.ingredientPillText,
                        { color: categoryColor },
                      ]}
                    >
                      {ingredient.name}
                    </Text>
                  </View>
                );
              })}
              {ingredients.length > 8 && (
                <TouchableOpacity
                  style={styles.morePill}
                  onPress={() => navigateTo("Kitchen")}
                >
                  <Text style={styles.morePillText}>
                    +{ingredients.length - 8} more
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        {/* Recently Cooked */}
        {recentRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Cooked</Text>
            {recentRecipes.map((recipe) => (
              <View
                key={`${recipe.id}-${recipe.cookedAt}`}
                style={styles.recentRecipeCard}
              >
                <Image
                  source={{ uri: recipe.image }}
                  style={styles.recentRecipeImage}
                />
                <View style={styles.recentRecipeInfo}>
                  <Text style={styles.recentRecipeTitle} numberOfLines={1}>
                    {recipe.title}
                  </Text>
                  <Text style={styles.recentRecipeDate}>
                    {new Date(recipe.cookedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textMuted}
                />
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {ingredients.length === 0 && (
          <View style={styles.emptyPrompt}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons
                name="fridge-outline"
                size={64}
                color={colors.textMuted}
              />
            </View>
            <Text style={styles.emptyTitle}>Your kitchen is empty</Text>
            <Text style={styles.emptySubtitle}>
              Start by adding some ingredients to find recipes
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigateTo("Kitchen")}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color={colors.textInverse} />
              <Text style={styles.emptyBtnText}>Add Ingredients</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: "center",
    ...shadows.md,
  },
  statIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.md,
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  ingredientPillsContainer: {
    paddingRight: spacing.xl,
  },
  ingredientPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ingredientPillText: {
    fontSize: 14,
    fontWeight: "600",
  },
  morePill: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  morePillText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  recentRecipeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  recentRecipeImage: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
  },
  recentRecipeInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  recentRecipeTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  recentRecipeDate: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
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
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  emptyBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textInverse,
  },
});
