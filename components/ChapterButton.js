import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Chapter from "../models/Chapter";
import { primaryColor, secondaryColor, colorText, colorTextReaded } from "../hooks/styles";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB } from '@rneui/themed';


const ChapterButton = ({ item, link, readedChapters, progressChapters, setReadedChapters, setProgressChapters, downloadEnabled, downloadChapter, downloadActivate }) => {

  const [isReaded, setIsReaded] = useState(false);
  const [isInProgress, setIsInProgress] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(50);
  const [downloading, setDownloading] = useState(false);

  
  const navigation = useNavigation();

  const numberRegex = /One Piece (\d+)/;
  const numberMatch = item.match(numberRegex);
  const number = numberMatch ? numberMatch[1] : "";

  const titleRegex = /:\s*(.*)/;
  const titleMatch = item.match(titleRegex);
  let title = titleMatch ? titleMatch[1] : "";

  const lines = item.split("\n");
  let dateChapter = "";
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() !== "") {
      dateChapter = lines[i];
      break;
    }
  }

  if (title == dateChapter) {
    title = "";
  }

  const chapter = new Chapter(number, title, dateChapter, link);

  useEffect(() => {
    checkChapterStatus(chapter.number);
  }, []);

  useEffect(() => {
    if (!downloadActivate) {
      setDownloading(false);
    }
  }, [downloadActivate]);

  const checkChapterStatus = (noChapter) => {
    setIsReaded(readedChapters.includes(noChapter));
    setIsInProgress(progressChapters.includes(noChapter));
  };

  const markChapterAsInProgress = async (noChapter) => {
    try {
      
      setIsInProgress(true);
      await AsyncStorage.setItem('progressChapters', JSON.stringify([...progressChapters, noChapter]));
      setProgressChapters([...progressChapters, noChapter]);


      if(isReaded) {
        const newReadedChapters = readedChapters.filter((chapter) => chapter !== noChapter);
        await AsyncStorage.setItem('readedChapters', JSON.stringify(newReadedChapters));
        setIsReaded(false);
        setReadedChapters(newReadedChapters);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const markChapterAsReaded = async (noChapter) => {
    try {
      setIsReaded(true);
      await AsyncStorage.setItem('readedChapters', JSON.stringify([...readedChapters, noChapter]));

      setIsInProgress(false);
      const newProgressChapters = progressChapters.filter((chapter) => chapter !== noChapter);
      await AsyncStorage.setItem('progressChapters', JSON.stringify(newProgressChapters));
      setProgressChapters(newProgressChapters);

    } catch (error) {
      console.error(error);
    }
  };

  const handleSlideChange = (current, total,key) => {
    setCurrentSlide(current);
    setTotalSlides(total);
    
    if (current === total) {
      markChapterAsReaded(chapter.number);
      AsyncStorage.removeItem(key);
    }
  };


  return (
    <View style={styles.chapterButtonContainer}>
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        downloadEnabled && {width: "85%"},
      ]}
      onPress={() => {
        if (!isInProgress) {
          markChapterAsInProgress(chapter.number);
        } 
        navigation.navigate("Lecteur", { chapter: chapter,  handleSlideChange: handleSlideChange, currentSlide: currentSlide, totalSlides: totalSlides});
        
      }}
    >
      <Text style={styles.buttonText}>
        {chapter.number} : {chapter.title}
      </Text>
      {isInProgress && <FontAwesome name="hourglass-half" style={[
        styles.hourglassInProgress
      ]} size={15} color="#FEB81C" />}
      {isReaded && <FontAwesome name="check" style={[
        styles.checkReaded
      ]} size={15} color="#1C1C1C" />}
    </TouchableOpacity>
    {downloadEnabled && !downloading && (
      <TouchableOpacity style={styles.downloadIcon} onPress={() => {
        setDownloading(true)
        downloadChapter(chapter.link) 
         
      }
        }>
        <FontAwesome name="download" style={{color: "#feb81c", textAlign: 'center', margin: 'auto'}} size={25}/>
      </TouchableOpacity>
    )}
    {downloadEnabled && downloading && downloadActivate && (
       <FAB
       loading
       visible={downloading}
       icon={{ name: 'add', color: 'white' }}
       style={{ marginLeft: 12 }}
       color="transparent"
       size="15"
     />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: primaryColor, 
    borderColor: secondaryColor, 
    borderWidth: 1,
    width: '100%',
    paddingLeft: 24,
    paddingRight: 0,
    
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
  },
  chapterButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    

  },

  buttonText: {
    color: colorText,
    fontWeight: "400",
    fontSize: 12,
    textAlign: "left",
    fontFamily: "GeologicaSemiBold",
    maxWidth: "80%",
    marginVertical: 17,
    
  },

  checkReaded: {
    backgroundColor: secondaryColor,
    maxWidth: '20%',
    textAlign: "center",
    padding: 24,
    height: '100%'
    

  },

  hourglassInProgress: {
    paddingRight:24
  }
});

export default ChapterButton;
