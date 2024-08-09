import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import {
  Icon,
  Text,
  TextInput,
  Button,
  MD3Colors,
  FAB,
  Snackbar,
} from "react-native-paper";
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
  const [carTitle, setCarTitle] = useState("Ti");
  const [carType, setCarType] = useState(null);
  const [carAddress, setCarAddress] = useState(null);
  const [image, setImage] = useState(null);
  const [imageLowRes, setImageLowRes] = useState(null);
  const [wpMediaId, setWpMediaId] = useState(null);
  const [visibleSnack, setVisibleSnack] = React.useState(false);
  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);
  const onDismissSnackBar = () => setVisibleSnack(false);
  const [step, setStep] = useState(1);
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
  {
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
          setWpMediaId(response.data.id);
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
          console.log(
            json.data.validation_result.tyre_mud_detection.tyres.clean
          );
          console.log(
            json.data.validation_result.tyre_mud_detection.tyres.dirty
          );
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
      setImageLowRes(manipResult);
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
        content: JSON.stringify({
          vehicle_type: carType,
          vehicle_location: "location",
        }),
        status: "publish",
        token: userObject.token,
        featured_media: wpMediaId ? wpMediaId : 100,
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
      })
      // .then(async(location)=>{
      const getAdd = async(location) => {
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}&format=json`);
          const { house_number, road, postcode, country } = response.data.address;
          const addressComponents = [house_number, road, postcode, country];
          const currentAddress = addressComponents.filter(component => component).join(', ');
          console.log("currentAddress", currentAddress);
          setCarAddress(currentAddress);
        } catch (error) {
          console.error('Error performing reverse geocoding:', error);
        }
      }
      getAdd(location);
      // });
      console.log("userLocation location", location);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.018,
        longitudeDelta: 0.002,
      });
    };
  }

  const ScreenCancel = () => (
    <View>
      <Text>Cancelar adicionar Carro?</Text>
      <Button onPress={() => navigation.navigate("HomeMap")}>Voltar</Button>
      <Button onPress={() => setStep(1)}> Continuar </Button>
    </View>
  );

  const ScreenCarName = () => (
    <View style={styles.content}>
      <Text style={styles.textTitle}>Nome dell'auto</Text>
      <TextInput
        id="vehicleName"
        placeholder="Esempio: l'auto di mia moglie"
        mode="flat"
        style={styles.textInput}
        onChangeText={(text) => {
          setCarTitle(text);
        }}
        value={carTitle}
      />
      <Text style={{ margin: 8, marginLeft: 16, color: "red" }}>
        {visibleSnack ? "Campo obbligatorio" : ""}
      </Text>
      <NavButtonsArrows
        nextStep="2"
        prevTitle="Cancel"
        nextTitle="Car Type"
      />
    </View>
  );

  const ScreenLocation = () => (
    <View style={styles.content2}>
      <Text style={styles.textTitle}>Indirizzo di lavaggio</Text>

      <MapView style={styles.map} region={mapRegion}>
        <Marker title="Io" coordinate={mapRegion} />
      </MapView>
      <TextInput
        id="vehicleName"
        placeholder="cercando l'indirizzo della tua posizione..."
        mode="flat"
        style={styles.textInput}
        onChangeText={(text) => {
          setCarAddress(text);
        }}
        value={carAddress}
      />
      <Text style={{position:"relative", marginTop:-45}}>  <Icon source="map-marker" size={30}/></Text>
      <NavButtonsArrows
        nextStep="3"
        prevTitle="Car Name"
        nextTitle="Car Picture"
      />
    </View>
  );

  const ScreenPicture = () => (
    <View>
      {imageLowRes ? (
        <View>
          <Image
            source={{ uri: imageLowRes.localUri || imageLowRes.uri }}
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
        <Button
          mode="contained-tonal"
          onPress={pickImage}
          icon="view-grid"
          style={styles.buttonItem}
        >
          Gallery
        </Button>
        <Button
          mode="contained-tonal"
          onPress={takePicture}
          icon="camera"
          style={styles.buttonItem}
        >
          Take Picture
        </Button>
      </View>
    </View>
  );

  const ScreenSave = () => (
    <View>
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

  const NavButtonsArrows = (props: nextStep, nextTitle, prevTitle) => (
    <View style={styles.buttonGroup}>
      <TouchableOpacity
        style={styles.buttonNav}
        onPress={() => {
          setStep(props.nextStep-2)
        }}      >
        <Icon source="arrow-left" size={50} />
        <Text style={{ width: "100%", textAlign: "center" }}>
          {props.prevTitle}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonNav}
        onPress={() => {
          console.log("carTitle", carTitle);
          carTitle ? setStep(props.nextStep) : onToggleSnackBar();
        }}
      >
        <Icon source="arrow-right" size={50} />
        <Text style={{ width: "100%", textAlign: "center" }}>
          {props.nextTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.content}>
      <StatusBar barStyle="dark-content" />
      {step == 0 && <ScreenCancel />}
      {step == 1 && <ScreenCarName />}
      {step == 2 && <ScreenLocation />}
      <Snackbar
        visible={visibleSnack}
        onDismiss={onDismissSnackBar}
        action={{ label: "chiudere" }}
      >
        campo obbligatorio
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#FFF",
    // verticalAlign: "middle",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
    // width: "100%",
    // backgroundColor: "#DDD",
  },
  content2: {
    flex: 1,
    // backgroundColor: "#AAA",
    width: "100%",
    height: "100%",
  },
  textTitle: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 30,
  },
  buttonGroup: {
    // position:"absolute",
    zIndex: 20,
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "#99d",
    justifyContent: "center",
  },
  buttonNav: {
    width: "50%",
    paddingBottom: 20,
    maxWidth: 150,
    // display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // textAlign: "center",
    borderRadius: 100,
    height: 150,
    // backgroundColor: "#FFF",
    
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
  textInput: {
    fontSize: 20,
    paddingLeft: 24,
  },
  map: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
  },
  
  buttonItem: {
    width: "50%",
    // flexDirection:"row"
  },
});
