//Styles for the app
import * as Font from 'expo-font';

export const primaryColor = "#1C1C1C";
export const secondaryColor = "#FEB81C";
export const colorText = "#ffffff";

export const loadFonts = async () => {
  await Font.loadAsync({
    GeologicaSemiBold: require("../assets/fonts/GeologicaSemiBold.ttf"),
    GeologicaLight: require("../assets/fonts/GeologicaLight.ttf"),
    GeologicaExtraLight: require("../assets/fonts/GeologicaExtraLight.ttf"),
    GeologicaRegular: require("../assets/fonts/GeologicaRegular.ttf"),
  });
};
