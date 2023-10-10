import React, { useEffect, useState, useRef } from "react";
import { primaryColor, secondaryColor } from "../hooks/styles";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import ImageZoomViewer from "react-native-image-zoom-viewer";
import axios from "axios";
import cheerio from "cheerio";
import { set } from "react-native-reanimated";

const ScanScraper = ({ link, handleSlideChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(50);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchData = async () => {
      const scannedImages = [];
      let currentPage = 1;
      let hasMoreImages = true;

      while (hasMoreImages) {
        try {
          const response = await axios.get(`${link}/${currentPage}`);

          const html = response.data;
          const $ = cheerio.load(html);
          const scanImages = $("img.scan-page");

          if (scanImages.length > 0) {
            scanImages.each((index, element) => {
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
      
      setImages(scannedImages);
      
    };

    fetchData();
  }, [link]);


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
        handleSlideChange(currentSlide, totalSlides)
        
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
