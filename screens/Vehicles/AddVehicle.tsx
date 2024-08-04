import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import vehicleApi from "../../api/vehicle/vehicleApi";

const logo = require("../../assets/images/gio-logo.png");

export default function Profile() {
  const [carTitle, setCarTitle] = useState(null);
  const [carType, setCarType] = useState(null);
  const [image, setImage] = useState(null);
  const [resImage, setResImage] = useState(null);

  const userObject = useSelector(
    (state) => Object.values(state.currentUserApi.mutations)[0].data
  );
  //
  const uploadImage = async (image) => {
    // const fil = image;
    // const filRes = image;
    // const base64 = await FileSystem.readAsStringAsync(filRes, { encoding: 'base64' });
    const base64 = image.base64;
    // console.log("uploadImage", base64);
    const formData = new FormData();
    formData.append("token", userObject.token);
    formData.append("image", base64);

    var options = {
      method: "POST",
      url: "https://www.lavaggioapp.it/wp-json/myplugin/v1/uploadAvatar",
      params: { "": ["", ""] },
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        //   'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
      },
      data: formData,
      // data: '-----011000010111000001101001\r\nContent-Disposition: form-data; name="token"\r\n\r\neyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d3dy5sYXZhZ2dpb2FwcC5pdCIsImlhdCI6MTcyMjMxMDk2MSwibmJmIjoxNzIyMzEwOTYxLCJleHAiOjE3MjI5MTU3NjEsImRhdGEiOnsidXNlciI6eyJpZCI6IjE4OSJ9fX0.R1r3jYddInZxuytlY5H3cOtYtcNyQVIYBd9KWUn_KfU\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="image"\r\n\r\n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\r\n-----011000010111000001101001--\r\n'
    };

    //   axios.post('https://www.lavaggioapp.it/wp-json/myplugin/v1/uploadAvatar', options)
    axios
      .post(
        "https://www.lavaggioapp.it/wp-json/myplugin/v1/uploadAvatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
        checkCar(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const checkCar = async (imageUrl) => {
    const form = new FormData();
    form.append("image_url", imageUrl);
    form.append("car_classifier", "true");
    form.append("car_type_classifier", "true");
    form.append("car_shoot_category", "true");
    form.append("car_interior_category", "true");
    form.append("angle_detection", "true");
    form.append("crop_detection", "true");
    form.append("distance_detection", "true");
    form.append("exposure_detection", "true");
    form.append("reflection_detection", "true");
    form.append("tilt_detection", "true");
    form.append("window_tint_detection", "true");
    form.append("tyre_mud_detection", "true");
    form.append("number_plate_detection", "true");
    const url = "https://api.spyne.ai/auto/classify/v1/image";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: "Bearer bf3154da-cf31-4d61-bdee-ad3e1a74a5d4",
      },
    };

    options.body = form;

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        console.log(json.data.validation_result.car_classifier);
        console.log(json.data.validation_result.car_type_classifier);
        console.log(json.data.validation_result.number_plate_detection);
        console.log(json.data.validation_result.tyre_mud_detection.tyres.clean);
        console.log(json.data.validation_result.tyre_mud_detection.tyres.dirty);
        setCarType(json.data.validation_result.car_type_classifier.value);
      })
      .catch((err) => console.error("error:" + err));
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      //   base64: true,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      imageResize(result);
    }
  };

  const imageResize = async (image) => {
    console.log("imageResize, image.assets[0].uri", image.assets[0].uri);
    const manipResult = await manipulateAsync(
      image.assets[0].uri,
      //[{ width: 20, {}}]
      [{ resize: { width: 400, height: 300 } }],
      //   [{ rotate: 90 }, { flip: FlipType.Vertical }],
      { compress: 1, format: SaveFormat.PNG, base64: true }
    );
    // .then(()=>{
    setResImage(manipResult);
    // console.log("manipResult", manipResult);
    await uploadImage(manipResult);
    // await checkCar(manipResult);
    // });
  };

  const [addVehicle, { data, error, isError, isLoading }] =
    vehicleApi.useAddVehicleMutation();

  const handleSave = async () => {
    Keyboard.dismiss();
    let r = await addVehicle({
      title: carTitle,
      content: carType,
      status: "publish",
    });
    console.log("r", r);
  };
  return (
    <View style={styles.content}>
      <StatusBar barStyle="dark-content" />
      <TextInput
        id="vehicleName"
        placeholder="Nome do Carro"
        mode="flat"
        onChangeText={ te=>{setCarTitle(te)} }
        value={carTitle}
      />
      <Button onPress={pickImage}>Pick an image from camera roll</Button>
      {resImage ? (
        <View>
          <Image
            source={{ uri: resImage.localUri || resImage.uri }}
            style={styles.image}
          />
          {carTitle && carType ? <Button mode="contained" icon="content-save" onPress={handleSave}>
            Save
          </Button> : <Text>Set title</Text>}
          <Text>Type: {carType} Name: {carTitle} </Text>
        </View>
      ) : (
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={require("../../assets/images/toppng.com-free-icons-car-icon-482x481.png")}
            style={styles.image}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#d8d8db",
    verticalAlign: "top",
  },
  scroll: {
    backgroundColor: "white",
    flex: 1,
  },
  userRow: {
    alignItems: "center",
    padding: 15,
    marginTop: 70,
  },

  image: {
    width: 400,
    height: 300,
  },
});
