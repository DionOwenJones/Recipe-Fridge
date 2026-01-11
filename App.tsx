import React from "react";
import { StatusBar } from "expo-status-bar";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { KitchenProvider } from "./src/context/KitchenContext";
import AppNavigator from "./src/navigation/AppNavigator";
import KeyboardDismissView from "./src/components/KeyboardDismissView";

export default function App() {
  return (
    <SafeAreaProvider>
      <KitchenProvider>
        <StatusBar style="dark" />
        <KeyboardDismissView>
          <AppNavigator />
        </KeyboardDismissView>
      </KitchenProvider>
    </SafeAreaProvider>
  );
}
