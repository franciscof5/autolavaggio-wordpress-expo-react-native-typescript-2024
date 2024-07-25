import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { LavaggioStore } from "../storage";
import { Button, MD3Colors, ProgressBar, TextInput } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
// import Toast from 'react-native-root-toast';
import LoadingModal from "./LoadingModal";
import currentUserApi from "../api/currentUserApi/currentUserApi"

const logo = require("../assets/images/gio-logo.png")
const lavagem1 = require("../assets/images/foto-lavagem-1.jpg")

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [loginUser, { data, error, isError, isLoading }] = currentUserApi.useLoginUserMutation();
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

  const onSubmit = () => {
    console.log("onSubmit", username, password)
    loginUser({
      id: Math.ceil(Math.random() * 100),
      username: username,
      password: password,
    })
    .then((resp)=>{
      console.log("resp", resp.data.token);
      if(resp.data.token) {
        console.log("ENTROU")
        navigation.navigate("HomeMap")
      }
    });    
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingModal isLoading={isLoading} />
      ) : (
        <View>
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
                <Text> { data.token  ? ( <>Successfull</>) : null }</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.formEntry}>
            <Controller
              control={control}
              rules={{
                // required: true,
              }}
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
              rules={{
                // required: true,
              }}
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
          >
            ENTRARE
          </Button>
        </View>
        <Image source={lavagem1}  style={styles.imagemLavagem}/>
        </View>
      )}
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
