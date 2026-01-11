import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient } from '../types/ingredient';
import { ShoppingItem } from '../types/shopping';

const KEYS = {
  INGREDIENTS: '@recipe_fridge_ingredients',
  SHOPPING_LIST: '@recipe_fridge_shopping',
  COOKED_RECIPES: '@recipe_fridge_cooked',
  FAVORITE_RECIPES: '@recipe_fridge_favorites',
  SETTINGS: '@recipe_fridge_settings',
};

// Ingredients Storage
export async function saveIngredients(ingredients: Ingredient[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.INGREDIENTS, JSON.stringify(ingredients));
  } catch (error) {
    console.error('Failed to save ingredients:', error);
  }
}

export async function loadIngredients(): Promise<Ingredient[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.INGREDIENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load ingredients:', error);
    return [];
  }
}

// Shopping List Storage
export async function saveShoppingList(items: ShoppingItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SHOPPING_LIST, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save shopping list:', error);
  }
}

export async function loadShoppingList(): Promise<ShoppingItem[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.SHOPPING_LIST);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load shopping list:', error);
    return [];
  }
}

// Cooked Recipes History
export interface CookedRecipe {
  id: number;
  title: string;
  image: string;
  cookedAt: string;
}

export async function saveCookedRecipe(recipe: CookedRecipe): Promise<void> {
  try {
    const existing = await loadCookedRecipes();
    const updated = [recipe, ...existing].slice(0, 50); // Keep last 50
    await AsyncStorage.setItem(KEYS.COOKED_RECIPES, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save cooked recipe:', error);
  }
}

export async function loadCookedRecipes(): Promise<CookedRecipe[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.COOKED_RECIPES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load cooked recipes:', error);
    return [];
  }
}

// Favorite Recipes
export interface FavoriteRecipe {
  id: string;
  title: string;
  image: string;
  category: string;
  area: string;
  savedAt: string;
}

export async function saveFavoriteRecipes(recipes: FavoriteRecipe[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.FAVORITE_RECIPES, JSON.stringify(recipes));
  } catch (error) {
    console.error('Failed to save favorite recipes:', error);
  }
}

export async function loadFavoriteRecipes(): Promise<FavoriteRecipe[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.FAVORITE_RECIPES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load favorite recipes:', error);
    return [];
  }
}

// Settings
export interface AppSettings {
  spoonacularApiKey: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  spoonacularApiKey: '',
};

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// Clear all data
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}
