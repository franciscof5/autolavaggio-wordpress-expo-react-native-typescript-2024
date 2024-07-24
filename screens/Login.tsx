import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert, Image } from "react-native";
import Constants from "expo-constants";

import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { LavaggioStore } from "../storage";
import { Button, MD3Colors, ProgressBar, TextInput } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios"; 
import Toast from 'react-native-root-toast';

import { useLoginQuery, currentUserApi } from "../api/currentUserApi/currentUserApi"

const logo = require("../assets/images/gio-logo.png")
const lavagem1 = require("../assets/images/foto-lavagem-1.jpg")

//import { jsonFieldsChecklist } from "../assets/jsonFieldsChecklist.json"
//import { data } from "../assets/data.json"


export default function LoginScreen({ navigation }) {
  //const jsonFieldsChecklist = require("../assets/checklistApiRetorno.json");
  //const [fieldsArea, setFieldsArea] = useState();
  //const data = require('../assets/data.json');
  // keep back arrow from showing
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const {
    handleSubmit,
    control,
    register,

    formState: { errors },
  } = useForm({ defaultValues: LavaggioStore.useState((s) => s) });
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      LavaggioStore.update((s) => {
        s.progress = 0;
      });
      
  }, [isFocused]);

  //const { data, error, isError, isLoading } = currentUserApi.useLoginQuery();
  const [loginUser, { data, error, isError, isLoading }] = currentUserApi.useLoginUserMutation();
  // const { data, error, isLoading } = useLoginQuery('/token?username=foca&password=931777')
  const onSubmit = () => {
    console.log("onSubmit")
    loginUser({
      id: Math.ceil(Math.random() * 100),
      email: "teste@teste.com",
    });
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={LavaggioStore.getRawState().progress}
        color={MD3Colors.primary60}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <Image source={logo}  style={styles.logoStyle}/>
        <View>
            {error ? (
            <Text>Oh no, there was an error {JSON.stringify(error.data)}</Text>
          ) : isLoading ? (
            <Text>Loading...</Text>
          ) : data ? (
            <View>
              <Text> { data.token }</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.formEntry}>
          <Controller
            control={control}
            rules={{
              //required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label="Nomeutente"
                placeholder="Digite nomeutente"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="username"
          />
          {errors.username && (
            <Text style={{ margin: 8, marginLeft: 16, color: "red" }}>
              Campo obbligatorio.
            </Text>
          )}
        </View>

        <View style={[styles.formEntry]}>
          <Controller
            control={control}
            rules={{
              //required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label="Password"
                placeholder="Digite password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                //keyboardType="numeric"
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={{ margin: 8, marginLeft: 16, color: "red" }}>
              Campo obrigatório.
            </Text>
          )}
        </View>

        <Button
          onPress={handleSubmit(onSubmit)}
          mode="outlined"
          style={styles.button}
        >
          ENTRARE
        </Button>
      </View>
      <Image source={lavagem1}  style={styles.imagemLavagem}/>
        
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    margin: 8,
  },
  formEntry: {
    margin: 8,
  },
  container: {
    flex: 1,
  },
  progressBar: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  logoStyle: {
    height: 120,
    resizeMode: "contain",
    flexDirection: "row", 
    width:"100%",
 },
 imagemLavagem: {
  height: 250,
  resizeMode: "contain",
  flexDirection: "row", 
  width:"100%",
}
});
