import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KitchenProvider } from "./src/context/KitchenContext";
import AppNavigator from "./src/navigation/AppNavigator";
import KeyboardDismissView from "./src/components/KeyboardDismissView";
import OnboardingModal from "./src/components/OnboardingModal";
import { useOnboarding } from "./src/hooks/useOnboarding";

export default function App() {
  const [forceShow, setForceShow] = useState(false);
  const { showOnboarding, completeOnboarding, loading, resetOnboarding } =
    useOnboarding();

  // Provide a way to trigger onboarding from anywhere (help button will use setForceShow)
  const showModal = !loading && (showOnboarding || forceShow);
  const handleClose = () => {
    if (showOnboarding) completeOnboarding();
    setForceShow(false);
  };

  return (
    <SafeAreaProvider>
      <KitchenProvider>
        <StatusBar style="dark" />
        <KeyboardDismissView>
          <AppNavigator onShowHelp={() => setForceShow(true)} />
        </KeyboardDismissView>
        <OnboardingModal visible={showModal} onClose={handleClose} />
      </KitchenProvider>
    </SafeAreaProvider>
  );
}
