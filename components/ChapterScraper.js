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
import { CheckBox } from '@rneui/themed';
import axios from "axios";
import cheerio from "cheerio";
import ChapterButton from "./ChapterButton";
import MenuScan from "./MenuScan";
import { useFonts } from "expo-font";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from "@expo/vector-icons";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Skeleton } from '@rneui/themed';
import { is } from "css-select";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../constants/Colors";
import { set } from "react-native-reanimated";


const ChapterScraper = () => {
  const [liElements, setLiElements] = useState([]);
  const [filteredLiElements, setFilteredLiElements] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filters, setFilters] = useState([]);
  const [activeTab, setActiveTab] = useState(true);
  const [reversedFilteredLiElements, setReversedFilteredLiElements] = useState(
    []
  );
  const [readedChapters, setReadedChapters] = useState([]);
  const [progressChapters, setProgressChapters] = useState([]);
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const [downloadActivate, setDownloadActivate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
      
    };
  
    fetchData();
  }, []);

  useEffect(() => {

    fetchChaptersStatus();

    
  }, []);
  

  

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

  const handleFilterPress = (filter) => {
    setActiveFilter(filter);
    renderTheComponent();
  };
  useEffect(() => {
    if (activeFilter) {
      const [start, end] = activeFilter.split(" à ");
      const filteredElements = liElements.filter((liElement, index) => {
        const liNumber = index + 1;
        return liNumber >= parseInt(start, 10) && liNumber <= parseInt(end, 10);
      });
      const filteredTexts = filteredElements.map((liElement) => liElement);
      setFilteredLiElements(filteredTexts);
    } else {
      if (liElements.length !== 0) {
        const numFilters = Math.ceil(liElements.length / 200);
        setActiveFilter(`${(numFilters-1)*200+1} à ${liElements.length}`);
        

    
      }
      const allTexts = liElements.map((liElement) => liElement);
      setFilteredLiElements(allTexts);
    }
  }, [activeFilter, liElements]);

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
    return filters.reverse();
  };

  const downloadChapter = async (link) => {
      setDownloadActivate(true);
      let currentPage = 1;
      let hasMoreImages = true;
      let generateHTML = "<html><body><style>img {width: 100%; height: 100%; object-fit: contain; overflow: hidden;} .imgContainer{width: 100%; height: 100%;} *{margin: 0;}</style><div>";
      while (hasMoreImages) {
        try {
          const response = await axios.get(`${link}/${currentPage}`);

          const html = response.data;
          const $ = cheerio.load(html);
          const scanImages = $("img.scan-page");

          if (scanImages.length > 0) {
            scanImages.each(async (index, element) => {
              generateHTML += `<div class="imgContainer"><img src="${$(element).attr("src").trimStart().trimEnd()}"/></div>`;
              
            });
            currentPage++;
            //setIsLoading(false);
          } else {
            hasMoreImages = false;
            generateHTML += "</div></body></html>";
          }
        } catch (error) {
          console.error(error);
          hasMoreImages = false;
        }
      }
      const pdf = await Print.printToFileAsync({ html: generateHTML });
      const { uri } = pdf;
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf', dialogTitle: 'Partager le chapitre' });
      setDownloadActivate(false);
      return uri;

  }

  const generateChapterButtons = () => {
    const chapterButtons = [];
    reversedFilteredLiElements.forEach((item, index) => {
      chapterButtons.push(
        <View
            key={index}
            style={styles.chapterButtonContainer}
          >
            <ChapterButton
              
              key={index}
              item={item.text()}
              link={item.find("a").attr("href")}
              readedChapters={readedChapters}
              progressChapters={progressChapters}
              setReadedChapters={setReadedChapters}
              setProgressChapters={setProgressChapters}
              downloadEnabled={downloadEnabled}
              downloadChapter={downloadChapter}
              downloadActivate={downloadActivate}
            />
            
            </View>
      );
    });
    return chapterButtons;
  }

  const renderTheComponent = () => {
    setActiveTab(false);
    setInterval(() => {
      setActiveTab(true);
    }
    , 0);
  }


  const handleVariable = (value) => {
    setActiveTab(value);
  };

  
  
  return (
    <View style={styles.container}>
      <MenuScan onVariable={handleVariable} />
      <View style={styles.filterList}>
        {isLoading && (
          <View style={{ flexDirection: 'row'}} >
            {[...Array(4).keys()].map((index) => (
              <Skeleton
                LinearGradientComponent={() => (
                  <LinearGradient colors={['#343434', '#5A5A5A', '#343434']} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                )}
                
                animation="wave"
                width="30%"
                height={40}
                style={{ marginHorizontal: 5, backgroundColor: "#343434", borderRadius: 0 }}
              />
            ))}
          </View>
        )}
          <ScrollView
            horizontal
            contentContainerStyle={styles.filterContainer}
            showsHorizontalScrollIndicator={false}
            styles={styles.scrollView}
          >
            
            {generateFilters()}
          </ScrollView>
        </View>
      <CheckBox
           containerStyle={styles.checkbox}
           checked={downloadEnabled}
           onPress={() => setDownloadEnabled(!downloadEnabled)}
           iconType="material-community"
           checkedIcon="checkbox-marked"
           uncheckedIcon="checkbox-blank-outline"
           checkedColor="#FEB81C"
           title="Télécharger les chapitres"
           textStyle={[{color: colorText, fontFamily: "GeologicaSemiBold"}]}
           
         />
         {isLoading && (
            <View style={{paddingHorizontal: 10}}>
              {[...Array(10).keys()].map((index) => (
                <Skeleton
                  LinearGradientComponent={() => (
                    <LinearGradient colors={['#343434', '#5A5A5A', '#343434']} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                  )}
                  animation="wave"
                  width="100%"
                  height={60}
                  style={{ marginBottom: 10, backgroundColor: "#343434", borderRadius: 0 }}
                />
              ))}
            </View>
          )}
      {activeTab ? (
        <View style={styles.itemContainer}>
           
              {generateChapterButtons()}
            
        </View>
      ) : (
        <View></View>
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
    marginLeft: 5
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    color: colorText,
    fontFamily: "GeologicaSemiBold",
    backgroundColor: '#393939',
    marginBottom: 20,
    
  },

  chapterButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,

  },
  downloadIcon: {
    width:'10%',
    height: '100%',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    
    
  }
});

export default ChapterScraper;
