import { useState, useEffect, useRef } from 'react';
import { Platform, React, Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert, Title } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { Audio } from 'expo-av';
// import { AppRegistry } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
import {
  configureFonts,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import { RootSiblingParent } from 'react-native-root-siblings';

import { store } from './api/store'
import { Provider, useSelector } from 'react-redux'
//import { getVehicles } from "./store/vehicle/vehicleSlice";

const Stack = createStackNavigator();

const fontConfig = {
  customVariant: {
    fontFamily: Platform.select({
      web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'sans-serif',
    }),
    fontWeight: '400',
    letterSpacing: 0.5,
    lineHeight: 22,
    fontSize: 20,
  }
};

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  //Italy green: 0, 140, 69
  //Italy white: 244, 249, 255
  //Italy red: 205, 33, 42
  fonts: configureFonts({config: fontConfig}),
  "colors": {
    "primary": "rgb(0, 109, 52)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(137, 250, 165)",
    "onPrimaryContainer": "rgb(0, 33, 11)",
    "secondary": "rgb(80, 99, 82)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(211, 232, 210)",
    "onSecondaryContainer": "rgb(14, 31, 18)",
    "tertiary": "rgb(58, 101, 110)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(189, 234, 245)",
    "onTertiaryContainer": "rgb(0, 31, 37)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(252, 253, 247)",
    "onBackground": "rgb(25, 28, 25)",
    "surface": "rgb(252, 253, 247)",
    "onSurface": "rgb(25, 28, 25)",
    "surfaceVariant": "rgb(221, 229, 218)",
    "onSurfaceVariant": "rgb(65, 73, 65)",
    "outline": "rgb(113, 121, 112)",
    "outlineVariant": "rgb(193, 201, 190)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(46, 49, 46)",
    "inverseOnSurface": "rgb(240, 241, 236)",
    "inversePrimary": "rgb(108, 221, 140)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(239, 246, 237)",
      "level2": "rgb(232, 242, 231)",
      "level3": "rgb(224, 237, 226)",
      "level4": "rgb(222, 236, 224)",
      "level5": "rgb(217, 233, 220)"
    },
    "surfaceDisabled": "rgba(25, 28, 25, 0.12)",
    "onSurfaceDisabled": "rgba(25, 28, 25, 0.38)",
    "backdrop": "rgba(43, 50, 43, 0.4)"
  }
};

import Login from "./screens/Login"
import Register from "./screens/Register"
import HomeMap from "./screens/HomeMap";
import AddVehicle from "./screens/Vehicles/AddVehicle"
import AddCarDetails from "./screens/Vehicles/AddCarDetails"

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <RootSiblingParent>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="HomeMap" component={HomeMap} />
              <Stack.Screen name="AddVehicle" component={AddVehicle} />
              <Stack.Screen name="AddCarDetails" component={AddCarDetails} />
            </Stack.Navigator>
          </NavigationContainer>
        </RootSiblingParent>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
    //
    backgroundColor: '#DDD',
    alignItems: 'center',
  },
});