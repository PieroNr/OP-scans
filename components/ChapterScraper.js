import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import cheerio from 'cheerio';
import ChapterButton from './ChapterButton';

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
        const liElements = $('ul.chapters').children('li');
        const liElementsTexts = liElements.map((i, el) => $(el).text()).get();
        liElementsTexts.reverse();
        setLiElements(liElementsTexts);
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
      <View style={styles.filterContainer}>{generateFilters()}</View>
      <View style={styles.itemContainer}>
      <FlatList
        data={filteredLiElements}
        keyExtractor={(item, index) => index.toString()}
        extraData={activeFilter}
        renderItem={({ item }) =>  (
          <View>
            <ChapterButton item={item} />
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
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e91e63',
    borderRadius: 5,
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
        },
        liText: {
            marginBottom: 10,
        },
    });

export default ChapterScraper;