import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Ingredient,
  IngredientTemplate,
  INGREDIENT_TEMPLATES,
} from "../types/ingredient";

interface Props {
  onSelect: (ingredient: Ingredient) => void;
  onCancel?: () => void;
}

export default function IngredientDropdown({ onSelect, onCancel }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<IngredientTemplate | null>(null);
  const [amount, setAmount] = useState("");

  const filtered = INGREDIENT_TEMPLATES.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectTemplate = (template: IngredientTemplate) => {
    setSelectedTemplate(template);
    setSearch(template.name);
    setAmount(template.defaultAmount?.toString() || "");
    setOpen(false);
  };

  const handleConfirm = () => {
    if (!selectedTemplate || !amount) return;

    const ingredient: Ingredient = {
      id: `${selectedTemplate.name}-${Date.now()}`,
      name: selectedTemplate.name,
      category: selectedTemplate.category,
      unit: selectedTemplate.unit,
      amount: parseFloat(amount) || 0,
    };

    onSelect(ingredient);
    setSelectedTemplate(null);
    setSearch("");
    setAmount("");
  };

  const handleCancel = () => {
    setSelectedTemplate(null);
    setSearch("");
    setAmount("");
    onCancel?.();
  };

  return (
    <View style={styles.container}>
      {/* Ingredient selector */}
      <TouchableOpacity style={styles.input} onPress={() => setOpen((o) => !o)}>
        <Text style={{ color: search ? "#222" : "#999", fontSize: 16 }}>
          {search || "Select ingredient..."}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#bbb"
        />
      </TouchableOpacity>

      {/* Dropdown menu */}
      {open && (
        <View style={styles.menu}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search ingredients..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          <ScrollView style={styles.scrollList} nestedScrollEnabled>
            {filtered.length === 0 && (
              <Text style={styles.noResult}>No results</Text>
            )}
            {filtered.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.item}
                onPress={() => handleSelectTemplate(item)}
              >
                <Text style={styles.itemText}>
                  {item.name}{" "}
                  <Text style={styles.itemMeta}>
                    ({item.category}, {item.unit})
                  </Text>
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Quantity input - shows after selecting an ingredient */}
      {selectedTemplate && !open && (
        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>
            How much {selectedTemplate.name.toLowerCase()}?
          </Text>
          <View style={styles.quantityRow}>
            <TextInput
              style={styles.quantityInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Amount"
              placeholderTextColor="#999"
              autoFocus
            />
            <Text style={styles.unitText}>{selectedTemplate.unit}</Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                !amount && styles.confirmBtnDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!amount}
            >
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.confirmBtnText}>Add to Kitchen</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
    zIndex: 10,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 2,
    borderWidth: 1,
    borderColor: "#eee",
    maxHeight: 250,
  },
  searchInput: {
    padding: 12,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    color: "#222",
  },
  scrollList: {
    maxHeight: 180,
  },
  item: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  itemText: {
    fontSize: 16,
    color: "#222",
  },
  itemMeta: {
    color: "#888",
    fontSize: 13,
  },
  noResult: {
    color: "#bbb",
    fontSize: 15,
    padding: 14,
    textAlign: "center",
  },
  quantitySection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  quantityLabel: {
    fontSize: 15,
    color: "#666",
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  quantityInput: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  unitText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#64748b",
    fontWeight: "600",
  },
  confirmBtn: {
    flex: 2,
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#2d6cdf",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  confirmBtnDisabled: {
    backgroundColor: "#94a3b8",
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
