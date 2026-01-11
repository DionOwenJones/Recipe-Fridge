import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Ingredient } from "../types/ingredient";
import { ShoppingItem } from "../types/shopping";
import {
  saveIngredients,
  loadIngredients,
  saveShoppingList,
  loadShoppingList,
  saveCookedRecipe,
  loadCookedRecipes,
  CookedRecipe,
  saveFavoriteRecipes,
  loadFavoriteRecipes,
  FavoriteRecipe,
  saveSettings,
  loadSettings,
  AppSettings,
} from "../storage";
import {
  scheduleExpiryNotification,
  cancelNotificationForIngredient,
  requestNotificationPermissions,
  scheduleAllExpiryNotifications,
} from "../services/notifications";

interface KitchenContextType {
  // Ingredients
  ingredients: Ingredient[];
  addIngredient: (ingredient: Ingredient) => void;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  removeIngredient: (id: string) => void;
  useIngredients: (usedItems: { name: string; amount: number }[]) => void;

  // Shopping
  shoppingList: ShoppingItem[];
  addToShoppingList: (
    item: Omit<ShoppingItem, "id" | "checked" | "addedAt">
  ) => void;
  toggleShoppingItem: (id: string) => void;
  removeFromShoppingList: (id: string) => void;
  clearCheckedItems: () => void;
  moveToKitchen: (item: ShoppingItem) => void;

  // Cooked recipes
  cookedRecipes: CookedRecipe[];
  addCookedRecipe: (recipe: Omit<CookedRecipe, "cookedAt">) => void;

  // Favorite recipes
  favoriteRecipes: FavoriteRecipe[];
  addFavoriteRecipe: (recipe: Omit<FavoriteRecipe, "savedAt">) => void;
  removeFavoriteRecipe: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // State
  isLoading: boolean;
}

const KitchenContext = createContext<KitchenContextType | null>(null);

