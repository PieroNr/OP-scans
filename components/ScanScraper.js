import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, FlatList,Dimensions } from 'react-native';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
import axios from 'axios';
import cheerio from 'cheerio';


const ScanScraper = ({ link }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const screenWidth = Dimensions.get('window').width;

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
          const scanImages = $('img.scan-page');

          if (scanImages.length > 0) {
            scanImages.each((index, element) => {
              const imageUrl = $(element).attr('src');
              
              scannedImages.push(imageUrl.trimStart().trimEnd());
            });
            currentPage++;
          } else {
            hasMoreImages = false;
          }
        } catch (error) {
          console.error(error);
          hasMoreImages = false;
        }
      }

      setImages(scannedImages);
      setIsLoading(false);
      console.log(scannedImages);
    };

    fetchData();
  }, [link]);

  const renderImageItem = ({ item }) => {
    return (
      <View style={[styles.imageContainer, { width: screenWidth }]}>
        <Image source={{ uri: item }} style={styles.image} />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        
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
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
    
  );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '85%',
    },
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    marginBottom: 10,
    resizeMode: 'contain',
  },
});

export default ScanScraper;