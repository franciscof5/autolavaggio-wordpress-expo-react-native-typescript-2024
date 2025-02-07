import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import vehicleApi from "../../api/vehicle/vehicleApi";
import LoadingModal from "../LoadingModal";
import { List, MD3Colors, Avatar } from "react-native-paper";
import { AppState } from "../interfaceLogin";

const ListVehicles = () => {
  const userObject = useSelector(
    (state: AppState) => Object.values(state.currentUserApi.mutations)[0]?.data
  );
  const userObjectFull = useSelector(
    (state: AppState) => Object.values(state.currentUserApi.mutations)[1]?.data
  );

  const { data, error, isError, isLoading } =
    vehicleApi.useGetVehiclesByUserIdQuery({
      token: userObject.token,
      id: userObjectFull.id,
    });
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
                  description={JSON.parse(item.content.raw).vehicle_address}
                  onPress={() => console.log("AGENDA")}
                  left={() => (
                    <Image
                      source={{
                        uri: item.featured_image_url,
                      }}
                      style={{
                        width: 56,
                        height: 56,
                      }}
                    />
                    // <Avatar.Image size={24} source={require(item.featured_image_url)} />
                    //<List.Icon color={MD3Colors.tertiary70} icon="folder" />
                  )}

                  // left={() => const MyComponent = () => (
                  //   <Avatar.Image size={24} source={item.featured_image_url} />
                  //   // <List.Icon icon= />}
                  // )}
                />
              );
            })}
          </List.Section>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  list: {
    padding: 10,
  },
  listList: {
    paddingHorizontal: 12,
    // backgroundColor: "#09d",
  },
  listItem: {
    // flexDirection: "row",
    // backgroundColor: "#FFF",
    // marginBottom:4,
    // padding: 3,
  },
  listItemTitle: {
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
  },
});

export default ListVehicles;
