import { StyleSheet } from "react-native";
import ChapterScraper from "../components/ChapterScraper";
import HeaderScan from "../components/HeaderScan";
import { View } from "../components/Themed";
import { ScrollView } from "react-native";
import { primaryColor } from "../hooks/styles";

export default function ScansList() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <HeaderScan />
        <ChapterScraper />
      </ScrollView>

      {/* <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primaryColor,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
