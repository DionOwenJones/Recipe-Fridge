import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ingredient } from '../types/ingredient';
import { colors, borderRadius, shadows, spacing } from '../theme';

interface Props {
  ingredient: Ingredient | null;
  visible: boolean;
  onClose: () => void;
  onSave: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export function EditIngredientModal({
  ingredient,
  visible,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (ingredient) {
      setAmount(ingredient.amount.toString());
    }
  }, [ingredient]);

  const handleSave = () => {
    if (!ingredient) return;
    const newAmount = parseFloat(amount);
    if (newAmount <= 0) {
      onDelete(ingredient.id);
    } else {
      onSave(ingredient.id, newAmount);
    }
    onClose();
  };

  const handleDelete = () => {
    if (ingredient) {
      onDelete(ingredient.id);
      onClose();
    }
  };

  if (!ingredient) return null;

  const categoryColor = colors.categories[ingredient.category] || colors.categories.Unknown;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
            <Text style={styles.title}>{ingredient.name}</Text>
          </View>

          {/* Amount Input */}
          <Text style={styles.label}>Quantity</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              selectTextOnFocus
              autoFocus
            />
            <View style={styles.unitBadge}>
              <Text style={styles.unitText}>{ingredient.unit}</Text>
            </View>
          </View>

          <Text style={styles.hint}>Set to 0 to remove from kitchen</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>

            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 360,
    ...shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  unitBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginLeft: spacing.md,
  },
  unitText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.xs,
  },
  deleteBtnText: {
    fontSize: 15,
    color: colors.error,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textInverse,
  },
});
