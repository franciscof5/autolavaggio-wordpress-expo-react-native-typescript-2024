import { useEffect, useState, useLayoutEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  Keyboard,
} from "react-native";
import {
  CreditCardView,
  CreditCardInput,
  LiteCreditCardInput,
  CreditCardFormData,
  CreditCardFormField,
  ValidationState,
} from "react-native-credit-card-input";
import { useSelector } from "react-redux";
import { Button, Searchbar } from "react-native-paper";
import serviceOrderApi from "../api/serviceOrder/serviceOrderApi";
import LoadingModal from "../LoadingModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import React = require("react");
import { useNavigation } from "@react-navigation/native";
import { useCheckAuthentication } from "../api/hooks/useCheckAuthentication";


const toStatusIcon = (status?: ValidationState) =>
  status === "valid" ? "✅" : status === "invalid" ? "❌" : "❓";

export default function Example() {
  const { userObject, userObjectFull, logout } = useCheckAuthentication();
  const [order, setOrder] = useState(null);
  const [useLiteInput, setUseLiteInput] = useState(false);
  const [focusedField, setFocusedField] = useState<CreditCardFormField>();
  const [formData, setFormData] = useState<CreditCardFormData>();
  const [loadingVoucher, setLoadingVoucher] = useState(false)
  const navigation = useNavigation();

  const [addServiceOrder, { data, error, isError, isLoading }] =
  serviceOrderApi.useAddServiceOrderMutation();

  const pay = async () => {
    Keyboard.dismiss();
    // await uploadImage(manipResult);

    let r = null;

    r = await addServiceOrder({
      title: "Order from " + order.user_display_name,
      token: userObject.token,
      content: JSON.stringify({
        VehicleID: 2,
        ProviderID: 5, // sera definido no futuro
        vehicle_id: order.id,
        vehicle_title: order.title,
        vehicle_address: order.address,
        // Data: "12/02/2024",
        // vehicle_type: carType,
        // vehicle_address: carAddress,
        // vehicle_position: {
        //   latitude: mapRegion.latitude,
        //   longitude: mapRegion.longitude,
        // },
      }),
      status: "pending",
      // token: userObject.token,
      // featured_media: wpMediaId ? wpMediaId : null,
    }).then((data) => {
      console.log(data);
      if (data.data.id) {
        console.log("Order created");
        navigation.navigate("Home");
      }
    });

    console.log("r", r);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        let jsonValue = await AsyncStorage.getItem("order");
        jsonValue != null ? (jsonValue = JSON.parse(jsonValue)) : null;
        // JSON.parse(jsonValue)
        console.log("getData jsonValue", jsonValue.address);
        setOrder(jsonValue);
        // return jsonValue;
      } catch (e) {
        // error reading value
        console.log("e", e);
      }
    };
    order ? null : getData();
  });

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={{ textAlign: "center", width: "80%", marginLeft: "10%" }}>
        Order - {/* { order.title }, { order.addrress } */}
        {order ? order.title : "loading..."},{" "}
        {order ? order.address : "loading..."}, EUR 15
      </Text>
      {/* <Switch
        style={s.switch}
        onValueChange={(v) => {
          setUseLiteInput(v);
          setFormData(undefined);
        }}
        value={useLiteInput}
      /> */}

      <CreditCardView
        focusedField={focusedField}
        type={formData?.values.type}
        number={formData?.values.number}
        expiry={formData?.values.expiry}
        cvc={formData?.values.cvc}
        style={s.cardView}
      />

      {useLiteInput ? (
        <LiteCreditCardInput
          autoFocus
          style={s.cardInput}
          onChange={setFormData}
          onFocusField={setFocusedField}
        />
      ) : (
        <CreditCardInput
          autoFocus
          style={s.cardInput}
          onChange={setFormData}
          onFocusField={setFocusedField}
        />
      )}
      <Searchbar 
        mode="bar"
        // right=""
        traileringIcon="cash-plus"
        loading={loadingVoucher}
        // elevation="1"
        // inputStyle={{backgroundColor:"#EEE"}}
        icon="ticket-percent"
        style={{margin: "5%"}}
        onChangeText={()=>{
          console.log("VOUCHE"); 
          setTimeout(()=>{setLoadingVoucher(false)}, 1000);
          setLoadingVoucher(true)}
        }
        onIconPress={()=>{
          console.log("VOUCHE"); 
          setTimeout(()=>{setLoadingVoucher(false)}, 1000);
          setLoadingVoucher(true)}
        }
        placeholder="Optional: do you have a voucher?"
      />
      <Button
        onPress={() => {
          console.log("PAY");
          pay();
        }}
        mode="contained"
        style={{ width: "50%", marginLeft: "25%" }}
        disabled={formData?.valid ? false : true}
      >
        PAGAR EUR 15
      </Button>
      <View style={s.infoContainer}>
        <Text style={s.info}>
          {formData?.valid
            ? "✅ Possibly valid card"
            : "❌ Invalid/Incomplete card"}
        </Text>

        {/* <Text style={s.info}>
          {toStatusIcon(formData?.status.number)}
          {" Number\t: "}
          {formData?.values.number}
        </Text>

        <Text style={s.info}>
          {toStatusIcon(formData?.status.expiry)}
          {" Expiry\t: "}
          {formData?.values.expiry}
        </Text>

        <Text style={s.info}>
          {toStatusIcon(formData?.status.cvc)}
          {" Cvc   \t: "}
          {formData?.values.cvc}
        </Text> */}

        <Text style={s.info}>
          {"ℹ️ Type  \t: "}
          {formData?.values.type}
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 600,
    marginHorizontal: "auto",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginTop: 60,
  },
  switch: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  cardView: {
    alignSelf: "center",
    marginTop: 15,
  },
  cardInput: {
    marginTop: 15,
    borderColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  infoContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "#dfdfdf",
    borderRadius: 5,
  },
  info: {
    fontFamily: Platform.select({
      ios: "Courier",
      android: "monospace",
      web: "monospace",
    }),
  },
});
