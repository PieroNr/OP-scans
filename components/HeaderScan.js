import React from "react";
import { ScrollView, View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";

const HeaderScan = () => {
  const [loaded] = useFonts({
    GeologicaSemiBold: require("../assets/fonts/GeologicaSemiBold.ttf"),
    GeologicaLight: require("../assets/fonts/GeologicaLight.ttf"),
    GeologicaExtraLight: require("../assets/fonts/GeologicaExtraLight.ttf"),
    GeologicaExtraLight: require("../assets/fonts/GeologicaRegular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.images}
        source={{
          uri: "https://pictures.betaseries.com/fonds/show/571_873811.jpg",
        }}
      />
      <View style={styles.opacity}>
        <LinearGradient
          // Background Linear Gradient
          colors={["transparent", "#1C1C1C"]}
          style={styles.background}
        />
      </View>
      <View style={styles.infos}>
        <Text style={styles.title}>One Piece</Text>
        <Text style={styles.type}>Series</Text>
        <Text style={styles.desc}>
          Gold Roger est le seigneur des pirates. À sa mort, une grande vague de
          piraterie s'abat sur le monde. Ces pirates partent à la recherche du
          One Piece, le fabuleux trésor amassé par Gold Roger durant tout sa
          vie.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infos: {
    paddingLeft: 24,
    paddingRight: 24,
    color: "white",
  },

  opacity: {
    height: 75,
    marginTop: -75,
  },

  background: {
    flex: 1,
    opacity: 0.8,
    backgroundColor: "transparent",
  },

  images: {
    opacity: 0.5,
    height: 400,
  },

  title: {
    paddingTop: 20,
    color: "white",
    fontSize: 20,
    fontFamily: "GeologicaSemiBold",
  },

  type: {
    color: "white",
    fontFamily: "GeologicaLight",
    fontSize: 11,
  },

  desc: {
    color: "white",
    fontFamily: "GeologicaExtraLight",
    fontSize: 12,
    marginTop: 20,
    marginBottom: 40,
  },
});

export default HeaderScan;
