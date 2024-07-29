import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView, Keyboard } from 'react-native';
import React from 'react';
import { MD3LightTheme as DefaultTheme,
        List, Chip, Button, ProgressBar, 
        MD3Colors, PaperProvider,
        TextInput } from 'react-native-paper';

import { useSelector } from 'react-redux'
import vehicleApi from "../api/vehicle/vehicleApi";
import LoadingModal from "./LoadingModal";
import Camera from './Camera'

export default function AddCar({ navigation }) {
  let userObject = {
    "token": "token", 
    "user_display_name": "Username", 
    "user_email": "email@email.com", 
    "user_nicename": "nicename"
  }
  // userObject = useSelector((state) => Object.values(state.currentUserApi.mutations)[0].data )
  const [addVehicle, { data, error, isError, isLoading }] = vehicleApi.useAddVehicleMutation();
  
  const handleSave = async () => {
    // console.log("HandleSave")
    // console.log(vehicleApi);
    Keyboard.dismiss();
    let r = await addVehicle(
       {
          title: 'Direto do handleSave Asd',
          status: 'publish'
        },
      // {
      //   id: Math.ceil(Math.random() * 100),
      //   body: { Bearer: userObject.token },
      //   post_name: "Random " + Math.ceil(Math.random() * 100),
      // }
    );
    console.log("r", r)
    // setName("");
    // setUserName("");
  };
  return (
    <PaperProvider>
      {isLoading ? (
        <LoadingModal isLoading={isLoading} />
      ) : (
          <ScrollView style={styles.container}>
              <StatusBar style="auto" />
            <TextInput id='vehicleName' placeholder='Nome do Carro' />
            <Button
              title="Submit"
              mode="outlined"
              style={styles.button}
              onPress={handleSave}
            >
              Enviar
            </Button>
          <View>
            { error ? (
              <Text>Oh no, there was an error {JSON.stringify(error)}</Text>
            ) : isLoading ? (
              <Text>Loading...</Text>
            ) : ( null )
            }
          </View>
          <Camera />
           </ScrollView>
      )}
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
});

/*
Utilitaria (carro utilitário) - Pequenos carros urbanos, como o Fiat Panda.
Compatta (carro compacto) - Carros de tamanho médio, como o Volkswagen Golf.
Berline (sedan) - Carros com quatro portas e um porta-malas separado, como o BMW Série 3.
Station Wagon (perua) - Carros com maior espaço no porta-malas, como o Volvo V60.
SUV (Sport Utility Vehicle) - Veículos utilitários esportivos, como o Jeep Renegade.
Crossover - Mistura de SUV e carro compacto, como o Nissan Qashqai.
Coupé - Carros com duas portas e estilo esportivo, como o Audi TT.
Cabriolet ou Convertible (conversível) - Carros com teto retrátil, como o Mazda MX-5.
Monovolume (minivan) - Carros com espaço interno ampliado para famílias, como o Renault Espace.
Utilitaria
Compatta
Berline
Station Wagon
SUV
Crossover
Coupé
Convertible
Monovolume
todo: Icon by Iconpacks
todo: https://www.iconpacks.net/free-icon-pack/car-types-180.html
*/