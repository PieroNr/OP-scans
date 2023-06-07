import React from "react";
import { View, Text, Image } from "react-native";
import ScanScraper from "../components/ScanScraper";

const ScansReader = ({ route }) => {
  const { link } = route.params;

  return (
    <View style={styles.container}>
      <ScanScraper link={link} />
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: "#1C1C1C",
    height: "100%",
  },
};

export default ScansReader;
