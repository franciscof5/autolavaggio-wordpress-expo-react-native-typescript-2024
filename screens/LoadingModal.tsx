import { StyleSheet, View, Text, Modal, ActivityIndicator } from "react-native";
import React from "react";

const LoadingModal = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Modal
      style={styles.modal}
      animationType="slide"
      transparent={true}
      visible={isLoading}
      onRequestClose={() => console.log("Request close")}
    >
      <View style={styles.modalContainer}>
        <ActivityIndicator size={60} color="#5fc4e3" />
        <Text style={{color:"#5fc4e3", fontSize:20, marginTop:10}}>Loading...</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {},
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
});


export default LoadingModal;
