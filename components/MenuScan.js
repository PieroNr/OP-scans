import React, { useState, useRef } from "react";
import { useFonts } from "expo-font";
import { secondaryColor, colorText } from "../hooks/styles";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

const App = (props) => {
  const [activeTab, setActiveTab] = useState("filtres");
  const animationValue = useRef(new Animated.Value(1)).current;
  const animationValueChap = useRef(new Animated.Value(0)).current;

  const handleClick = (value) => {
    // Appeler la fonction de rappel avec la variable en tant qu'argument
    props.onVariable(value);
    console.log(value);
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === "chapitre") {
      startAnimation(1);
      startAnimationChap(0);
    } else {
      startAnimation(0);
      startAnimationChap(1);
    }
  };

  const [loaded] = useFonts({
    GeologicaSemiBold: require("../assets/fonts/GeologicaSemiBold.ttf"),
    GeologicaLight: require("../assets/fonts/GeologicaLight.ttf"),
    GeologicaExtraLight: require("../assets/fonts/GeologicaExtraLight.ttf"),
    GeologicaExtraLight: require("../assets/fonts/GeologicaRegular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const startAnimation = (value) => {
    Animated.timing(animationValue, {
      toValue: value,
      duration: 500, // Durée de l'animation en millisecondes
      useNativeDriver: false,
    }).start();
  };

  const startAnimationChap = (value) => {
    Animated.timing(animationValueChap, {
      toValue: value,
      duration: 500, // Durée de l'animation en millisecondes
      useNativeDriver: false,
    }).start();
  };

  const tabUnderlineWidth = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const tabUnderlineWidthChap = animationValueChap.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "chapitre" && styles.activeTab]}
        onPress={() => {
          handleTabPress("chapitre");
          handleClick(true);
        }}
      >
        <Text style={styles.tabText}>Chapitres</Text>
        <Animated.View
          style={[styles.tabUnderline, { width: tabUnderlineWidth }]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "filters" && styles.activeTab]}
        onPress={() => {
          handleTabPress("filters");
          handleClick(false);
        }}
      >
        <Text style={styles.tabText}>Filters</Text>
        <Animated.View
          style={[styles.tabUnderline, { width: tabUnderlineWidthChap }]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 13,
    gap: 15,
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 0,
    paddingBottom: 5,
    position: "relative",
  },
  activeTab: {
    borderBottomColor: secondaryColor, // Couleur du soulignement actif
  },
  tabText: {
    fontSize: 14,
    fontFamily: "GeologicaSemiBold",
    color: colorText,
    textTransform: "uppercase",
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 1,
    backgroundColor: secondaryColor, // Couleur du soulignement
  },
});

export default App;
