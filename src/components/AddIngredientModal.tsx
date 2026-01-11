import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Ingredient, IngredientTemplate, INGREDIENT_TEMPLATES, CATEGORY_DEFAULT_EXPIRY } from '../types/ingredient';
import { colors, borderRadius, shadows, spacing } from '../theme';
import { BarcodeScanner } from './BarcodeScanner';
import { lookupBarcode } from '../services/barcode';
import { haptics } from '../utils/haptics';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (ingredient: Ingredient) => void;
}

export function AddIngredientModal({ visible, onClose, onAdd }: Props) {
  const [step, setStep] = useState<'select' | 'amount' | 'custom'>('select');
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<IngredientTemplate | null>(null);
  const [amount, setAmount] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);

  // Custom ingredient state
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Pantry');
  const [customUnit, setCustomUnit] = useState('pcs');
  const [expiryDays, setExpiryDays] = useState<number | null>(null);

  // Helper to calculate expiry date
  const calculateExpiryDate = (days: number | null): string | undefined => {
    if (days === null || days <= 0) return undefined;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  };

  const filtered = INGREDIENT_TEMPLATES.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, IngredientTemplate[]>);

  const handleSelectTemplate = (template: IngredientTemplate) => {
    haptics.light();
    setSelectedTemplate(template);
    setAmount(template.defaultAmount?.toString() || '');
    // Set default expiry days from template or category defaults
    const defaultDays = template.defaultExpiryDays || CATEGORY_DEFAULT_EXPIRY[template.category] || null;
    setExpiryDays(defaultDays);
    setStep('amount');
  };

  const handleBarcodeScan = async (data: string, type: string) => {
    setShowScanner(false);
    setScanLoading(true);

    try {
      const result = await lookupBarcode(data);

      if (result.found && result.product) {
        const product = result.product as any;
        haptics.success();

        // Set up as custom ingredient with barcode data
        setCustomName(product.name);
        setCustomCategory(product.category || 'Pantry');
        setCustomUnit(product.unit || 'pcs');
        setAmount(product.amount?.toString() || '1');
        setStep('custom');
      } else {
        haptics.warning();
        Alert.alert(
          'Product Not Found',
          'This barcode is not in our database. Would you like to add it manually?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Add Manually',
              onPress: () => {
                setCustomName('');
                setStep('custom');
              },
            },
          ]
        );
      }
    } catch (error) {
      haptics.error();
      Alert.alert('Error', 'Failed to look up barcode. Please try again.');
    } finally {
      setScanLoading(false);
    }
  };

  const handleCustomConfirm = () => {
    if (!customName || !amount) return;

    haptics.success();
    // Use category default expiry if no custom expiry set
    const finalExpiryDays = expiryDays ?? CATEGORY_DEFAULT_EXPIRY[customCategory] ?? null;

    const ingredient: Ingredient = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: customName.trim(),
      category: customCategory,
      unit: customUnit,
      amount: parseFloat(amount) || 1,
      expiresAt: calculateExpiryDate(finalExpiryDays),
    };

    onAdd(ingredient);
    handleClose();
  };

  const handleConfirm = () => {
    if (!selectedTemplate || !amount) return;

    haptics.success();
    const ingredient: Ingredient = {
      id: `${selectedTemplate.name}-${Date.now()}`,
      name: selectedTemplate.name,
      category: selectedTemplate.category,
      unit: selectedTemplate.unit,
      amount: parseFloat(amount) || 0,
      expiresAt: calculateExpiryDate(expiryDays),
    };

    onAdd(ingredient);
    handleClose();
  };

  const handleClose = () => {
    setStep('select');
    setSearch('');
    setSelectedTemplate(null);
    setAmount('');
    setCustomName('');
    setCustomCategory('Pantry');
    setCustomUnit('pcs');
    setExpiryDays(null);
    onClose();
  };

  const handleBack = () => {
    setStep('select');
    setSelectedTemplate(null);
    setAmount('');
    setExpiryDays(null);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          {step !== 'select' ? (
            <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerBtn} />
          )}
          <Text style={styles.headerTitle}>
            {step === 'select' ? 'Add Ingredient' : step === 'custom' ? (customName || 'New Item') : selectedTemplate?.name}
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.headerBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Loading overlay for barcode lookup */}
        {scanLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Looking up product...</Text>
            </View>
          </View>
        )}

        {step === 'select' ? (
          <>
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickActionBtn}
                onPress={() => {
                  haptics.medium();
                  setShowScanner(true);
                }}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.secondaryLight }]}>
                  <MaterialCommunityIcons name="barcode-scan" size={24} color={colors.secondary} />
                </View>
                <Text style={styles.quickActionText}>Scan Barcode</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionBtn}
                onPress={() => {
                  haptics.light();
                  setStep('custom');
                }}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.accentLight }]}>
                  <Ionicons name="create-outline" size={24} color={colors.accent} />
                </View>
                <Text style={styles.quickActionText}>Add Custom</Text>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search ingredients..."
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Ingredient List */}
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {Object.entries(grouped).map(([category, items]) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categorySectionTitle}>{category}</Text>
                  <View style={styles.categoryItems}>
                    {items.map((item) => {
                      const categoryColor =
                        colors.categories[item.category] || colors.categories.Unknown;
                      return (
                        <TouchableOpacity
                          key={item.name}
                          style={styles.ingredientItem}
                          onPress={() => handleSelectTemplate(item)}
                        >
                          <View
                            style={[styles.itemDot, { backgroundColor: categoryColor }]}
                          />
                          <Text style={styles.ingredientName}>{item.name}</Text>
                          <Text style={styles.ingredientUnit}>{item.unit}</Text>
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={colors.textMuted}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          </>
        ) : step === 'amount' ? (
          /* Amount Step for Templates */
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>How much do you have?</Text>
            <View style={styles.amountInputRow}>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                autoFocus
                selectTextOnFocus
              />
              <View style={styles.unitBadge}>
                <Text style={styles.unitText}>{selectedTemplate?.unit}</Text>
              </View>
            </View>

            {/* Quick amounts */}
            <View style={styles.quickAmounts}>
              {getQuickAmounts(selectedTemplate?.unit || '').map((qty) => (
                <TouchableOpacity
                  key={qty}
                  style={[
                    styles.quickBtn,
                    amount === qty.toString() && styles.quickBtnActive,
                  ]}
                  onPress={() => {
                    haptics.selection();
                    setAmount(qty.toString());
                  }}
                >
                  <Text
                    style={[
                      styles.quickBtnText,
                      amount === qty.toString() && styles.quickBtnTextActive,
                    ]}
                  >
                    {qty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Expiry Date Selector */}
            <View style={styles.expirySection}>
              <View style={styles.expirySectionHeader}>
                <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.expirySectionTitle}>Expires in (days)</Text>
              </View>
              <View style={styles.expiryInputRow}>
                <TextInput
                  style={styles.expiryInput}
                  value={expiryDays?.toString() || ''}
                  onChangeText={(text) => {
                    const days = parseInt(text);
                    setExpiryDays(isNaN(days) ? null : days);
                  }}
                  keyboardType="numeric"
                  placeholder="No expiry"
                  placeholderTextColor={colors.textMuted}
                />
                <Text style={styles.expiryHint}>
                  {expiryDays ? `Expires ${new Date(Date.now() + expiryDays * 86400000).toLocaleDateString()}` : 'Optional'}
                </Text>
              </View>
              <View style={styles.expiryPresets}>
                {[3, 7, 14, 30].map((days) => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.expiryPresetBtn,
                      expiryDays === days && styles.expiryPresetBtnActive,
                    ]}
                    onPress={() => {
                      haptics.selection();
                      setExpiryDays(days);
                    }}
                  >
                    <Text
                      style={[
                        styles.expiryPresetText,
                        expiryDays === days && styles.expiryPresetTextActive,
                      ]}
                    >
                      {days}d
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.confirmBtn, !amount && styles.confirmBtnDisabled]}
              onPress={handleConfirm}
              disabled={!amount}
            >
              <Ionicons name="add-circle" size={22} color={colors.textInverse} />
              <Text style={styles.confirmBtnText}>Add to Kitchen</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Custom Ingredient Step */
          <ScrollView style={styles.customContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.customForm}>
              {/* Name Input */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Item Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={customName}
                  onChangeText={setCustomName}
                  placeholder="e.g., Organic Milk"
                  placeholderTextColor={colors.textMuted}
                  autoFocus
                />
              </View>

              {/* Category Selector */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categorySelector}>
                    {CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryChip,
                          customCategory === cat && styles.categoryChipActive,
                          { borderColor: colors.categories[cat] || colors.textMuted },
                        ]}
                        onPress={() => {
                          haptics.selection();
                          setCustomCategory(cat);
                        }}
                      >
                        <View
                          style={[
                            styles.categoryChipDot,
                            { backgroundColor: colors.categories[cat] || colors.textMuted },
                          ]}
                        />
                        <Text
                          style={[
                            styles.categoryChipText,
                            customCategory === cat && styles.categoryChipTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Amount and Unit */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Amount</Text>
                <View style={styles.amountUnitRow}>
                  <TextInput
                    style={styles.formInputSmall}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                  />
                  <View style={styles.unitSelector}>
                    {UNITS.map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        style={[
                          styles.unitChip,
                          customUnit === unit && styles.unitChipActive,
                        ]}
                        onPress={() => {
                          haptics.selection();
                          setCustomUnit(unit);
                        }}
                      >
                        <Text
                          style={[
                            styles.unitChipText,
                            customUnit === unit && styles.unitChipTextActive,
                          ]}
                        >
                          {unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Expiry Date */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Expiry Date</Text>
                <View style={styles.expiryInputRow}>
                  <TextInput
                    style={styles.expiryInput}
                    value={expiryDays?.toString() || ''}
                    onChangeText={(text) => {
                      const days = parseInt(text);
                      setExpiryDays(isNaN(days) ? null : days);
                    }}
                    keyboardType="numeric"
                    placeholder="Days until expiry"
                    placeholderTextColor={colors.textMuted}
                  />
                  <Text style={styles.expiryHint}>
                    {expiryDays ? `${new Date(Date.now() + expiryDays * 86400000).toLocaleDateString()}` : 'Optional'}
                  </Text>
                </View>
                <View style={styles.expiryPresets}>
                  {[3, 7, 14, 30, 90].map((days) => (
                    <TouchableOpacity
                      key={days}
                      style={[
                        styles.expiryPresetBtn,
                        expiryDays === days && styles.expiryPresetBtnActive,
                      ]}
                      onPress={() => {
                        haptics.selection();
                        setExpiryDays(days);
                      }}
                    >
                      <Text
                        style={[
                          styles.expiryPresetText,
                          expiryDays === days && styles.expiryPresetTextActive,
                        ]}
                      >
                        {days}d
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  (!customName || !amount) && styles.confirmBtnDisabled,
                ]}
                onPress={handleCustomConfirm}
                disabled={!customName || !amount}
              >
                <Ionicons name="add-circle" size={22} color={colors.textInverse} />
                <Text style={styles.confirmBtnText}>Add to Kitchen</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* Barcode Scanner */}
        <BarcodeScanner
          visible={showScanner}
          onClose={() => setShowScanner(false)}
          onScan={handleBarcodeScan}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const CATEGORIES = ['Dairy', 'Meat', 'Protein', 'Seafood', 'Vegetable', 'Fruit', 'Grain', 'Pantry', 'Beverage', 'Frozen', 'Snack'];
const UNITS = ['g', 'ml', 'pcs', 'kg', 'L', 'oz', 'lb'];

function getQuickAmounts(unit: string): number[] {
  switch (unit) {
    case 'g':
      return [100, 250, 500, 1000];
    case 'kg':
      return [0.5, 1, 2, 5];
    case 'ml':
      return [100, 250, 500, 1000];
    case 'L':
      return [0.5, 1, 2, 3];
    case 'pcs':
      return [1, 2, 4, 6];
    case 'oz':
      return [4, 8, 16, 32];
    case 'lb':
      return [0.5, 1, 2, 5];
    default:
      return [1, 2, 5, 10];
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    fontSize: 16,
    color: colors.textPrimary,
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  categorySection: {
    marginBottom: spacing.lg,
  },
  categorySectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryItems: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  ingredientUnit: {
    fontSize: 14,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
  amountContainer: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  amountInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    fontSize: 48,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    minWidth: 180,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.md,
  },
  unitBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginLeft: spacing.md,
  },
  unitText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  quickBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickBtnText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  quickBtnTextActive: {
    color: colors.textInverse,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  confirmBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  confirmBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textInverse,
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  loadingBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.lg,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  // Custom form
  customContainer: {
    flex: 1,
  },
  customForm: {
    padding: spacing.xl,
  },
  formGroup: {
    marginBottom: spacing.xl,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formInputSmall: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    width: 100,
    textAlign: 'center',
  },
  categorySelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: colors.primaryLight,
  },
  categoryChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  amountUnitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  unitSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: spacing.xs,
  },
  unitChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  unitChipTextActive: {
    color: colors.textInverse,
  },
  // Expiry section
  expirySection: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  expirySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  expirySectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  expiryInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  expiryInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    width: 80,
    textAlign: 'center',
  },
  expiryHint: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
  expiryPresets: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  expiryPresetBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expiryPresetBtnActive: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  expiryPresetText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  expiryPresetTextActive: {
    color: colors.textInverse,
    fontWeight: '600',
  },
});
