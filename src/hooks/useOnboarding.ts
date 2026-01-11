import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "@recipe_fridge_onboarding_shown";

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setShowOnboarding(val !== "true");
      setLoading(false);
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  }, []);

  const resetOnboarding = useCallback(() => {
    AsyncStorage.removeItem(ONBOARDING_KEY);
    setShowOnboarding(true);
  }, []);

  return { showOnboarding, completeOnboarding, resetOnboarding, loading };
}
