import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const PAGES = [
  {
    title: "Welcome to Recipe Fridge!",
    body: "Track your kitchen, discover recipes, and reduce food waste.",
  },
  {
    title: "How It Works",
    body: "Add items to your kitchen manually or by scanning barcodes.",
  },
  {
    title: "Find Recipes",
    body: "See recipes you can make with what you have, or explore new ideas.",
  },
  {
    title: "Shopping List",
    body: "Add missing ingredients to your shopping list with a tap.",
  },
  {
    title: "Get Started!",
    body: "You're ready to use Recipe Fridge. Add your first ingredient!",
  },
];

export default function OnboardingModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const next = () => {
    if (page < PAGES.length - 1) setPage(page + 1);
    else onClose();
  };
  const prev = () => {
    if (page > 0) setPage(page - 1);
  };
  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.fullscreenOverlay}>
        <View style={styles.logoContainer}>
          {/* Replace with your logo image if available */}
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>🥕</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.bigTitle}>{PAGES[page].title}</Text>
          <Text style={styles.bigBody}>{PAGES[page].body}</Text>
        </View>
        <View style={styles.controlsRow}>
          {page > 0 && (
            <TouchableOpacity
              onPress={prev}
              style={[styles.button, styles.secondaryButton]}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Back
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={next} style={styles.button}>
            <Text style={styles.buttonText}>
              {page === PAGES.length - 1 ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: "#f7fafc",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0f2f1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  bigTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  bigBody: {
    fontSize: 18,
    color: "#444",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
    lineHeight: 26,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 16,
    gap: 12,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginHorizontal: 4,
    minWidth: 110,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  secondaryButton: {
    backgroundColor: "#e0e0e0",
  },
  secondaryButtonText: {
    color: "#333",
  },
});
