import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const useCheckAuthentication = () => {
  const [userObject, setUserObject] = useState(null);
  const [userObjectFull, setUserObjectFull] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const userObjectA = await AsyncStorage.getItem("userObject");
        setUserObject(JSON.parse(userObjectA));
        if (userObjectA) {
          try {
            const userObjectFullA = await AsyncStorage.getItem("userObjectFull");
            if (userObjectFullA) {
              setUserObjectFull(JSON.parse(userObjectFullA));
            }
          } catch {
            console.log("No userObjectFull found");
            logout();
          }
          global.TOKEN = JSON.parse(userObjectA).token;
        } else {
          console.log("No userObject found");
          logout();
        }
      } catch (error) {
        console.error("Failed to check AsyncStorage.", error);
      }
    };

    checkAuthentication();
  }, [navigation]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userObject");
      await AsyncStorage.removeItem("userObjectFull");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Failed to log out.", error);
    }
  };

  return { userObject, userObjectFull, logout };
};
