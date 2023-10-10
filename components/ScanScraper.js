import React, { useEffect, useState, useRef } from "react";
import { primaryColor, secondaryColor } from "../hooks/styles";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image
} from "react-native";
import ImageZoomViewer from "react-native-image-zoom-viewer";
import axios from "axios";
import cheerio from "cheerio";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanScraper = ({ chapter, handleSlideChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(50);
  const screenWidth = Dimensions.get("window").width;

  const generateChapterCacheKey = (chapterNumber) => `chapter_${chapterNumber}_images_limk`;

  useEffect(() => {
    const fetchData = async () => {
      const scannedImages = [];
      let currentPage = 1;
      let hasMoreImages = true;

      const cachedImageLinks = await getChapterImageLinksFromCache(chapter.number);

      if (cachedImageLinks) {
        setImages(cachedImageLinks);
        setIsLoading(false);
        setTotalSlides(cachedImageLinks.length);
        return;
      }
      while (hasMoreImages) {
        try {
          const response = await axios.get(`${chapter.link}/${currentPage}`);

          const html = response.data;
          const $ = cheerio.load(html);
          const scanImages = $("img.scan-page");

          if (scanImages.length > 0) {
            scanImages.each(async (index, element) => {
              const imageUrl = $(element).attr("src");
              scannedImages.push(imageUrl.trimStart().trimEnd());
              setImages(scannedImages);
            });
            currentPage++;
            setIsLoading(false);
          } else {
            hasMoreImages = false;
            setTotalSlides(scannedImages.length);
          }
        } catch (error) {
          console.error(error);
          hasMoreImages = false;
        }
      }  
      await cacheChapterImageLinks(chapter.number, scannedImages);
      setImages(scannedImages);
      
    };

    fetchData();
  }, [chapter]);

  const cacheChapterImageLinks = async (chapterNumber, imageLinks) => {
    try {
      const key = generateChapterCacheKey(chapterNumber);
      await AsyncStorage.setItem(key, JSON.stringify(imageLinks));
    } catch (error) {
      console.error(error);
    }
  };

  const getChapterImageLinksFromCache = async (chapterNumber) => {
    try {
      const key = generateChapterCacheKey(chapterNumber);
      const cachedLinks = await AsyncStorage.getItem(key);
      return cachedLinks ? JSON.parse(cachedLinks) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };


  const renderImageItem = ({ item }) => {
    return (
      <View style={[styles.imageContainer, { width: screenWidth }]}>
        <Image source={{ uri: item }} style={styles.image}/>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={secondaryColor} />
      </View>
    );
  }

  return (
    <FlatList
      maximumZoomScale={5}
      minimumZoomScale={1}
      inverted
      styles={styles.container}
      data={images}
      renderItem={renderImageItem}
      keyExtractor={(item, index) => index.toString()}
      onScroll={(event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const slide = event.nativeEvent.contentOffset.x / slideSize;
        setCurrentSlide(parseInt(slide+1));
        handleSlideChange(currentSlide, totalSlides, generateChapterCacheKey(chapter.number));

        
      }}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    marginTop: "85%",
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColor,
  },
  image: {
    width: "100%",
    height: "100%",
    marginBottom: 10,
    resizeMode: "contain",
  },
});

export default ScanScraper;
