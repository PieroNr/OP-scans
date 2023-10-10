import React from "react";
import { View, Text, Image } from "react-native";
import ScanScraper from "../components/ScanScraper";
import { primaryColor } from "../hooks/styles";

const ScansReader = ({ route }) => {
  console.log(route.params);
  const { link, handleSlideChange, currentSlide, totalSlides } = route.params;


  return (
    <View style={styles.container}>
      <ScanScraper link={link} handleSlideChange={handleSlideChange}/>
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
