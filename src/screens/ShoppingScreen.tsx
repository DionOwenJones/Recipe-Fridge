import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useKitchen } from "../context/KitchenContext";
import { ShoppingItem } from "../types/shopping";
import { colors, borderRadius, shadows, spacing, typography } from "../theme";
import { haptics } from "../utils/haptics";

export default function ShoppingScreen() {
  const {
    shoppingList,
    toggleShoppingItem,
    removeFromShoppingList,
    clearCheckedItems,
    moveToKitchen,
  } = useKitchen();

  const [showChecked, setShowChecked] = useState(true);

  const { unchecked, checked } = useMemo(() => {
    const unchecked = shoppingList.filter((item) => !item.checked);
    const checked = shoppingList.filter((item) => item.checked);
    return { unchecked, checked };
  }, [shoppingList]);

  const handleClearChecked = () => {
    if (checked.length === 0) return;

    Alert.alert(
      "Clear checked items?",
      `Remove ${checked.length} checked item${
        checked.length !== 1 ? "s" : ""
      } from the list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearCheckedItems,
        },
      ]
    );
  };

  const handleMoveToKitchen = (item: ShoppingItem) => {
    Alert.alert(
      "Move to Kitchen?",
      `Add ${item.name} to your kitchen inventory?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Move",
          onPress: () => moveToKitchen(item),
        },
      ]
    );
  };

  const formatAmount = (amount: number, unit: string) => {
    if (unit === "g" && amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}kg`;
    }
    if (unit === "ml" && amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}L`;
    }
    return `${amount}${unit}`;
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => {
    const categoryColor =
      colors.categories[item.category] || colors.categories.Unknown;

    return (
      <View style={[styles.itemRow, item.checked && styles.itemRowChecked]}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            haptics.light();
            toggleShoppingItem(item.id);
          }}
        >
          <Ionicons
            name={item.checked ? "checkbox" : "square-outline"}
            size={24}
            color={item.checked ? colors.primary : colors.textMuted}
          />
        </TouchableOpacity>

        <View style={styles.itemInfo}>
          <Text
            style={[styles.itemName, item.checked && styles.itemNameChecked]}
          >
            {item.name}
          </Text>
          <View style={styles.itemMeta}>
            <View
              style={[styles.categoryDot, { backgroundColor: categoryColor }]}
            />
            <Text style={styles.itemCategory}>{item.category}</Text>
          </View>
        </View>

        <Text
          style={[styles.itemAmount, item.checked && styles.itemAmountChecked]}
        >
          {formatAmount(item.amount, item.unit)}
        </Text>

        <View style={styles.itemActions}>
          {item.checked && (
            <TouchableOpacity
              style={styles.moveBtn}
              onPress={() => handleMoveToKitchen(item)}
            >
              <Ionicons name="arrow-forward" size={18} color={colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => removeFromShoppingList(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Shopping List</Text>
          <Text style={styles.subtitle}>
            {unchecked.length} item{unchecked.length !== 1 ? "s" : ""} to buy
          </Text>
        </View>
        {checked.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearChecked}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <Text style={styles.clearBtnText}>Clear ({checked.length})</Text>
          </TouchableOpacity>
        )}
      </View>

      {shoppingList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={80} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Shopping list is empty</Text>
          <Text style={styles.emptySubtitle}>
            Missing ingredients from recipes will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={[...unchecked, ...(showChecked ? checked : [])]}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            checked.length > 0 ? (
              <TouchableOpacity
                style={styles.toggleCheckedBtn}
                onPress={() => setShowChecked(!showChecked)}
              >
                <Ionicons
                  name={showChecked ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.textMuted}
                />
                <Text style={styles.toggleCheckedText}>
                  {showChecked ? "Hide" : "Show"} {checked.length} checked item
                  {checked.length !== 1 ? "s" : ""}
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.error}15`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.error,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  itemRowChecked: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.7,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  itemNameChecked: {
    textDecorationLine: "line-through",
    color: colors.textMuted,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: spacing.xs,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemCategory: {
    fontSize: 12,
    color: colors.textMuted,
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
    marginRight: spacing.md,
  },
  itemAmountChecked: {
    color: colors.textMuted,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  moveBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleCheckedBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    gap: spacing.xs,
  },
  toggleCheckedText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
