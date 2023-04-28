import React from 'react';
import { View, Text, Image } from 'react-native';
import ScanScraper from '../components/ScanScraper';

const ScansReader = ({ route }) => {
  const { link } = route.params;

  return (
    <View>
      <ScanScraper link={link} />
    </View>
  );
};

export default ScansReader;