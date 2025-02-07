import { useState, useEffect, useRef } from 'react';
import { Platform, React, Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert, Title } from 'react-native';
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
import { Appbar, Menu } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLACES_API_3, USER_2, PASS_2 } from "@env";
console.log("App.js", PLACES_API_3, USER_2, PASS_2);


//import { getVehicles } from "./store/vehicle/vehicleSlice";
// import {PLACES_API} from '@env'
// import Config from "react-native-config";
// import { PLACES_API } from 'react-native-dotenv'
// Config.PLACES_API; // 'https://myapi.com'
// import { StatusBar } from 'expo-status-bar';
// import { Audio } from 'expo-av';
// import { AppRegistry } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';

// require("./theme.js")
// import "./theme.js"

import Login from "./screens/Login"
import Register from "./screens/Register"
import Home from "./screens/Home";
import AddVehicle from "./screens/Vehicles/AddVehicle"
import ListVehicles from "./screens/Vehicles/ListVehicles"
import CreditCard from "./screens/CreditCard"


const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <RootSiblingParent>
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Login"
              screenOptions={{
                header: (props) => <CustomNavigationBar {...props} />
              }}
              >
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Add Vehicle" component={AddVehicle} />
              <Stack.Screen name="CreditCard" component={CreditCard} />
              <Stack.Screen name="ListVehicles" component={ListVehicles} />
            </Stack.Navigator>
          </NavigationContainer>
        </RootSiblingParent>
      </PaperProvider>
    </Provider>
  );
}

const CustomNavigationBar = ({
  navigation,
  route,
  options,
  back,
} ) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const title = getHeaderTitle(options, route.name);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userObject');
      await AsyncStorage.removeItem('userObjectFull');
      navigation.navigate("Login")
    } catch (error) {
      console.error('Failed to log out.', error);
    }
  };

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
      {back ? ( <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={openMenu}
            />
          }>
          <Menu.Item
            onPress={() => {
              console.log('Option 1 was pressed');
              // navigation.navigate("Login")
              logout()
            }}
            title="Logout"
          />
          {/* <Menu.Item
            onPress={() => {
              console.log('Option 2 was pressed');
            }}
            title="Option 2"
          />
          <Menu.Item
            onPress={() => {
              console.log('Option 3 was pressed');
            }}
            title="Option 3"
            disabled
          /> */}
        </Menu>
      ) : null}
    </Appbar.Header>
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