export function KitchenProvider({ children }: { children: React.ReactNode }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [cookedRecipes, setCookedRecipes] = useState<CookedRecipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<FavoriteRecipe[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    spoonacularApiKey: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      const [
        loadedIngredients,
        loadedShopping,
        loadedCooked,
        loadedFavorites,
        loadedSettings,
      ] = await Promise.all([
        loadIngredients(),
        loadShoppingList(),
        loadCookedRecipes(),
        loadFavoriteRecipes(),
        loadSettings(),
      ]);

      setIngredients(loadedIngredients);
      setShoppingList(loadedShopping);
      setCookedRecipes(loadedCooked);
      setFavoriteRecipes(loadedFavorites);
      setSettings(loadedSettings);
      setIsLoading(false);

      // Request notification permissions and schedule expiry notifications
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleAllExpiryNotifications(loadedIngredients);
      }
    }
    loadData();
  }, []);

  // Save ingredients when they change
  useEffect(() => {
    if (!isLoading) {
      saveIngredients(ingredients);
    }
  }, [ingredients, isLoading]);

  // Save shopping list when it changes
  useEffect(() => {
    if (!isLoading) {
      saveShoppingList(shoppingList);
    }
  }, [shoppingList, isLoading]);

  // Ingredient functions
  const addIngredient = useCallback((ingredient: Ingredient) => {
    setIngredients((prev) => {
      const existing = prev.find(
        (i) => i.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      if (existing) {
        return prev.map((i) =>
          i.name.toLowerCase() === ingredient.name.toLowerCase()
            ? { ...i, amount: i.amount + ingredient.amount }
            : i
        );
      }
      return [...prev, { ...ingredient, addedAt: new Date().toISOString() }];
    });

    // Schedule expiry notification if ingredient has expiry date
    if (ingredient.expiresAt) {
      scheduleExpiryNotification(ingredient);
    }
  }, []);

  const updateIngredient = useCallback(
    (id: string, updates: Partial<Ingredient>) => {
      setIngredients((prev) => {
        const updated = prev.map((i) =>
          i.id === id ? { ...i, ...updates } : i
        );

        // If expiry date was updated, reschedule notification
        const updatedIngredient = updated.find((i) => i.id === id);
        if (updatedIngredient && updates.expiresAt !== undefined) {
          if (updatedIngredient.expiresAt) {
            scheduleExpiryNotification(updatedIngredient);
          } else {
            cancelNotificationForIngredient(id);
          }
        }

        return updated;
      });
    },
    []
  );

  const removeIngredient = useCallback((id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    // Cancel notification for removed ingredient
    cancelNotificationForIngredient(id);
  }, []);

  const useIngredients = useCallback(
    (usedItems: { name: string; amount: number }[]) => {
      setIngredients((prev) => {
        let updated = [...prev];
        for (const used of usedItems) {
          const idx = updated.findIndex(
            (i) => i.name.toLowerCase() === used.name.toLowerCase()
          );
          if (idx !== -1) {
            const newAmount = updated[idx].amount - used.amount;
            if (newAmount <= 0) {
              updated = updated.filter((_, i) => i !== idx);
            } else {
              updated[idx] = { ...updated[idx], amount: newAmount };
            }
          }
        }
        return updated;
      });
    },
    []
  );

  // Shopping functions
  const addToShoppingList = useCallback(
    (item: Omit<ShoppingItem, "id" | "checked" | "addedAt">) => {
      const newItem: ShoppingItem = {
        ...item,
        id: `shopping-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        checked: false,
        addedAt: new Date().toISOString(),
      };
      setShoppingList((prev) => [...prev, newItem]);
    },
    []
  );

  const toggleShoppingItem = useCallback((id: string) => {
    setShoppingList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const removeFromShoppingList = useCallback((id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCheckedItems = useCallback(() => {
    setShoppingList((prev) => prev.filter((item) => !item.checked));
  }, []);

  const moveToKitchen = useCallback(
    (item: ShoppingItem) => {
      const ingredient: Ingredient = {
        id: `ing-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: item.name,
        category: item.category,
        unit: item.unit,
        amount: item.amount,
        addedAt: new Date().toISOString(),
      };
      addIngredient(ingredient);
      removeFromShoppingList(item.id);
    },
    [addIngredient, removeFromShoppingList]
  );

  // Cooked recipes
  const addCookedRecipe = useCallback(
    async (recipe: Omit<CookedRecipe, "cookedAt">) => {
      const cookedRecipe: CookedRecipe = {
        ...recipe,
        cookedAt: new Date().toISOString(),
      };
      await saveCookedRecipe(cookedRecipe);
      setCookedRecipes((prev) => [cookedRecipe, ...prev].slice(0, 50));
    },
    []
  );

  // Favorite recipes
  const addFavoriteRecipe = useCallback(
    (recipe: Omit<FavoriteRecipe, "savedAt">) => {
      setFavoriteRecipes((prev) => {
        // Don't add if already exists
        if (prev.some((r) => r.id === recipe.id)) return prev;
        const newRecipe: FavoriteRecipe = {
          ...recipe,
          savedAt: new Date().toISOString(),
        };
        const updated = [newRecipe, ...prev];
        saveFavoriteRecipes(updated);
        return updated;
      });
    },
    []
  );

  const removeFavoriteRecipe = useCallback((id: string) => {
    setFavoriteRecipes((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveFavoriteRecipes(updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => {
      return favoriteRecipes.some((r) => r.id === id);
    },
    [favoriteRecipes]
  );

  // Settings
  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  return (
    <KitchenContext.Provider
      value={{
        ingredients,
        addIngredient,
        updateIngredient,
        removeIngredient,
        useIngredients,
        shoppingList,
        addToShoppingList,
        toggleShoppingItem,
        removeFromShoppingList,
        clearCheckedItems,
        moveToKitchen,
        cookedRecipes,
        addCookedRecipe,
        favoriteRecipes,
        addFavoriteRecipe,
        removeFavoriteRecipe,
        isFavorite,
        settings,
        updateSettings,
        isLoading,
      }}
    >
      {children}
    </KitchenContext.Provider>
  );
}

export function useKitchen() {
  const context = useContext(KitchenContext);
  if (!context) {
    throw new Error("useKitchen must be used within a KitchenProvider");
  }
  return context;
}
