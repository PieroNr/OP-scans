import React, { useState, useEffect } from "react";
import {
  primaryColor,
  secondaryColor,
  colorText,
} from "../hooks/styles";
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
import MenuScan from "./MenuScan";
import { useFonts } from "expo-font";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChapterScraper = () => {
  const [liElements, setLiElements] = useState([]);
  const [filteredLiElements, setFilteredLiElements] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeTab, setActiveTab] = useState(true);
  const [reversedFilteredLiElements, setReversedFilteredLiElements] = useState(
    []
  );
  const [readedChapters, setReadedChapters] = useState([]);
  const [progressChapters, setProgressChapters] = useState([]);

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
        const fetchedLiElements = $("ul.chapters")
          .children("li")
          .map((i, el) => $(el))
          .get();
  
        fetchedLiElements.reverse();
  
        setLiElements(fetchedLiElements);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch readedChapters and progressChapters from AsyncStorage
    const fetchChaptersStatus = async () => {
      try {
        const readedChaptersData = await AsyncStorage.getItem("readedChapters");
        if (readedChaptersData) {
          const readedChaptersArray = JSON.parse(readedChaptersData);
          setReadedChapters(readedChaptersArray);
        } else {
          setReadedChapters([]);
          await AsyncStorage.setItem("readedChapters", JSON.stringify([]));
        }

        const progressChaptersData = await AsyncStorage.getItem(
          "progressChapters"
        );
        if (progressChaptersData) {
          const progressChaptersArray = JSON.parse(progressChaptersData);
          setProgressChapters(progressChaptersArray);
        } else {
          setProgressChapters([]);
          await AsyncStorage.setItem(
            "progressChapters",
            JSON.stringify([])
          );
        }
      } catch (error) {
        console.error("Error fetching chapter statuses:", error);
      }
    };

    fetchChaptersStatus();
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
    GeologicaRegular: require("../assets/fonts/GeologicaRegular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  
  const generateFilters = () => {
    const filters = [];
    const totalItems = liElements.length;
    const numFilters = Math.ceil(totalItems / 200);
    
    for(let i = 0; i < numFilters; i++) {
      const start = i * 200 + 1;
      const end = Math.min((i + 1) * 200, totalItems);
      const filter = `${start} à ${end}`;

      filters.push(
        <TouchableOpacity
          key={i}
          style={[styles.filterButton, activeFilter === filter ? styles.activeFilterButton : null]}
          onPress={() => handleFilterPress(filter)}
        >
          <Text style={styles.filterButtonText}>{filter}</Text>
        </TouchableOpacity>
      );

      
    }

    return filters;
  };

  const handleVariable = (value) => {
    setActiveTab(value);
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
              readedChapters={readedChapters}
              progressChapters={progressChapters}
              setReadedChapters={setReadedChapters}
              setProgressChapters={setProgressChapters}
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
    maxWidth: "100%",
    paddingTop: 0,
    paddingBottom: 0,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: primaryColor,
    marginHorizontal: 5,
    height: 40,
    borderColor: secondaryColor,
    borderWidth: 1,
  },
  activeFilterButton: {
    backgroundColor: secondaryColor,
  },
  filterButtonText: {
    color: colorText,
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
