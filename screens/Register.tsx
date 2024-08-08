import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Title, withTheme, useTheme } from "react-native-paper";

export default function Regisetr() {
  const { colors } = useTheme();
  return (
    <View style={styles.infoContainer}>
      <Title
        style={{
          backgroundColor: colors.primary,
          color: colors.background,
          width: "100%",
          textAlign: "center",
          padding: 5,
          fontSize: 22,
        }}
      >
        Registrati{" "}
      </Title>
      <Text
        style={{
          fontSize: 20,
          padding: 20,
        }}
      >
        Registrazione solo su invito
      </Text>
      <Title
        style={{
          backgroundColor: colors.primary,
          color: colors.background,
          width: "100%",
          textAlign: "center",
          padding: 5,
          fontSize: 22,
        }}
      >
        Sono un autolavaggio
      </Title>
      <Text
        style={{
          fontSize: 20,
          padding: 20,
        }}
      >
        Stiamo registrando i partner nella fase beta per lavorare sulla
        piattaforma, il modulo di registrazione sarà presto disponibile
      </Text>
      <Text
        style={{
          fontSize: 20,
          padding: 10,
        }}
      >
        Contatto
      </Text>
      <Text
        style={{
          fontSize: 20,
          padding: 5,
          textAlign: "center",
        }}
      >
        per maggiori informazioni contattare il:{"\n"}
        contatto@lavaggioapp.it
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoText: {
    fontSize: 16,
    marginLeft: 20,
    color: "gray",
    fontWeight: "500",
  },
  infoContainer: {
    paddingTop: 20,
    paddingBottom: 12,
    alignItems: "center",
  },
});
