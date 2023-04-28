import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import cheerio from 'cheerio';
import ChapterButton from './ChapterButton';
import Carousel from 'react-native-snap-carousel';

const ChapterScraper = () => {
  const [liElements, setLiElements] = useState([]);
  const [filteredLiElements, setFilteredLiElements] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://www.scan-vf.net/one_piece');
        const html = response.data;
        const $ = cheerio.load(html);
        const liElements = $('ul.chapters').children('li').map((i, el) => $(el)).get();
        
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
      const [start, end] = activeFilter.split(' à ');
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

  return (
    <View style={styles.container}>
      <View style={styles.filterList}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.filterContainer}
        showsHorizontalScrollIndicator={false}
        styles={styles.scrollView}
      >{generateFilters()}</ScrollView>
      </View>
      <View style={styles.itemContainer}>
      <FlatList
        data={filteredLiElements.reverse()}
        keyExtractor={(item, index) => index.toString()}
        extraData={activeFilter}
        renderItem={({ item }) =>  (
          <View>
            <ChapterButton item={item.text()} link={item.find('a').attr('href')}/>
          </View>
        )}
      />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 0,
  },
  filterContainer: {
    marginBottom: 20,
    
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#e91e63',
    borderRadius: 5,
    marginHorizontal: 5,
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  activeFilterButton: {
    backgroundColor: '#c2185b',
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  liText: {
    marginBottom: 10,
  },
  filterList: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    height: 50,
  },
    });

export default ChapterScraper;