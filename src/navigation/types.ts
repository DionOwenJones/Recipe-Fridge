import { NavigatorScreenParams } from '@react-navigation/native';
import { Recipe } from '../types/recipe';

export type TabParamList = {
  Home: undefined;
  Kitchen: undefined;
  Recipes: undefined;
  Shopping: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  RecipeDetail: { recipe: Recipe };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
