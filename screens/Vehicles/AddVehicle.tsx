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
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const logo = require("../../assets/images/gio-logo.png");

export default function Profile({ navigation }) {
  const [carTitle, setCarTitle] = useState(null);
  const [carType, setCarType] = useState(null);
  const [image, setImage] = useState(null);
  const [resImage, setResImage] = useState(null);
  const [mediaid, setMediaid] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 41.8905,
    longitude: 12.4942,
    latitudeDelta: 30,
    longitudeDelta: 12,
  });
  
  const userObject = useSelector(
    (state) => Object.values(state.currentUserApi.mutations)[0].data
  );
  //
  const uploadImage = async (image) => {
    const base64 = image.base64;
    const formData = new FormData();
    formData.append("token", userObject.token);
    formData.append("image", base64);

    var options = {
      method: "POST",
      url: "https://www.lavaggioapp.it/wp-json/myplugin/v1/uploadAvatar",
      params: { "": ["", ""] },
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
      data: formData,
    };

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
        setMediaid(response.data.id);
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

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
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
    await checkCar(manipResult);
    // });
  };

  const [addVehicle, { data, error, isError, isLoading }] =
    vehicleApi.useAddVehicleMutation();

  const handleSave = async () => {
    Keyboard.dismiss();
    let r = null;

    r = await addVehicle({
      title: carTitle,
      content: JSON.stringify( {vehicle_type:carType, vehicle_location:"location"} ),
      status: "publish",
      token: userObject.token,
      featured_media: mediaid ? mediaid : 100,
    }).then((data) => {
      console.log(data);
      if (data.data.id) {
        navigation.navigate("HomeMap");
      }
    });
    
    console.log("r", r, mapRegion);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
    userLocation();
  }, [navigation]);

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log("userLocation status", status);
    if (status !== "granted") {
      console.log("need location");
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    console.log("userLocation location", location);
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.018,
      longitudeDelta: 0.002,
    });
  };

  return (
    <View style={styles.content}>
      <StatusBar barStyle="dark-content" />
      <TextInput
        id="vehicleName"
        placeholder="Nome dell'auto"
        mode="outlined"
        onChangeText={(text) => {
          setCarTitle(text);
        }}
        value={carTitle}
      />
      <MapView style={styles.map} region={mapRegion}>
        <Marker title="Io" coordinate={mapRegion} />
      </MapView>
      {resImage ? (
        <View>
          <Image
            source={{ uri: resImage.localUri || resImage.uri }}
            style={styles.image}
          />
        </View>
      ) : (
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={require("../../assets/images/add-car.png")}
            style={styles.image}
          />
        </TouchableOpacity>
      )}
      <View style={styles.buttonGroup}>
        <Button mode="contained-tonal" onPress={pickImage} icon="view-grid" style={styles.buttonItem}>
          Gallery
        </Button>
        <Button mode="contained-tonal" onPress={takePicture} icon="camera" style={styles.buttonItem}>
          Take Picture
        </Button>
      </View>
      {carTitle && carType ? (
        <Button mode="contained" icon="content-save" onPress={handleSave}>
          Save
        </Button>
      ) : (
        <Text style={styles.textBottom}>
          Devi impostare un titolo e caricare una foto dell'auto prima di
          salvare
        </Text>
      )}
      <Text style={styles.textBottom}>Type: {carType}</Text>
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
  textBottom: {
    fontSize: 20,
  },
  map: {
    width: "100%",
    height: 200,
  },
  buttonGroup: {
    // position:"absolute",
    zIndex:20,
    marginTop:-80,
    display: "flex",
    flexDirection:"row"
  },
  buttonItem: {
    width: "50%",
    // flexDirection:"row"
  }
});
