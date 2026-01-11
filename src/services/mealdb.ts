// TheMealDB - Free recipe API (no API key required)
// https://www.themealdb.com/api.php

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  // Ingredients and measures (1-20)
  [key: string]: string | null;
}

export interface ParsedRecipe {
  id: string;
  title: string;
  image: string;
  category: string;
  area: string;
  instructions: string;
  ingredients: { name: string; measure: string }[];
  youtubeUrl: string | null;
  sourceUrl: string | null;
  tags: string[];
}

function parseRecipe(meal: MealDBRecipe): ParsedRecipe {
  const ingredients: { name: string; measure: string }[] = [];

  // MealDB has strIngredient1-20 and strMeasure1-20
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    area: meal.strArea,
    instructions: meal.strInstructions,
    ingredients,
    youtubeUrl: meal.strYoutube || null,
    sourceUrl: meal.strSource || null,
    tags: meal.strTags ? meal.strTags.split(",").map((t) => t.trim()) : [],
  };
}

export async function searchByIngredient(
  ingredient: string
): Promise<ParsedRecipe[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
    );
    const data = await response.json();

    if (!data.meals) return [];

    // Filter endpoint only returns basic info, need to fetch full details
    const recipes = await Promise.all(
      data.meals.slice(0, 10).map(async (meal: { idMeal: string }) => {
        const details = await getRecipeById(meal.idMeal);
        return details;
      })
    );

    return recipes.filter((r): r is ParsedRecipe => r !== null);
  } catch (error) {
    console.error("Error searching by ingredient:", error);
    return [];
  }
}

export async function searchByName(name: string): Promise<ParsedRecipe[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search.php?s=${encodeURIComponent(name)}`
    );
    const data = await response.json();

    if (!data.meals) return [];

    return data.meals.map(parseRecipe);
  } catch (error) {
    console.error("Error searching by name:", error);
    return [];
  }
}

export async function getRecipeById(id: string): Promise<ParsedRecipe | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();

    if (!data.meals || !data.meals[0]) return null;

    return parseRecipe(data.meals[0]);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
}

export async function getRandomRecipe(): Promise<ParsedRecipe | null> {
  try {
    const response = await fetch(`${BASE_URL}/random.php`);
    const data = await response.json();

    if (!data.meals || !data.meals[0]) return null;

    return parseRecipe(data.meals[0]);
  } catch (error) {
    console.error("Error fetching random recipe:", error);
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/categories.php`);
    const data = await response.json();

    if (!data.categories) return [];

    return data.categories.map((c: { strCategory: string }) => c.strCategory);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getByCategory(category: string): Promise<ParsedRecipe[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
    );
    const data = await response.json();

    if (!data.meals) return [];

    // Only fetch details for first 8 recipes
    const recipes = await Promise.all(
      data.meals.slice(0, 8).map(async (meal: { idMeal: string }) => {
        const details = await getRecipeById(meal.idMeal);
        return details;
      })
    );

    return recipes.filter((r): r is ParsedRecipe => r !== null);
  } catch (error) {
    console.error("Error fetching by category:", error);
    return [];
  }
}

// Ingredient with expiry info for prioritization
export interface IngredientWithExpiry {
  name: string;
  expiresAt?: string;
}

// Search for recipes that match any of the user's ingredients
// Prioritizes recipes that use expiring ingredients
export async function findRecipesByIngredients(
  ingredientNames: string[],
  ingredientsWithExpiry?: IngredientWithExpiry[]
): Promise<
  {
    recipe: ParsedRecipe;
    matchedIngredients: string[];
    missingIngredients: string[];
    expiringMatchCount: number;
  }[]
> {
  if (ingredientNames.length === 0) return [];

  // Build a map of ingredient names to their expiry priority
  // Lower number = expiring sooner = higher priority
  const expiryPriorityMap = new Map<string, number>();
  if (ingredientsWithExpiry) {
    const now = new Date().getTime();
    ingredientsWithExpiry.forEach((ing) => {
      if (ing.expiresAt) {
        const daysUntilExpiry = Math.ceil(
          (new Date(ing.expiresAt).getTime() - now) / (1000 * 60 * 60 * 24)
        );
        // Only prioritize if expiring within 7 days
        if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
          expiryPriorityMap.set(ing.name.toLowerCase(), 7 - daysUntilExpiry); // Higher score = more urgent
        }
      }
    });
  }

  // Prioritize expiring ingredients in search
  const expiringIngredients = ingredientNames.filter((n) =>
    expiryPriorityMap.has(n.toLowerCase())
  );
  const nonExpiringIngredients = ingredientNames.filter(
    (n) => !expiryPriorityMap.has(n.toLowerCase())
  );

  // Search with up to 10 ingredients (expiring first, then others)
  const searchIngredients = [
    ...expiringIngredients,
    ...nonExpiringIngredients,
  ].slice(0, 10);

  const allRecipes: ParsedRecipe[] = [];
  const seenIds = new Set<string>();

  // Search by each ingredient
  for (const ingredient of searchIngredients) {
    const recipes = await searchByIngredient(ingredient);
    for (const recipe of recipes) {
      if (!seenIds.has(recipe.id)) {
        seenIds.add(recipe.id);
        allRecipes.push(recipe);
      }
    }
  }

  // Always get enough random recipes to ensure at least 15 results
  while (allRecipes.length < 15) {
    const random = await getRandomRecipe();
    if (random && !seenIds.has(random.id)) {
      seenIds.add(random.id);
      allRecipes.push(random);
    }
    // Prevent infinite loop if getRandomRecipe fails
    if (allRecipes.length > 30) break;
  }

  // Calculate ingredient matches
  const lowerIngredients = ingredientNames.map((n) => n.toLowerCase());

  const results = allRecipes.map((recipe) => {
    const matched: string[] = [];
    const missing: string[] = [];
    let expiringMatchCount = 0;

    for (const ing of recipe.ingredients) {
      const ingLower = ing.name.toLowerCase();
      const matchedUserIngredient = lowerIngredients.find(
        (userIng) => ingLower.includes(userIng) || userIng.includes(ingLower)
      );

      if (matchedUserIngredient) {
        matched.push(ing.name);
        // Check if this matched ingredient is expiring
        const expiryScore = expiryPriorityMap.get(matchedUserIngredient);
        if (expiryScore !== undefined) {
          expiringMatchCount += expiryScore + 1; // Add weight for expiring ingredients
        }
      } else {
        missing.push(ing.name);
      }
    }

    return {
      recipe,
      matchedIngredients: matched,
      missingIngredients: missing,
      expiringMatchCount,
    };
  });

  // Sort by:
  // 1. Recipes that use expiring ingredients (higher expiringMatchCount first)
  // 2. Then by number of matched ingredients
  results.sort((a, b) => {
    // First prioritize recipes with expiring ingredients
    if (a.expiringMatchCount !== b.expiringMatchCount) {
      return b.expiringMatchCount - a.expiringMatchCount;
    }
    // Then by total matches
    return b.matchedIngredients.length - a.matchedIngredients.length;
  });

  return results.slice(0, 15);
}
