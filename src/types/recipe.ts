export interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  usedIngredients: RecipeIngredient[];
  missedIngredients: RecipeIngredient[];
  likes?: number;
}

export interface RecipeIngredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
  image?: string;
}

export interface RecipeDetail extends Recipe {
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  extendedIngredients: ExtendedIngredient[];
  analyzedInstructions: AnalyzedInstruction[];
  sourceUrl?: string;
  spoonacularSourceUrl?: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
}

export interface ExtendedIngredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
  measures: {
    metric: {
      amount: number;
      unitShort: string;
    };
  };
}

export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

export interface InstructionStep {
  number: number;
  step: string;
  ingredients: { id: number; name: string }[];
  equipment: { id: number; name: string }[];
}
