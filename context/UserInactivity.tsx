// app/context/UserInactivityProvider.tsx

import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as SecureStore from "expo-secure-store";

type Props = {
  children: React.ReactNode;
};

export const UserInactivityProvider = ({ children }: Props) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  // Save time when app goes to background
  const recordStartTime = async () => {
    try {
      await SecureStore.setItemAsync("startTime", Date.now().toString());
      console.log("🕒 startTime recorded");
    } catch (error) {
      console.error("Error saving startTime", error);
    }
  };

  // Handle when app becomes active again
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log("📲 App state changed to:", nextAppState);

    if (nextAppState === "background") {
      await recordStartTime();
    } else if (
      nextAppState === "active" &&
      appState.current === "background"
    ) {
      try {
        const savedTime = await SecureStore.getItemAsync("startTime");
        const elapsed = Date.now() - (savedTime ? parseInt(savedTime) : 0);
        console.log("⏱️ Elapsed:", elapsed, "ms");

        if (elapsed > 3000 && isSignedIn) {
          console.log("🔒 Redirecting to lock screen...");
          router.replace("/(authenticated)/(modals)/lock");
        }
      } catch (err) {
        console.error("Error checking elapsed time", err);
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, [isSignedIn]);

  return children;
};

