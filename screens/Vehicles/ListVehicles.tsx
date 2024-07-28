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
  const { data, error, isError, isLoading } = vehicleApi.useGetVehiclesByUserIdQuery(2);
  // console.log("data", data);
  
  // const [loginUser, {data2}] = useLoginUserMutation();
  // useSelector((state) => console.log(Object.values(state.currentUserApi.mutations)[0].data ) )
  
  // Aconst userObject = useSelector((state) => Object.values(state.currentUserApi.mutations)[0].data )
  
  const userObject = {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d3dy5sYXZhZ2dpb2FwcC5pdCIsImlhdCI6MTcyMjE3ODEzOSwibmJmIjoxNzIyMTc4MTM5LCJleHAiOjE3MjI3ODI5MzksImRhdGEiOnsidXNlciI6eyJpZCI6IjE4OSJ9fX0.zToPgSZjdIjY-MmsU_XdH3M_dDgJbgFDAwRd9XlUSCc", 
    "user_display_name": "Loja da Foca", 
    "user_email": "foca@pomodoros.com.br", 
    "user_nicename": "foca"
  }
  // const [getVehiclesByUserId,{ data, error, isError, isLoading }] = vehicleApi.useGetVehiclesByUserIdQuery();
  // const [loginUser, { data, error, isError, isLoading }] = currentUserApi.useLoginUserMutation();
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
                  <Text>Username: {item.slug}</Text>
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
