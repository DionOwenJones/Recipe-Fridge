import * as React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import KitchenScreen from "../screens/KitchenScreen";
import RecipesScreen from "../screens/RecipesScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import ShoppingScreen from "../screens/ShoppingScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { CustomTabBar } from "../components/CustomTabBar";
import { TabParamList, RootStackParamList } from "./types";
import { colors } from "../theme";

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator({ onShowHelp }: { onShowHelp?: () => void }) {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home">
          {(props) => <HomeScreen {...props} onShowHelp={onShowHelp} />}
        </Tab.Screen>
        <Tab.Screen name="Kitchen">
          {(props) => <KitchenScreen {...props} onShowHelp={onShowHelp} />}
        </Tab.Screen>
        <Tab.Screen name="Recipes">
          {(props) => <RecipesScreen {...props} onShowHelp={onShowHelp} />}
        </Tab.Screen>
        <Tab.Screen name="Shopping">
          {(props) => <ShoppingScreen {...props} onShowHelp={onShowHelp} />}
        </Tab.Screen>
        <Tab.Screen name="Settings">
          {(props) => <SettingsScreen {...props} onShowHelp={onShowHelp} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

export default function AppNavigator({
  onShowHelp,
}: {
  onShowHelp?: () => void;
}) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Main">
          {() => <TabNavigator onShowHelp={onShowHelp} />}
        </Stack.Screen>
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
