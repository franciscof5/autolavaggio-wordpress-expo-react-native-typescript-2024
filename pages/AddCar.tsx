import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme,
        List, Chip, Button, ProgressBar, MD3Colors, PaperProvider } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { WizardStore } from "../storage";
import {
    SubmitHandler,
    useForm,
    Controller,
    useFieldArray,
} from "react-hook-form";
import { useIsFocused } from "@react-navigation/native";

const mockCarTypes = {
    "types": 
    [ 
        {
            "name":"Micro",
            "image":require("../images/car-types/micro-car-13314.png")
        },{
            "name":"Hatchback",
            "image":require("../images/car-types/hatchback-car-13312.png")
        },{
            "name":"Sedan",
            "image":require("../images/car-types/sedan-car-13311.png")
        },{
            "name":"SUV",
            "image":require("../images/car-types/suv-car-13321.png")
        },{
            "name":"Pickup",
            "image":require("../images/car-types/pickup-car-13322.png")
        },{
            "name":"Van",
            "image":require("../images/car-types/van-truck-car-13329.png")
        },{
            "name":"Cabriolet",
            "image":require("../images/car-types/cabriolet-car-13316.png")
        },{
            "name":"Bus",
            "image":require("../images/car-types/bus-13331.png")
        }

    ]
}

const TaskPanel = ( (rdata) =>{
  return (
    <View>
      <Text>Tarefa { WizardStore.getRawState().post_object.post_title }</Text>
    </View>
  )
})

export default function AddCar({ navigation }) {
  // keep back arrow from showing
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [rdata, setRdata] = useState([]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: WizardStore.useState((s) => s) });
  const { fields, append, prepend, remove, swap, move, insert, replace } =
  useFieldArray({
    control,
    name: "test",
    // rules: {
    //   minLength: 4,
    // },
  });
  
  useEffect(() => {
    isFocused &&
    WizardStore.update((s) => {
      s.progress = 10;
    });
    }, [isFocused, replace]);

    const onSubmit = (data) => {
    //axios.get("http://app.trcmobile.com.br/ws/checklist/new_checklist.php")
    //.then((r)=> {
        //console.log("r.data.data.grupo_checklist", r.data.data.grupo_checklist)        
        WizardStore.update((s) => {
            s.progress = 20;
            // s.step = {
            //     ["notas_calculadas"]:[]
            // }
        });
        navigation.navigate("AddCarDetails");
    //})
    };
    const isFocused = useIsFocused();  
  
  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <StatusBar style="auto" />
        <List.Section 
            style={{width:"100%"}}>
            <List.Subheader>Tipo de Macchina</List.Subheader>
            { mockCarTypes.types.map( (item) => {
                return(
                    <List.Item 
                        title={item.name}
                        style={{}}
                        left={() => 
                            <Image source={item.image} style={{width:100, height:100}} />
                        } />
                )
            }) }
            {/* <List.Item            title="Second Item"            left={() => <List.Icon color={MD3Colors.tertiary70} icon="folder" />}/> */}
        </List.Section>
        <Button
          mode="outlined"
          style={[styles.button, { marginTop: 40 }]}
          onPress={() => navigation.goBack()}
        >
          VOLTAR
        </Button>
        <Button
          title="Submit"
          mode="outlined"
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          PRÓXIMO PASSO
        </Button>
      </ScrollView>
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