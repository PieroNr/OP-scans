import React from "react";
import { View, Text, Image } from "react-native";
import ScanScraper from "../components/ScanScraper";
import { primaryColor } from "../hooks/styles";
import HeaderMenu from "../components/HeaderMenu";

const ScansReader = ({ route }) => {
  const { link } = route.params;

  return (
    <View style={styles.container}>
      <HeaderMenu title="Scan" />
      <ScanScraper link={link} />
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: primaryColor,
    height: "100%",
  },
};

export default ScansReader;
