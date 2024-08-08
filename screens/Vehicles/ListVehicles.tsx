import { StyleSheet, View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from 'react-redux'
import vehicleApi from "../../api/vehicle/vehicleApi";
import LoadingModal from "../LoadingModal";
// import { getVehicles } from '../../api/vehicle/vehicleSlice-offline';
// import { useLoginUserMutation } from "../../api/currentUserApi/currentUserApi"
// import currentUserApi from '../../api/currentUserApi/currentUserApi';
// import currentUser from '../../api/currentUserApi/currentUserSlice'
import { currentUserSlice } from '../../api/currentUserApi/currentUserSlice';

const ListVehicles = () => {
  const userObject = useSelector((state) => Object.values(state.currentUserApi.mutations)[0].data )
  const userObjectFull = useSelector( (state) => Object.values(state.currentUserApi.mutations)[1].data ) //[0].data
  //console.log("userObjectF", userObjectFull.id)

  const { data, error, isError, isLoading } = vehicleApi.useGetVehiclesByUserIdQuery(userObjectFull.id);
  useEffect(()=>{
    // data ? console.log("ListVehicles vehicleApi data[0]", data[0]) : null;
  })
  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingModal isLoading={isLoading} />
      ) : (
        <View>
        <Text>Macchinas de {userObject.user_display_name}</Text>
        <FlatList
          data={data}
          style={styles.list}
          renderItem={({ item }) => {
            return (
              <View style={styles.listItem}>
                <Text> A { item.token }</Text>
                <View style={styles.textContainer}>
                  <Text style={styles.listItemTitle}>{item.title.rendered}</Text>
                  <Text>
                    Username: { item.slug } 
                    Type: {item.vehicle_type} 
                    Veh: { JSON.stringify(item.content) }
                    {/* ACF vehicle_type { JSON.stringify(item.acf.vehicle_type) } */}
                  </Text>
                </View>
              </View>
            );
          }}
        />
        </View>
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
