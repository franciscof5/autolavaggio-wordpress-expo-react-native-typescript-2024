import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button, MD3Colors, ProgressBar, TextInput } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
// import Toast from 'react-native-root-toast';
import LoadingModal from "./LoadingModal";
import { useLoginUserMutation, useGetFullUserMutation } from "../api/currentUserApi/currentUserApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require("../assets/images/gio-logo.png");
const lavagem1 = require("../assets/images/foto-lavagem-1.jpg");

export default function LoginScreen({ navigation }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(global.USER)
  const [password, setPassword] = useState(global.PASS)

  const [loginUser, { data, error, isError, isLoading }] =
    useLoginUserMutation();

  const [getFullUser] = useGetFullUserMutation();
  // keep back arrow from showing
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
    // setTimeout(()=>{onSubmit()}, 2000)
  }, [navigation]);

  useEffect(() => {
    const checkAuthentication = async () => {
      console.log("LoginScreen AsyncStorage checkAuthentication" )
      try {
        const userObject = await AsyncStorage.getItem('userObject');
        if (userObject) {
          console.log("LoginScreen AsyncStorage userObject", userObject)
          global.TOKEN = userObject.token;
          navigation.navigate("Home")
          setIsAuthenticated(true);
        } else {
          console.log("No userObject found")
        }
      } catch (error) {
        console.error('Failed to check authentication.', error);
      }
    };
    
    checkAuthentication();
  }, [navigation]);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm();
  const isFocused = useIsFocused();
  
  const SaveUserObject = async (userObject) => {
    console.log("AsyncStorage SaveUserObject")
    try {
      await AsyncStorage.setItem('userObject', JSON.stringify(userObject));
      // setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to userObject.', error);
    }
  };

  const SaveFullUserObject = async (userObjectFull) => {
    console.log("AsyncStorage SaveFullUserObject")
    try {
      await AsyncStorage.setItem('userObjectFull', JSON.stringify(userObjectFull));
      // setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to userObjectFull.', error);
    }
  };

  const onSubmit = () => {
    console.log("onSubmit", username, password);
    loginUser({
      username: username,
      password: password,
    }).then((resp) => {
      console.log("loginUser resp", resp.data);
      let token_received = resp.data.token;
      global.TOKEN = token_received;
      SaveUserObject(resp.data)

      if (token_received) {
        console.log("loginUser token: ", token_received);
        getFullUser({
          token: token_received,
        }).then((resp)=>{
          SaveFullUserObject(resp.data)
          console.log("getFullUser resp", resp);
          navigation.navigate("Home");
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingModal isLoading={isLoading} />
      ) : (
        <View>
          <View style={{ paddingHorizontal: 16 }}>
            <Image source={logo} style={styles.logoStyle} />
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              Lavaggio App: Prenota autolavaggio
            </Text>
            <View>
              {error ? (
                <Text>
                  Oh no, there was an error {JSON.stringify(error.data)}
                </Text>
              ) : isLoading ? (
                <Text>Loading...</Text>
              ) : data ? (
                <View>
                  <Text> {data.token ? <>Successfull</> : null}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.formEntry}>
              <Controller
                control={control}
                rules={
                  {
                    // required: true,
                  }
                }
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label="Nomeutente"
                    placeholder="Digite nomeutente"
                    onBlur={onBlur}
                    onChangeText={(value) => setUsername(value)}
                    value={username}
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
                rules={
                  {
                    // required: true,
                  }
                }
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label="Password"
                    placeholder="Digite password"
                    onBlur={onBlur}
                    onChangeText={(value) => setPassword(value)}
                    value={password}
                    secureTextEntry={true}
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
              onPress={onSubmit}
              mode="outlined"
              style={styles.button}
              icon="login"
            >
              ENTRARE
            </Button>
            <Button
              onPress={() => navigation.navigate("Register")}
              mode="contained"
              style={styles.button}
              icon="account-arrow-right"
            >
              REGISTRATI
            </Button>
          </View>
          <Image source={lavagem1} style={styles.imagemLavagem} />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    margin: 8,
    borderRadius: 5,
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
    width: "100%",
  },
  imagemLavagem: {
    marginTop: 10,
    height: 250,
    resizeMode: "contain",
    flexDirection: "row",
    width: "100%",
  },
});
