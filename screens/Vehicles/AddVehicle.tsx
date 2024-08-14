import React, { useState, useEffect } from "react";
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
  Searchbar,
} from "react-native-paper";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import vehicleApi from "../../api/vehicle/vehicleApi";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Title } from "react-native-paper";

const logo = require("../../assets/images/gio-logo.png");

export default function Profile({ navigation }) {
  const [carTitle, setCarTitle] = useState(null);
  const [carType, setCarType] = useState(null);
  const [carAddress, setCarAddress] = useState(null);
  const [image, setImage] = useState(null);
  const [imageLowRes, setImageLowRes] = useState(null);
  const [wpMediaId, setWpMediaId] = useState(null);
  const currentPlace = {
    description: "Current Location",
    geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
  };
  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm<FormFields>();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      carTitleF: carTitle,
      carAddressF: carAddress,
      mapRegionF: null,
    },
  });
  useEffect(() => {
    if (carAddress) {
      // setValue([{ carAddressF: carAddress }]);
    }
  }, [carAddress]);
  //
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
        console.log("uploadMedia", response.data);
        setWpMediaId(response.data.id);
      })
      .catch(function (error) {
        console.error("uploadMedia", error);
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
    setImageLowRes(manipResult);
    // console.log("manipResult", manipResult);
    await uploadImage(manipResult);
    // await checkCar(manipResult);
    // });
  };

  const [addVehicle, { data, error, isError, isLoading }] =
    vehicleApi.useAddVehicleMutation();

  const handleSave = async () => {
    Keyboard.dismiss();
    
    // await uploadImage(manipResult);
    
    let r = null;

    r = await addVehicle({
      title: getValues("carTitleF"),
      content: JSON.stringify({
        // vehicle_type: carType,
        vehicle_address: carAddress,
        vehicle_position: {
          latitude: mapRegion.latitude,
          longitude: mapRegion.longitude,
        }
      }),
      status: "publish",
      token: userObject.token,
      featured_media: wpMediaId ? wpMediaId : null,
    }).then((data) => {
      console.log(data);
      if (data.data.id) {
        navigation.navigate("Home");
      }
    });

    console.log("r", r, mapRegion);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft: () => null,
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
    const getAdd = async (location) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}&format=json`
        );
        const { house_number, road, postcode, country } = response.data.address;
        const addressComponents = [house_number, road, postcode, country];
        const currentAddress = addressComponents
          .filter((component) => component)
          .join(", ");
        console.log("currentAddress", currentAddress);
        setCarAddress(currentAddress);
        setValue("carAddressF", currentAddress);
      } catch (error) {
        console.error("Error performing reverse geocoding:", error);
      }
    };
    getAdd(location);
    console.log("userLocation location", location);
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.018,
      longitudeDelta: 0.002,
    });
  };

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
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            {...register("carTitleF")}
            onBlur={onBlur}
            onChangeText={(e) => {
              console.log("inside percentage controller >>>>>>>", e);
              setValue("carTitleF", e);
            }}
            value={value}
            style={styles.textInput}
            mode="flat"
            placeholder="Es: l'auto di mia moglie"
          />
        )}
        name="carTitleF"
      />
      {errors.carTitleF && <Text>This is required.</Text>}

      <Text style={{ margin: 8, marginLeft: 16, color: "red" }}>
        {visibleSnack ? "Campo obbligatorio" : ""}
      </Text>
      <NavButtonsArrows
        nextStep="2"
        prevTitle="Cancel"
        nextTitle="Car Type"
        emptyCheck={getValues("carTitleF")}
      />
    </View>
  );

  const ScreenLocation = () => (
    <View style={styles.content2}>
      <Text style={styles.textTitle}>Indirizzo di lavaggio</Text>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <GooglePlacesAutocomplete
            placeholder={carAddress}
            onPress={(data, details = null) => {
              console.log(details.address_components);
              setCarAddress(details.formatted_address);
              setMapRegion({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.018,
                longitudeDelta: 0.002,
              });
            }}
            // value={carAddressF}
            fetchDetails={true}
            onFail={(error) => console.error(error)}
            onNotFound={() => console.log("no results")}
            query={{
              key: global.PLACES_API,
              language: "en",
            }}
            // predefinedPlaces={[currentPlace]}
            textInputProps={{
              InputComp: TextInput,
              // icon:{icon:"map-marker"},
              icon: "map-marker",
              // style:{styles.GooglePlacesAutocomplete},
              leftIcon: { type: "font-awesome", name: "chevron-left" },
              errorStyle: { color: "red" },
            }}
          />
        )}
        name="carAddressF"
      />
      {errors.carAddressF && <Text>This is required.</Text>}
      <MapView style={styles.map} region={mapRegion}>
        <Marker title="Io" coordinate={mapRegion} />
      </MapView>

      <NavButtonsArrows
        nextStep="3"
        prevTitle="Car Name"
        nextTitle="Car Picture"
        emptyCheck={getValues("carAddressF")}
      />
    </View>
  );

  const ScreenPicture = () => (
    <View >
      <Text style={styles.textTitle}>Picture</Text>
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
      <View style={styles.NavButtonsArrows}>
        <Button
          mode="contained-tonal"
          onPress={pickImage}
          icon="view-grid"
          style={styles.buttonItem}
          labelStyle={{ fontSize: 25, height:40, lineHeight:36 }}
        >
          Gallery
        </Button>
        <Button
          mode="contained-tonal"
          onPress={takePicture}
          icon="camera"
          style={styles.buttonItem}
          labelStyle={{ fontSize: 25, height:40, lineHeight:36 }}
        >
          Camera
        </Button>
      </View>
      <NavButtonsArrows
        nextStep="4"
        prevTitle="Car Location"
        nextTitle="Save"
        emptyCheck={imageLowRes}
      />
    </View>
  );

  const ScreenSave = () => (
    <View style={styles.content}>
      <Text style={styles.textTitle}>{getValues("carTitleF")}</Text>
      <Text style={styles.textTitleM}>{getValues("carAddressF")}</Text>
      <Image
        source={{ uri: imageLowRes.localUri || imageLowRes.uri }}
        style={styles.image}
      />
      <View style={styles.NavButtonsArrows}>
        <Button
          mode="outlined"
          icon="arrow-left"
          style={styles.buttonItem}
          onPress={() => setStep(3)}
          labelStyle={{ fontSize: 25, height:40, lineHeight:36 }}
        >
          Voltar
        </Button>
        <Button
          mode="contained-tonal"
          icon="content-save"
          style={styles.buttonItem}
          onPress={handleSave}
          labelStyle={{ fontSize: 25, height:40, lineHeight:36 }}
        >
          Salvar
        </Button>
      </View>
      <Text>.</Text>
    </View>
  );

  // const onSubmit = async (data) => {
  //   await uploadImage(manipResult);
  //   console.log(data);
  // };

  const NavButtonsArrows = (
    props: nextStep,
    nextTitle,
    prevTitle,
    emptyCheck
  ) => (
    <View style={styles.NavButtonsArrows}>
      <TouchableOpacity
        style={styles.buttonNav}
        onPress={() => {
          setStep(props.nextStep - 2);
        }}
      >
        <Icon source="arrow-left" size={50} />
        <Text style={{ width: "100%", textAlign: "center", fontSize:20 }}>
          {props.prevTitle}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonNav}
        onPress={() => {
          console.log("emptyCheck", props.emptyCheck);
          props.emptyCheck !== "" &&
          props.emptyCheck !== undefined &&
          props.emptyCheck !== null
            ? setStep(props.nextStep)
            : onToggleSnackBar();
        }}
      >
        <Icon source="arrow-right" size={50} />
        <Text style={{ width: "100%", textAlign: "center", fontSize:20 }}>
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
      {step == 3 && <ScreenPicture />}
      {step == 4 && <ScreenSave />}

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
    // paddingBottom: 100,
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
    backgroundColor: "#FFF",
    padding: 5,
  },
  textTitleM: {
    fontSize: 20,
    marginBottom: 30,
  },
  NavButtonsArrows: {
    zIndex: 20,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
  buttonNav: {
    width: "40%",
    margin: "5%",
    // paddingBottom: 20,
    maxWidth: 120,
    // display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // textAlign: "center",
    borderRadius: 120,
    height: 120,
    // backgroundColor: "#9FF",
  },
  buttonItem: {
    width: "44%",
    margin: "3%",
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
    borderRadius: 10,
    borderBottomWidth: 0,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  map: {
    width: "100%",
    height: "100%",
    // backgroundColor: "#000",
    zIndex: -10,
    flex: 1,
    // marginTop: 100,
    position: "absolute",
  },
  GooglePlacesAutocomplete: {
    zIndex: 10,
    position: "absolute",
    backgroundColor: "#EEE",
    fontSize: 20,
  },
});

/*
const mockCarTypes = {
  types: [
    {
      name: "Micro",
      image: require("../../assets/images/car-types/micro-car-13314.png"),
    },
    {
      name: "Hatchback",
      image: require("../../assets/images/car-types/hatchback-car-13312.png"),
    },
    {
      name: "Sedan",
      image: require("../../assets/images/car-types/sedan-car-13311.png"),
    },
    {
      name: "SUV",
      image: require("../../assets/images/car-types/suv-car-13321.png"),
    },
    {
      name: "Pickup",
      image: require("../../assets/images/car-types/pickup-car-13322.png"),
    },
    {
      name: "Van",
      image: require("../../assets/images/car-types/van-truck-car-13329.png"),
    },
    {
      name: "Cabriolet",
      image: require("../../assets/images/car-types/cabriolet-car-13316.png"),
    },
    {
      name: "Bus",
      image: require("../../assets/images/car-types/bus-13331.png"),
    },
  ],
};*/