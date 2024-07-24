import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, BottomNavigation, ProgressBar, MD3Colors, PaperProvider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { LavaggioStore } from "../storage";
import MapView, {Marker} from 'react-native-maps';
import * as Location from "expo-location";
//import GetLocation from 'react-native-get-location';
import { useIsFocused } from "@react-navigation/native";

import { useSelector, useDispatch } from 'react-redux'
// import { decrement, increment } from '../store/counter/counterSlice'
import { getVehicles } from '../api/vehicle/vehicleSlice-offline';
import ListVehicles from './Vehicles/ListVehicles'


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// const foca = require("../assets/images/mascote_foca.png")
// const soundStart = require("../sounds/crank-2.mp3")
// const soundTrompeth = require("../sounds/77711__sorohanro__solo-trumpet-06in-f-90bpm.mp3")
// const soundRing = require("../sounds/telephone-ring-1.mp3")

let pomodoroTime = LavaggioStore.getRawState().session_object.pomodoroTime;
let restTime=LavaggioStore.getRawState().session_object.restTime;

const MusicRoute = () => <Text>Music</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;

//const MyComponent = ({ navigation }) => {
export default function HomeMapTabs({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);
  const isFocused = useIsFocused();
  // const count = useSelector((state) => state.counter.value)
  // const dispatch = useDispatch()

  const CarsRoute = () => 
    <View> 
      <Text>Your Cars!!!!!</Text>
      <ListVehicles />
      <Button
              mode="outlined"
              style={[{ marginTop: 40 }]}
              onPress={() => navigation.navigate("AddCar")}
            > Adicionar
      </Button>
    </View>

  const Counter = () => 
    <View>
      <Text>V: {count}</Text>
      <Button
        onPress={() => dispatch(increment())}
        >Inc</Button>
      <Button
        onPress={() => dispatch(decrement())}
        >Dec</Button>
    </View>


  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'maps', title: 'Maps', focusedIcon: 'map-marker', unfocusedIcon: 'map-marker-outline'},
    { key: 'cars', title: 'Cars', focusedIcon: 'car', unfocusedIcon: 'car-outline' },
    { key: 'recents', title: 'Recents', focusedIcon: 'history' },
    { key: 'notifications', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    maps: HomeAppMap,
    cars: CarsRoute,
    recents: RecentsRoute,
    notifications: Counter,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

//export default MyComponent;

const HomeAppMap = ()=> {
  const [mapRegion, setMapRegion] = useState({
    latitude: 41.8905,
    longitude: 12.4942,
    latitudeDelta: 30,
    longitudeDelta: 12
  });

  const userLocation = async() => {
    let {status} = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted") {
      console.log("need location");
      return;
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy:true});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.018,
      longitudeDelta: 0.002
    })
  }

  useEffect(() => {
    userLocation();
  }, []);
  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <MapView style={styles.map} 
          region={mapRegion}
        >
          <Marker title="Io" coordinate={mapRegion} />
        </MapView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDD',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

const mockCarTypes = {
  "types": 
  [ 
      {
          "name":"Micro",
          "image":require("../assets/images/car-types/micro-car-13314.png")
      },{
          "name":"Hatchback",
          "image":require("../assets/images/car-types/hatchback-car-13312.png")
      },{
          "name":"Sedan",
          "image":require("../assets/images/car-types/sedan-car-13311.png")
      },{
          "name":"SUV",
          "image":require("../assets/images/car-types/suv-car-13321.png")
      },{
          "name":"Pickup",
          "image":require("../assets/images/car-types/pickup-car-13322.png")
      },{
          "name":"Van",
          "image":require("../assets/images/car-types/van-truck-car-13329.png")
      },{
          "name":"Cabriolet",
          "image":require("../assets/images/car-types/cabriolet-car-13316.png")
      },{
          "name":"Bus",
          "image":require("../assets/images/car-types/bus-13331.png")
      }

  ]
}