import { useState } from "react";
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
import { Button } from "react-native-paper";
import orderApi from "../api/order/orderApi";
import LoadingModal from "../LoadingModal";

const toStatusIcon = (status?: ValidationState) =>
  status === "valid" ? "✅" : status === "invalid" ? "❌" : "❓";

export default function Example() {
  const [useLiteInput, setUseLiteInput] = useState(false);

  const [focusedField, setFocusedField] = useState<CreditCardFormField>();

  const [formData, setFormData] = useState<CreditCardFormData>();

  const userObject = useSelector(
    (state) => Object.values(state.currentUserApi.mutations)[0].data
  );

  const [addOrder, { data, error, isError, isLoading }] =
    orderApi.useAddOrderMutation();

  const pay = async () => {
    Keyboard.dismiss();
    // await uploadImage(manipResult);

    let r = null;

    r = await addOrder({
      title: "Order from",
      token: userObject.token,
      content: JSON.stringify({
        VehicleID: 2,
        ProviderID: 5, // sera definido no futuro
        Status: 2,
        Data: "12/02/2024",
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
        // navigation.navigate("Home");
      }
    });

    console.log("r", r, mapRegion);
  };

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Switch
        style={s.switch}
        onValueChange={(v) => {
          setUseLiteInput(v);
          setFormData(undefined);
        }}
        value={useLiteInput}
      />

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
