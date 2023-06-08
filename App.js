import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useLoadedAssets } from "./hooks/useLoadedAssets";
import Navigation from "./navigation/Navigation";
import ScansList from "./screens/Scans-list";
import { useColorScheme } from "react-native";
import React, { useEffect } from "react";
import { loadFonts } from "./hooks/styles";

export default function App() {
  useEffect(() => {
    loadFonts();
  }, []);

  const isLoadingComplete = useLoadedAssets();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
