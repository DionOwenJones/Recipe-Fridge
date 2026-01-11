import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useKitchen } from "../context/KitchenContext";
import { Ingredient } from "../types/ingredient";
import { IngredientCard } from "../components/IngredientCard";
import { AddIngredientModal } from "../components/AddIngredientModal";
import { colors, spacing, borderRadius, shadows } from "../theme";

export default function KitchenScreen({
  onShowHelp,
}: {
  onShowHelp?: () => void;
}) {
  const { ingredients, addIngredient, removeIngredient } = useKitchen();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);

  // Pills for categories summary
  const categorySummary = (() => {
    const map: Record<string, number> = {};
    ingredients.forEach((i) => {
      map[i.category] = (map[i.category] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  })();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>My Kitchen</Text>
            <Text style={styles.subtitle}>
              Track what you have and what’s expiring soon
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

        {/* Pills summary */}
        {ingredients.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsContainer}
            keyboardShouldPersistTaps="handled"
          >
            {categorySummary.map(([cat, count]) => {
              const color = colors.categories[cat] || colors.categories.Unknown;
              return (
                <View
                  key={cat}
                  style={[styles.pill, { backgroundColor: `${color}20` }]}
                >
                  <View style={[styles.pillDot, { backgroundColor: color }]} />
                  <Text style={[styles.pillText, { color }]}>{cat}</Text>
                  <Text style={styles.pillCount}>({count})</Text>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Section header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setAddModalVisible(true)}
            accessibilityLabel="Add ingredient"
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={22} color={colors.textInverse} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Ingredient list or empty state */}
        {ingredients.length > 0 ? (
          <View style={styles.listContent}>
            {ingredients.map((item) => (
              <IngredientCard
                key={item.id}
                ingredient={item}
                onPress={() => setSelectedIngredient(item)}
                onDelete={() => removeIngredient(item.id)}
              />
            ))}
          </View>
        ) : (
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
              Start by adding some ingredients to track your kitchen
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => setAddModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color={colors.textInverse} />
              <Text style={styles.emptyBtnText}>Add Ingredients</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <AddIngredientModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={addIngredient}
      />
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
  helpBtn: {
    marginLeft: 12,
    padding: 4,
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
  pillCount: {
    fontSize: 13,
    color: colors.textMuted,
    marginLeft: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    ...shadows.md,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textInverse,
    marginLeft: 4,
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
