import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Chapter from "../models/Chapter";

const ChapterButton = ({ item, link }) => {
  const navigation = useNavigation();

  const numberRegex = /One Piece (\d+)/;
  const numberMatch = item.match(numberRegex);
  const number = numberMatch ? numberMatch[1] : "";

  const titleRegex = /:\s*(.*)/;
  const titleMatch = item.match(titleRegex);
  let title = titleMatch ? titleMatch[1] : "";

  const lines = item.split("\n");
  let dateChapter = "";
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() !== "") {
      dateChapter = lines[i];
      break;
    }
  }

  if (title == dateChapter) {
    title = "";
  }

  const chapter = new Chapter(number, title, dateChapter, link);

  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={() => navigation.navigate("Lecteur", { link: chapter.link })}
    >
      <Text style={styles.buttonText}>
        {chapter.number} : {chapter.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "transparent",
    borderColor: "#0C7700",
    borderWidth: 1,
    padding: 17,
    paddingLeft: 24,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "400",
    fontSize: 12,
    textAlign: "left",
  },
});

export default ChapterButton;
