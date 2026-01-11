export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  amount: number;
  addedAt?: string;
  expiresAt?: string;
}

export interface IngredientTemplate {
  name: string;
  category: string;
  unit: string;
  defaultAmount?: number;
  defaultExpiryDays?: number; // Default days until expiry
}

// Default expiry days by category
export const CATEGORY_DEFAULT_EXPIRY: Record<string, number> = {
  Dairy: 7,
  Meat: 3,
  Protein: 14,
  Seafood: 2,
  Vegetable: 7,
  Fruit: 7,
  Grain: 180,
  Pantry: 365,
  Beverage: 14,
  Frozen: 90,
  Snack: 30,
};

export const INGREDIENT_TEMPLATES: IngredientTemplate[] = [
  {
    name: "Milk",
    category: "Dairy",
    unit: "L",
    defaultAmount: 1,
    defaultExpiryDays: 7,
  },
  // More fruits
  {
    name: "Strawberries",
    category: "Fruit",
    unit: "g",
    defaultAmount: 250,
    defaultExpiryDays: 5,
  },
  // ...existing unique items above...
  // Add back unique, realistic items (no duplicates)
  // ...existing code above...
  // Removed duplicate ingredient templates by name. Only the first occurrence of each name is kept.
  {
    name: "Tortilla",
    category: "Grain",
    unit: "pcs",
    defaultAmount: 8,
    defaultExpiryDays: 10,
  },
  {
    name: "Naan Bread",
    category: "Grain",
    unit: "pcs",
    defaultAmount: 2,
    defaultExpiryDays: 7,
  },
  {
    name: "Soy Sauce",
    category: "Pantry",
    unit: "ml",
    defaultAmount: 250,
    defaultExpiryDays: 365,
  },
  {
    name: "Peanut Butter",
    category: "Pantry",
    unit: "g",
    defaultAmount: 350,
    defaultExpiryDays: 180,
  },
  {
    name: "Ketchup",
    category: "Pantry",
    unit: "ml",
    defaultAmount: 500,
    defaultExpiryDays: 180,
  },
  {
    name: "Mayonnaise",
    category: "Pantry",
    unit: "ml",
    defaultAmount: 250,
    defaultExpiryDays: 90,
  },
  {
    name: "Sriracha",
    category: "Pantry",
    unit: "ml",
    defaultAmount: 200,
    defaultExpiryDays: 180,
  },
  {
    name: "Honey",
    category: "Pantry",
    unit: "g",
    defaultAmount: 250,
    defaultExpiryDays: 365,
  },
  {
    name: "Miso Paste",
    category: "Pantry",
    unit: "g",
    defaultAmount: 200,
    defaultExpiryDays: 180,
  },
  // More beverages
  {
    name: "Oat Milk",
    category: "Beverage",
    unit: "L",
    defaultAmount: 1,
    defaultExpiryDays: 7,
  },
  {
    name: "Coca-Cola",
    category: "Beverage",
    unit: "ml",
    defaultAmount: 330,
    defaultExpiryDays: 180,
  },
  {
    name: "Red Wine",
    category: "Beverage",
    unit: "ml",
    defaultAmount: 750,
    defaultExpiryDays: 365,
  },
  // More snacks
  {
    name: "Granola Bar",
    category: "Snack",
    unit: "pcs",
    defaultAmount: 6,
    defaultExpiryDays: 90,
  },
  {
    name: "Pretzels",
    category: "Snack",
    unit: "g",
    defaultAmount: 100,
    defaultExpiryDays: 60,
  },
  {
    name: "Popcorn",
    category: "Snack",
    unit: "g",
    defaultAmount: 100,
    defaultExpiryDays: 90,
  },
  // International/ethnic
  {
    name: "Tofu",
    category: "Protein",
    unit: "g",
    defaultAmount: 400,
    defaultExpiryDays: 7,
  },
  {
    name: "Kimchi",
    category: "Pantry",
    unit: "g",
    defaultAmount: 300,
    defaultExpiryDays: 30,
  },
  {
    name: "Curry Paste",
    category: "Pantry",
    unit: "g",
    defaultAmount: 100,
    defaultExpiryDays: 90,
  },
  {
    name: "Tzatziki",
    category: "Dairy",
    unit: "g",
    defaultAmount: 200,
    defaultExpiryDays: 7,
  },
  {
    name: "Hummus",
    category: "Pantry",
    unit: "g",
    defaultAmount: 200,
    defaultExpiryDays: 7,
  },
  {
    name: "Pita Bread",
    category: "Grain",
    unit: "pcs",
    defaultAmount: 4,
    defaultExpiryDays: 7,
  },
  {
    name: "Sourdough Starter",
    category: "Pantry",
    unit: "g",
    defaultAmount: 100,
    defaultExpiryDays: 14,
  },
  {
    name: "Ground Beef",
    category: "Meat",
    unit: "g",
    defaultAmount: 500,
    defaultExpiryDays: 2,
  },
  {
    name: "Bacon",
    category: "Meat",
    unit: "g",
    defaultAmount: 200,
    defaultExpiryDays: 7,
  },
  {
    name: "Salmon Fillet",
    category: "Seafood",
    unit: "g",
    defaultAmount: 300,
    defaultExpiryDays: 2,
  },
  {
    name: "Pork Chops",
    category: "Meat",
    unit: "g",
    defaultAmount: 400,
    defaultExpiryDays: 3,
  },
  {
    name: "Ham",
    category: "Meat",
    unit: "g",
    defaultAmount: 200,
    defaultExpiryDays: 7,
  },
  {
    name: "Shrimp",
    category: "Seafood",
    unit: "g",
    defaultAmount: 250,
    defaultExpiryDays: 2,
  },
  {
    name: "Broccoli",
    category: "Vegetable",
    unit: "pcs",
    defaultAmount: 1,
    defaultExpiryDays: 7,
  },
  {
    name: "Carrot",
    category: "Vegetable",
    unit: "pcs",
    defaultAmount: 5,
    defaultExpiryDays: 21,
  },
  {
    name: "Tomato",
    category: "Vegetable",
    unit: "pcs",
    defaultAmount: 3,
    defaultExpiryDays: 7,
  },
  {
    name: "Onion",
    category: "Vegetable",
    unit: "pcs",
    defaultAmount: 2,
    defaultExpiryDays: 30,
  },
  {
    name: "Garlic",
    category: "Vegetable",
    unit: "pcs",
    defaultAmount: 1,
    defaultExpiryDays: 60,
  },
  {
    name: "Potato",
    category: "Vegetable",
    unit: "kg",
    defaultAmount: 1,
    defaultExpiryDays: 30,
  },
  {
    name: "Apple",
    category: "Fruit",
    unit: "pcs",
    defaultAmount: 4,
    defaultExpiryDays: 14,
  },
  {
    name: "Banana",
    category: "Fruit",
    unit: "pcs",
    defaultAmount: 6,
    defaultExpiryDays: 7,
  },
  {
    name: "Orange",
    category: "Fruit",
    unit: "pcs",
    defaultAmount: 4,
    defaultExpiryDays: 14,
  },
  {
    name: "Rice",
    category: "Grain",
    unit: "kg",
    defaultAmount: 1,
    defaultExpiryDays: 365,
  },
  {
    name: "Pasta",
    category: "Grain",
    unit: "g",
    defaultAmount: 500,
    defaultExpiryDays: 365,
  },
  {
    name: "Bread",
    category: "Grain",
    unit: "pcs",
    defaultAmount: 1,
    defaultExpiryDays: 5,
  },
  {
    name: "Flour",
    category: "Pantry",
    unit: "kg",
    defaultAmount: 1,
    defaultExpiryDays: 180,
  },
  { name: "Sugar", category: "Pantry", unit: "g", defaultAmount: 500 },
  { name: "Salt", category: "Pantry", unit: "g", defaultAmount: 500 },
  { name: "Pepper", category: "Pantry", unit: "g", defaultAmount: 50 },
  {
    name: "Olive Oil",
    category: "Pantry",
    unit: "ml",
    defaultAmount: 500,
    defaultExpiryDays: 365,
  },
  {
    name: "Canola Oil",
    category: "Pantry",
    unit: "ml",
    defaultAmount: 500,
    defaultExpiryDays: 365,
  },
  {
    name: "Canned Tuna",
    category: "Pantry",
    unit: "g",
    defaultAmount: 185,
    defaultExpiryDays: 365,
  },
  {
    name: "Black Beans",
    category: "Pantry",
    unit: "g",
    defaultAmount: 400,
    defaultExpiryDays: 365,
  },
  {
    name: "Chickpeas",
    category: "Pantry",
    unit: "g",
    defaultAmount: 400,
    defaultExpiryDays: 365,
  },
  {
    name: "Corn",
    category: "Pantry",
    unit: "g",
    defaultAmount: 300,
    defaultExpiryDays: 365,
  },
  {
    name: "Frozen Peas",
    category: "Frozen",
    unit: "g",
    defaultAmount: 400,
    defaultExpiryDays: 180,
  },
  {
    name: "Frozen Pizza",
    category: "Frozen",
    unit: "pcs",
    defaultAmount: 1,
    defaultExpiryDays: 90,
  },
  {
    name: "Ice Cream",
    category: "Frozen",
    unit: "ml",
    defaultAmount: 500,
    defaultExpiryDays: 90,
  },
  {
    name: "Orange Juice",
    category: "Beverage",
    unit: "ml",
    defaultAmount: 1000,
    defaultExpiryDays: 7,
  },
  {
    name: "Coffee",
    category: "Beverage",
    unit: "g",
    defaultAmount: 250,
    defaultExpiryDays: 180,
  },
  {
    name: "Tea",
    category: "Beverage",
    unit: "g",
    defaultAmount: 100,
    defaultExpiryDays: 180,
  },
  {
    name: "Chocolate Bar",
    category: "Snack",
    unit: "g",
    defaultAmount: 100,
    defaultExpiryDays: 180,
  },
  {
    name: "Potato Chips",
    category: "Snack",
    unit: "g",
    defaultAmount: 150,
    defaultExpiryDays: 60,
  },
];

// Helper function to calculate expiry status
export type ExpiryStatus = "fresh" | "expiring-soon" | "expired" | "no-expiry";

export function getExpiryStatus(expiresAt?: string): ExpiryStatus {
  if (!expiresAt) return "no-expiry";

  const now = new Date();
  const expiry = new Date(expiresAt);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= 3) return "expiring-soon";
  return "fresh";
}

export function getDaysUntilExpiry(expiresAt?: string): number | null {
  if (!expiresAt) return null;

  const now = new Date();
  const expiry = new Date(expiresAt);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatExpiryDate(expiresAt?: string): string {
  if (!expiresAt) return "No expiry";

  const days = getDaysUntilExpiry(expiresAt);
  if (days === null) return "No expiry";

  if (days < 0)
    return `Expired ${Math.abs(days)} day${
      Math.abs(days) !== 1 ? "s" : ""
    } ago`;
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  if (days <= 7) return `Expires in ${days} days`;

  return new Date(expiresAt).toLocaleDateString();
}
