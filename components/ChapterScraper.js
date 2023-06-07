import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import cheerio from "cheerio";
import ChapterButton from "./ChapterButton";
import Carousel from "react-native-snap-carousel";
import MenuScan from "./MenuScan";
import { useFonts } from "expo-font";

const ChapterScraper = () => {
  const [liElements, setLiElements] = useState([]);
  const [filteredLiElements, setFilteredLiElements] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeTab, setActiveTab] = useState(true);
  const [reversedFilteredLiElements, setReversedFilteredLiElements] = useState(
    []
  );

  useEffect(() => {
    // Mettre à jour reversedFilteredLiElements seulement lorsque filteredLiElements change
    setReversedFilteredLiElements(filteredLiElements.reverse());
  }, [filteredLiElements]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://www.scan-vf.net/one_piece");
        const html = response.data;
        const $ = cheerio.load(html);
        const liElements = $("ul.chapters")
          .children("li")
          .map((i, el) => $(el))
          .get();

        liElements.reverse();

        setLiElements(liElements);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply the filter when the activeFilter changes
    if (activeFilter) {
      const [start, end] = activeFilter.split(" à ");
      const filteredElements = liElements.filter((liElement, index) => {
        const liNumber = index + 1;
        return liNumber >= parseInt(start, 10) && liNumber <= parseInt(end, 10);
      });
      const filteredTexts = filteredElements.map((liElement) => liElement);
      setFilteredLiElements(filteredTexts);
    } else {
      const allTexts = liElements.map((liElement) => liElement);
      setFilteredLiElements(allTexts);
    }
  }, [activeFilter, liElements]);

  const handleFilterPress = (filter) => {
    setActiveFilter(filter);
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

  const generateFilters = () => {
    const filters = [];
    const totalItems = liElements.length;
    const numFilters = Math.ceil(totalItems / 200);

    for (let i = 0; i < numFilters; i++) {
      const start = i * 200 + 1;
      const end = Math.min((i + 1) * 200, totalItems);
      const filterText = `${start} à ${end}`;

      filters.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.filterButton,
            activeFilter === filterText ? styles.activeFilterButton : null,
          ]}
          onPress={() => handleFilterPress(filterText)}
        >
          <Text style={styles.filterButtonText}>{filterText}</Text>
        </TouchableOpacity>
      );
    }

    return filters;
  };

  const handleVariable = (value) => {
    // Faites quelque chose avec la variable
    setActiveTab(value);
    console.log(value);
  };

  return (
    <View style={styles.container}>
      <MenuScan onVariable={handleVariable} />
      {activeTab ? (
        <View style={styles.itemContainer}>
          {reversedFilteredLiElements.map((item, index) => (
            <ChapterButton
              key={index}
              item={item.text()}
              link={item.find("a").attr("href")}
            />
          ))}
        </View>
      ) : (
        <View style={styles.filterList}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.filterContainer}
            showsHorizontalScrollIndicator={false}
            styles={styles.scrollView}
          >
            {generateFilters()}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#1C1C1C",
    marginHorizontal: 5,
    height: 40,
    borderColor: "#0C7700",
    borderWidth: 1,
  },
  activeFilterButton: {
    backgroundColor: "#0C7700",
  },
  filterButtonText: {
    color: "white",
    fontFamily: "GeologicaSemiBold",
  },
  itemContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  liText: {
    marginBottom: 10,
  },
  filterList: {
    height: 50,
  },
});

export default ChapterScraper;
