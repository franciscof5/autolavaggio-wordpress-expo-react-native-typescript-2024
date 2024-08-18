import { StyleSheet, View, Text, FlatList, Image, Button } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import vehicleApi from "../../api/vehicle/vehicleApi";
import LoadingModal from "../LoadingModal";
import {
  FAB,
  List,
  MD3Colors,
  Avatar,
  Modal,
  Portal,
} from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useCheckAuthentication } from "../../api/hooks/useCheckAuthentication";

const ListVehicles = () => {
  const { userObject, userObjectFull, logout } = useCheckAuthentication();
  //
  const [selectedVehicleId, setSelectedVehicleId] = React.useState(false);
  const [selectedVehicleTitle, setSelectedVehicleTitle] = React.useState(false);
  const [selectedVehicleAddress, setSelectedVehicleAddress] =
    React.useState(false);
  //
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  // const userObject = AsyncStorage.getItem('userObject');
  // const userObjectFull = AsyncStorage.getItem('userObjectFull');

  // const { data, error, isError, isLoading } =
  //                   vehicleApi.useGetVehiclesByUserIdQuery(null);

  const buy = async () => {
    console.log("buy");
    showModal();
    // setSelectedVehicleId(id);
    // setSelectedVehicleTitle(title);
    // setSelectedVehicleAddress(address);
    // const storeData = async () => {
    try {
      await AsyncStorage.setItem(
        "order",
        JSON.stringify({
          user_display_name: userObject.user_display_name,
          id: selectedVehicleId,
          title: selectedVehicleTitle,
          address: selectedVehicleAddress,
        })
      );
      navigation.navigate("CreditCard");
    } catch (e) {
      console.log("e", e);
      // saving error
    }
    // };
  };

  // Hook fora de condicionais
  const { data, error, isError, isLoading } =
    vehicleApi.useGetVehiclesByUserIdQuery(
      userObject && userObjectFull
        ? { token: userObject.token, id: userObjectFull.id }
        : skipToken
    );

  if (!userObject || !userObjectFull) {
    return <Text>Loading...</Text>;
  }
  // console.log("2 userObject ", userObject);
  // console.log("2 userObjectFull ", userObjectFull);
  
  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingModal isLoading={isLoading} />
      ) : (
        <View>
          {/* <Text>Macchinas de {userObject.user_display_name}</Text> */}
          <List.Section style={styles.listList}>
            {data.map((item) => {
              return (
                <List.Item
                  style={styles.listItem}
                  title={item.title.rendered}
                  key={item.id}
                  description={JSON.parse(item.content.raw).vehicle_address}
                  onPress={() => {
                    showModal();
                    setSelectedVehicleId(item.id);
                    setSelectedVehicleTitle(item.title.rendered);
                    setSelectedVehicleAddress(
                      JSON.parse(item.content.raw).vehicle_address
                    );
                    console.log("AGENDA");
                  }}
                  left={() => (
                    <Image
                      source={{
                        uri: item.featured_image_url,
                      }}
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 10,
                      }}
                    />
                  )}
                />
              );
            })}
          </List.Section>
        </View>
      )}
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modal}
        // style={styles.modal}
      >
        <Text style={styles.modalText}>
          Services available for: {"\n"} {selectedVehicleTitle}, at{" "}
          {selectedVehicleAddress}{" "}
        </Text>
        <List.Section style={styles.listList}>
          <List.Item
            title="Delivery Eco Wash"
            style={styles.listItem}
            onPress={() => {
              buy();
            }}
            description="EURO 15"
            left={() => (
              <Image
                source={require("./../../assets/images/car-wash-png-black-and-white-transparent-car-wash-black-and-white-638077.jpg")}
                style={{
                  width: 56,
                  height: 56,
                }}
              />
            )}
          />
        </List.Section>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#FFF",
  },
  list: {
    padding: 10,
  },
  listList: {
    paddingHorizontal: 12,
    // backgroundColor: "#09d",
  },
  listItem: {
    backgroundColor: "#EEE",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  listItemTitle: {
    fontWeight: "bold",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    height: "60%",
    paddingBottom: 50,
    position: "absolute",
    bottom: -50,
    zIndex: 9999999,
    width: "100%",
  },
  modalText: {
    // fontWeight: "bold",
    textAlign: "center",
  },
  textContainer: {
    flex: 1,
  },
});

export default ListVehicles;
