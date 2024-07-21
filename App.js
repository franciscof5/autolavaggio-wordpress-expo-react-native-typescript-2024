import { StatusBar } from 'expo-status-bar';
import { Platform, React, Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert, Title } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Audio } from 'expo-av';
import { AppRegistry } from 'react-native';
import { ProgressBar, MD3Colors, PaperProvider } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import { RootSiblingParent } from 'react-native-root-siblings';

const Stack = createStackNavigator();

import Login from "./pages/Login"
import HomeMap from "./pages/HomeMap";
import AddCar from "./pages/AddCar"
import AddCarDetails from "./pages/AddCarDetails"

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  return (
    <PaperProvider>
      <RootSiblingParent>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="HomeMap">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="HomeMap" component={HomeMap} />
            <Stack.Screen name="AddCar" component={AddCar} />
            <Stack.Screen name="AddCarDetails" component={AddCarDetails} />
          </Stack.Navigator>
        </NavigationContainer>
      </RootSiblingParent>
    </PaperProvider>
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