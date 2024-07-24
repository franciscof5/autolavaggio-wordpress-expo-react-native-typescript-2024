import { StatusBar } from 'expo-status-bar';
import { Platform, Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { AppRegistry } from 'react-native';
import { ProgressBar, MD3Colors, PaperProvider } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { LavaggioStore } from "../storage";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [rdata, setRdata] = useState([]);

  useEffect(() => {
    load_session();

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  async function load_session() {
    console.log("r1");

    var options = {
      method: 'GET',
      url: 'https://autolavaggio.franciscomatelli.com.br/wp-json/wp/v2/booking',
      // params: {
      //   action: 'load_session',
      //   // t: LavaggioStore.getRawState().token
      // },
    };
    console.log("options", options)
    axios.request(options)
    .then(function (r) {
      setRdata(r.data);
      console.log("r.data[0]", r.data[0]);
      // let secsP = r.data.secondsRemainingFromPHP;
      // let post_status = r.data.post_object.post_status;
      // console.log("secsP", secsP);
      // console.log("post_status", post_status);
      LavaggioStore.update((s)=>{
        s.post_object = r.data[0]
      })
    }).catch(function (error) {
      console.error(error);
    });
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* <Text>Open up App.js to start working on your app!</Text> */}
        <StatusBar style="auto" />
        <Button 
          title="load_session()"
          onPress={
          async () => {
            await load_session()
          }} />
        <Text>Name: {LavaggioStore.getRawState().user.username} | {LavaggioStore.getRawState().user.id}</Text>
        <Text>{LavaggioStore.getRawState().post_object.post_status ? LavaggioStore.getRawState().post_object.post_status + " | " + LavaggioStore.getRawState().post_object.post_title : "loading..."}</Text>
        {/* <Text>TT{ LavaggioStore.getRawState().post_object["post_status"] }</Text> */}
        {/* <Text>Tarefa { rdata[0].id }</Text> */}
        <Text>{LavaggioStore.getRawState().post_object.title.rendered } - Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      {/* <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      /> */}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownCircleTimer: {
    width:1000,
    backgroundColor: "#09d",
  },
  buttonFloat: {
    position: "absolute",
    zIndex: 10,
    width: 500,
    height: 300,
    backgroundColor: "transparent",
  },
  mascotView: {
     flex:1,
     backgroundColor: "red",
     flexDirection: "row", 
     height: 10,
  },
  mascotImage: {
    width: 100,
    height: 100,
  },
  mascotText: {
    padding:10,
    margin:10,
    width:200,
    height:80,
    borderRadius:5,
    backgroundColor:"#EEE",
  },
  titleText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 10 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}