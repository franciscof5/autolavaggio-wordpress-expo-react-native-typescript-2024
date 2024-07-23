import { StyleSheet, View, Text, FlatList } from "react-native";
import React from "react";
import vehicleApi from "../../api/vehicle/vehicleApi";
import LoadingModal from "../LoadingModal";

const ListVehicles = () => {
  const { data, error, isError, isLoading } = vehicleApi.useGetUsersQuery();

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingModal isLoading={isLoading} />
      ) : (
        <FlatList
          data={data}
          style={styles.list}
          renderItem={({ item }) => {
            return (
              <View style={styles.listItem}>
                <View style={styles.textContainer}>
                  <Text style={styles.listItemTitle}>Name: {item.name}</Text>
                  <Text>Username: {item.username}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      height: "60%",
    },
    list: {
      padding: 10,
    },
    listItem: {
      flexDirection: "row",
      padding: 10,
    },
    listItemTitle: {
      fontWeight: "bold",
    },
    textContainer: {
      flex: 1,
    },
  });

export default ListVehicles;
