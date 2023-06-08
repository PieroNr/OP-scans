import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HeaderMenu = (props) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackPress}>
        <Image
          style={styles.images}
          source={require("../assets/images/arrow_back.png")}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    top: 60,
    left: 24,
    zIndex: 100,
  },
  images: {
    width: 16,
    height: 29,
  },
  title: {
    color: "white",
    fontFamily: "GeologicaRegular",
  },
});

export default HeaderMenu;
