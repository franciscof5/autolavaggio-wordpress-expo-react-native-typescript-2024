import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button, TextInput } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import LoadingModal from "./LoadingModal";
import {
  useLoginUserMutation,
  useGetFullUserMutation,
} from "../api/currentUserApi/currentUserApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLACES_API_3, USER_2, PASS_2 } from "@env";
console.log("Logis.tsx", PLACES_API_3, USER_2, PASS_2);

const logo = require("../assets/images/gio-logo.png");
const lavagem1 = require("../assets/images/foto-lavagem-1.jpg");

interface UserObject {
  token: string;
  // Add other properties as needed
}

export default function LoginScreen({ navigation }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // console.log("LOGINL2", PLACES_API, USER_2, PASS_2);

  const [username, setUsername] = useState(USER_2);
  const [password, setPassword] = useState(PASS_2);

  const [loginUser, { data, error, isError, isLoading }] =
    useLoginUserMutation();
  const [getFullUser] = useGetFullUserMutation();

  useEffect(() => {
    navigation.setOptions({ headerLeft: () => null });
    console.log("LoginScreen AsyncStorage checkAuthentication" )

    const checkAuthentication = async () => {
      try {
        const userObject = await AsyncStorage.getItem("userObject");
        if (userObject) {
          console.log("LoginScreen AsyncStorage userObject", userObject)

          const parsedUserObject: UserObject = JSON.parse(userObject);
          global.TOKEN = parsedUserObject.token;
          console.log("loginUser token: ", parsedUserObject.token);
          navigation.navigate("Home");
          setIsAuthenticated(true);
        } else {
          console.log("No userObject found")
        }
      } catch (error) {
        console.error("Failed to check authentication.", error);
      }
    };

    checkAuthentication();
  }, [navigation]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const saveToAsyncStorage = async (key: string, value: any) => {
    console.log("saveToAsyncStorage: ", key)

    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save ${key}.`, error);
    }
  };

  const onSubmit = async () => {
    try {
      const resp = await loginUser({ username, password });
      const tokenReceived = resp.data?.token;

      if (tokenReceived) {
        console.log("loginUser tokenReceived: ", tokenReceived);
        global.TOKEN = tokenReceived;
        await saveToAsyncStorage("userObject", resp.data);

        const fullUserResp = await getFullUser({ token: tokenReceived });
        await saveToAsyncStorage("userObjectFull", fullUserResp.data);

        navigation.navigate("Home");
      }
    } catch (err) {
      console.error("Error during login process", err);
    }
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
            {error && (
              <Text style={{ color: "red" }}>
                Oh no, there was an error: {JSON.stringify(error.data)}
              </Text>
            )}
            <View style={styles.formEntry}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label="Nomeutente"
                    placeholder="Digite nomeutente"
                    onBlur={onBlur}
                    onChangeText={setUsername}
                    value={username}
                  />
                )}
                name="username"
              />
              {errors.username && (
                <Text style={styles.errorText}>Campo obbligatorio.</Text>
              )}
            </View>
            <View style={styles.formEntry}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label="Password"
                    placeholder="Digite password"
                    onBlur={onBlur}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                  />
                )}
                name="password"
              />
              {errors.password && (
                <Text style={styles.errorText}>Campo obligatorio.</Text>
              )}
            </View>
            <Button
              onPress={handleSubmit(onSubmit)}
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
  errorText: {
    margin: 8,
    marginLeft: 16,
    color: "red",
  },
  logoStyle: {
    height: 120,
    resizeMode: "contain",
    width: "100%",
  },
  imagemLavagem: {
    marginTop: 10,
    height: 250,
    resizeMode: "contain",
    width: "100%",
  },
});
