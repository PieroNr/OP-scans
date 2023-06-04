import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importez vos pages ici
import ScansList from "../screens/Scans-list";
import ScansReader from "../screens/Scans-reader";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Liste des scans"
          component={ScansList}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Lecteur" component={ScansReader} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
