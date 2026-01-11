import { Recipe, RecipeDetail } from '../types/recipe';

const BASE_URL = 'https://api.spoonacular.com';

export class SpoonacularService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async findByIngredients(
    ingredients: string[],
    options: { number?: number; ranking?: 1 | 2; ignorePantry?: boolean } = {}
  ): Promise<Recipe[]> {
    if (!this.apiKey) {
      throw new Error('API key is required. Please add your Spoonacular API key in Settings.');
    }

    const params = new URLSearchParams({
      apiKey: this.apiKey,
      ingredients: ingredients.join(','),
      number: (options.number || 10).toString(),
      ranking: (options.ranking || 1).toString(),
      ignorePantry: (options.ignorePantry ?? true).toString(),
    });

    const response = await fetch(`${BASE_URL}/recipes/findByIngredients?${params}`);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Spoonacular API key in Settings.');
      }
      if (response.status === 402) {
        throw new Error('API quota exceeded. Please try again later or upgrade your plan.');
      }
      throw new Error(`Failed to fetch recipes: ${response.statusText}`);
    }

    return response.json();
  }

  async getRecipeDetails(id: number): Promise<RecipeDetail> {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    const params = new URLSearchParams({
      apiKey: this.apiKey,
    });

    const response = await fetch(`${BASE_URL}/recipes/${id}/information?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch recipe details: ${response.statusText}`);
    }

    return response.json();
  }

  async searchRecipes(
    query: string,
    options: {
      number?: number;
      cuisine?: string;
      diet?: string;
      type?: string;
    } = {}
  ): Promise<{ results: Recipe[]; totalResults: number }> {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    const params = new URLSearchParams({
      apiKey: this.apiKey,
      query,
      number: (options.number || 10).toString(),
      addRecipeInformation: 'true',
    });

    if (options.cuisine) params.append('cuisine', options.cuisine);
    if (options.diet) params.append('diet', options.diet);
    if (options.type) params.append('type', options.type);

    const response = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to search recipes: ${response.statusText}`);
    }

    return response.json();
  }
}

// Demo recipes for when no API key is set
export const DEMO_RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Creamy Garlic Pasta',
    image: 'https://spoonacular.com/recipeImages/716429-312x231.jpg',
    usedIngredientCount: 4,
    missedIngredientCount: 2,
    usedIngredients: [
      { id: 1, name: 'pasta', amount: 250, unit: 'g', original: '250g pasta' },
      { id: 2, name: 'garlic', amount: 3, unit: 'cloves', original: '3 cloves garlic' },
      { id: 3, name: 'butter', amount: 50, unit: 'g', original: '50g butter' },
      { id: 4, name: 'cheese', amount: 100, unit: 'g', original: '100g parmesan cheese' },
    ],
    missedIngredients: [
      { id: 5, name: 'heavy cream', amount: 200, unit: 'ml', original: '200ml heavy cream' },
      { id: 6, name: 'parsley', amount: 2, unit: 'tbsp', original: '2 tbsp fresh parsley' },
    ],
    likes: 1205,
  },
  {
    id: 2,
    title: 'Simple Fried Rice',
    image: 'https://spoonacular.com/recipeImages/716426-312x231.jpg',
    usedIngredientCount: 3,
    missedIngredientCount: 3,
    usedIngredients: [
      { id: 1, name: 'rice', amount: 300, unit: 'g', original: '300g cooked rice' },
      { id: 2, name: 'eggs', amount: 2, unit: 'pcs', original: '2 eggs' },
      { id: 3, name: 'carrot', amount: 1, unit: 'pcs', original: '1 carrot, diced' },
    ],
    missedIngredients: [
      { id: 4, name: 'soy sauce', amount: 2, unit: 'tbsp', original: '2 tbsp soy sauce' },
      { id: 5, name: 'green onion', amount: 2, unit: 'pcs', original: '2 green onions' },
      { id: 6, name: 'sesame oil', amount: 1, unit: 'tsp', original: '1 tsp sesame oil' },
    ],
    likes: 892,
  },
  {
    id: 3,
    title: 'Classic Tomato Soup',
    image: 'https://spoonacular.com/recipeImages/715415-312x231.jpg',
    usedIngredientCount: 3,
    missedIngredientCount: 2,
    usedIngredients: [
      { id: 1, name: 'tomato', amount: 6, unit: 'pcs', original: '6 ripe tomatoes' },
      { id: 2, name: 'onion', amount: 1, unit: 'pcs', original: '1 onion' },
      { id: 3, name: 'garlic', amount: 2, unit: 'cloves', original: '2 cloves garlic' },
    ],
    missedIngredients: [
      { id: 4, name: 'vegetable broth', amount: 500, unit: 'ml', original: '500ml vegetable broth' },
      { id: 5, name: 'basil', amount: 1, unit: 'bunch', original: 'fresh basil leaves' },
    ],
    likes: 756,
  },
  {
    id: 4,
    title: 'Chicken Stir Fry',
    image: 'https://spoonacular.com/recipeImages/715594-312x231.jpg',
    usedIngredientCount: 4,
    missedIngredientCount: 2,
    usedIngredients: [
      { id: 1, name: 'chicken breast', amount: 400, unit: 'g', original: '400g chicken breast' },
      { id: 2, name: 'carrot', amount: 2, unit: 'pcs', original: '2 carrots' },
      { id: 3, name: 'onion', amount: 1, unit: 'pcs', original: '1 onion' },
      { id: 4, name: 'garlic', amount: 3, unit: 'cloves', original: '3 cloves garlic' },
    ],
    missedIngredients: [
      { id: 5, name: 'soy sauce', amount: 3, unit: 'tbsp', original: '3 tbsp soy sauce' },
      { id: 6, name: 'ginger', amount: 1, unit: 'inch', original: '1 inch fresh ginger' },
    ],
    likes: 1089,
  },
  {
    id: 5,
    title: 'Vegetable Omelette',
    image: 'https://spoonacular.com/recipeImages/715497-312x231.jpg',
    usedIngredientCount: 4,
    missedIngredientCount: 1,
    usedIngredients: [
      { id: 1, name: 'eggs', amount: 3, unit: 'pcs', original: '3 eggs' },
      { id: 2, name: 'cheese', amount: 50, unit: 'g', original: '50g cheese' },
      { id: 3, name: 'tomato', amount: 1, unit: 'pcs', original: '1 tomato' },
      { id: 4, name: 'butter', amount: 20, unit: 'g', original: '20g butter' },
    ],
    missedIngredients: [
      { id: 5, name: 'chives', amount: 1, unit: 'tbsp', original: '1 tbsp fresh chives' },
    ],
    likes: 634,
  },
];
