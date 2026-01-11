import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useKitchen } from "../context/KitchenContext";
import { clearAllData } from "../storage";
import { colors, borderRadius, shadows, spacing, typography } from "../theme";

export default function SettingsScreen() {
  const { settings, updateSettings, ingredients, shoppingList, cookedRecipes } =
    useKitchen();

  const [apiKey, setApiKey] = useState(settings.spoonacularApiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveApiKey = () => {
    updateSettings({ spoonacularApiKey: apiKey.trim() });
    Alert.alert("Saved", "API key has been saved.");
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data?",
      "This will delete all your ingredients, shopping list, and history. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            Alert.alert(
              "Done",
              "All data has been cleared. Please restart the app."
            );
          },
        },
      ]
    );
  };

  const openSpoonacularSignup = () => {
    Linking.openURL("https://spoonacular.com/food-api/console#Dashboard");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* API Key Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spoonacular API</Text>
          <View style={styles.card}>
            <Text style={styles.cardDescription}>
              Add your Spoonacular API key to access thousands of recipes. Get a
              free key at spoonacular.com.
            </Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="Enter API key..."
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showApiKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowApiKey(!showApiKey)}
              >
                <Ionicons
                  name={showApiKey ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.linkBtn}
                onPress={openSpoonacularSignup}
              >
                <Ionicons
                  name="open-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text style={styles.linkBtnText}>Get Free API Key</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveApiKey}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>

            {settings.spoonacularApiKey ? (
              <View style={styles.statusRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.success}
                />
                <Text style={styles.statusText}>API key configured</Text>
              </View>
            ) : (
              <View style={styles.statusRow}>
                <Ionicons
                  name="information-circle"
                  size={16}
                  color={colors.warning}
                />
                <Text style={styles.statusText}>Using demo recipes only</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Data</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{ingredients.length}</Text>
                <Text style={styles.statLabel}>Ingredients</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{shoppingList.length}</Text>
                <Text style={styles.statLabel}>Shopping Items</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{cookedRecipes.length}</Text>
                <Text style={styles.statLabel}>Recipes Cooked</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.dangerBtn}
              onPress={handleClearData}
            >
              <Ionicons name="trash" size={20} color={colors.error} />
              <Text style={styles.dangerBtnText}>Clear All Data</Text>
            </TouchableOpacity>
            <Text style={styles.dangerHint}>
              This will delete all ingredients, shopping lists, and cooking
              history.
            </Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>App Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Built with</Text>
              <Text style={styles.aboutValue}>React Native + Expo</Text>
            </View>
          </View>
        </View>

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
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    padding: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  eyeBtn: {
    padding: spacing.md,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  linkBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  linkBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  saveBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textInverse,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statusText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: `${colors.error}15`,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  dangerBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.error,
  },
  dangerHint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  aboutLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  aboutValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
});
