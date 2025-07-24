import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Switch } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

// styls
import styles from "./styles";
// strings
import strings from "modules/Profile/locales/fr";


// lib
// ...
// import { Actions } from "react-native-router-flux";
import { notifications } from "modules/Profile/actions";
import WonderPush from "react-native-wonderpush";
import { Api } from "api";
import { setUserHasSentNotificationsPermission } from "actions/notificationsPermissionsActions";
import { refreshToken } from "actions";
import { useNavigation } from "@react-navigation/native";

export default () => {
  // Execute methode on loading the page
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Read from the store variables
  const state = useSelector(
    (state) => state.global.currentUser?.dashboard?.hasNotification
  );
  const id = useSelector((state) => state.global.currentUser?.id);

  // state for switch
  const [isEnabled, setIsEnabled] = useState(state);

  useEffect(() => {
    checkNotifs();
  }, []);

  const checkNotifs = async () => {
    const isUserSubscribedToNotifications = await WonderPush.isSubscribedToNotifications();
    setIsEnabled(isUserSubscribedToNotifications);
  }

  //   toggle the value
  async function toggleSwitch() {
    toggleNotifications();
    setIsEnabled((previousState) => !previousState);
  }

  async function toggleNotifications() {

    const enableTmp = !isEnabled;

    enableTmp === true
      ? await WonderPush.subscribeToNotifications()
      : await WonderPush.unsubscribeFromNotifications();


    let urlNotificationsPermissions = '/mobile-notification/activate/';
    if (!enableTmp) {
      urlNotificationsPermissions = '/mobile-notification/deactivate/';
    }

    Api()
      .get(urlNotificationsPermissions + id)
      .then((data) => {
        console.debug(urlNotificationsPermissions + " SUCCESS")
        console.debug(JSON.stringify(data));
        // console.debug("/mobile-notification/activate/ REPONSE")
        // console.debug(data)
      })
      .catch(async (error) => {

        console.debug(urlNotificationsPermissions + " ERROR")
        console.debug(JSON.stringify(error));

        if (error?.status_code != undefined && error?.status_code != null && error?.status_code == 401) {
          console.debug("/mobile-notification/activate/ ERROR REFRESH TOKEN")
          await refreshToken();
          toggleNotifications();
        }
      });
  }

  return (
    <View styles={styles.container}>
      <View style={styles.hedaerContent}>
        <TouchableOpacity
          style={styles.backContent}
          activeOpacity={0.8}
          onPress={() => {
            // ...
            // Actions.pop()
            navigation.goBack();
          }} //reset("Profile")
        >
          <Image
            source={require("assets/imgs/arrow-back.png")}
            style={styles.back}
          // resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>{strings.notifications}</Text>
      </View>
      <View style={styles.choices}>
        <View style={styles.choiceContent}>
          <Text style={styles.choice}>{strings.publish_new_articl}</Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: "#e2e4eb", true: "#5CE5A5" }}
            thumbColor={isEnabled ? "#FFF" : "#FFF"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          // onChange={() => changeValue()}
          />
        </View>
      </View>
    </View>
  );
};
