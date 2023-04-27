import React, { useEffect, useState } from 'react';
import cheerio from 'cheerio';
import axios from 'axios';
import { View, Text, Image } from 'react-native';

const ImageScraper = () => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    axios.get('https://www.scan-vf.net/one_piece')
      .then(response => {
        const $ = cheerio.load(response.data);
        const urls = $('img').map((i, el) => $(el).attr('src')).get();
        setImageUrls(urls);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <View>
      {imageUrls.map(url => (
        <Image source={{ uri: url }} style={{ width: 200, height: 200 }} />
      ))}
    </View>
  );
};

export default ImageScraper;