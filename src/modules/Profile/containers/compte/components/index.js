import React from "react";
import {
  Alert,
  Image,
  Linking, Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
// lib
// ...
// import { Actions } from "react-native-router-flux";
import CONFIG from "config/api";
import OpenPdf from 'react-native-open-pdf';
const { API_BASE_URL, API_VERSION } = CONFIG;
// styles
import styles from "./styles";
// strings
import strings from "modules/Profile/locales/fr";
// actions
import { logoutUser } from "modules/Auth/actions";
import gaSendLoadAppEvent from "services/ga-api";
import { navigate } from "router/navigator";
export default () => {

  const adherentCard = useSelector((state) => state.adherentCard);

  // Get the username
  const state = useSelector((state) => state?.global?.currentUser?.contact);
  const currentUser = useSelector((state) => state?.global?.currentUser);
  const type = useSelector((state) => state?.global?.currentUser?.type);

  // URL to visit
  const url = "https://www.snpi.fr/";
  const CGU = API_BASE_URL + "/asset/cgu";
  // Execute actions methodes
  const dispatch = useDispatch();

  // Read from store state
  const profile = useSelector(
    (state) => state.global.currentUser?.contact?.avatar
  );
  // click on Url
  const handlePress = async (type) => {
    let link = "";
    type === "CGU"
      ? (link = CGU)
      : type === "commercial_agent"
        ? (link = "https://agentsco.snpi.pro/connection")
        : (link = "https://www.snpi.pro/connection");
    // Checking if the link is supported for links with custom URL scheme.

    if (Platform.OS == "ios") {

      const supported = await Linking.canOpenURL(link);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(link);
      } else {
        Alert.alert(`Don't know how to open this URL: ${link}`);
      }

    }
    else {
      await OpenPdf.open(link);
    }


  };

  return (
    <View style={styles.container}>
      <View style={styles.hedaerContent}>
        <TouchableOpacity activeOpacity={0.8} style={styles.backContent} onPress={() => {
          // ...
          // Actions.List()
          navigate('List');
        }}>
          <Image source={require("assets/imgs/arrow-back.png")} style={styles.back} resizeMode="contain" />
        </TouchableOpacity>

        <Text style={styles.title}>{strings.count}</Text>
      </View>
      <View style={styles.profile}>
        <Image source={{ uri: profile }} style={styles.image} resizeMode="cover" />
        <Text style={styles.fullName}>{`${state?.firstname ? state?.firstname : ""
          } ${state?.lastname ? state?.lastname : ""}`}</Text>
      </View>
      <View style={styles.choices}>
        <TouchableOpacity onPress={() => {

          // Track GA Open Card EVENTS
          gaSendLoadAppEvent(currentUser?.id?.toString(), "card_click");

          if (adherentCard?.lastname != "") {
            // ...
            // Actions.Card()
            navigate('Card');
          }
          else {
            Alert.alert(
              "Erreur",
              "Erreur lors de la récupération de votre carte adhérent, veuillez contacter un administrateur."
            );
          }
        }} activeOpacity={0.8}>
          <View style={styles.choiceContent}>
            <Text style={styles.choice}>{strings.subscriptionsCard}</Text>
            <Image
              source={require("assets/imgs/chevron-left.png")}
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          // ...
          // Actions.Abonnements()
          navigate('Abonnements');
        }} activeOpacity={0.8}>
          <View style={styles.choiceContent}>
            <Text style={styles.choice}>{strings.followers}</Text>
            <Image
              source={require("assets/imgs/chevron-left.png")}
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          // ...
          // Actions.Notifications()
          navigate('Notifications');
        }} activeOpacity={0.8}>
          <View style={styles.choiceContent}>
            <Text style={styles.choice}>{strings.notifications}</Text>
            <Image
              source={require("assets/imgs/chevron-left.png")}
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("CGU")} activeOpacity={0.8}>
          <View style={styles.choiceContent}>
            <Text style={styles.choice}>{strings.CGU}</Text>
            <Image
              source={require("assets/imgs/chevron-left.png")}
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.descContent}>
        <Text style={{ textAlign: "center" }}>
          <Text style={styles.textDesc}>{strings.description}</Text>
          <TouchableOpacity onPress={() => handlePress("site")} activeOpacity={0.8}>
            {type === "commercial_agent" ? (
              <Text style={styles.link}>https://agentsco.snpi.pro</Text>
            ) : (
              <Text style={styles.link}>https://www.snpi.pro</Text>
            )}
          </TouchableOpacity>
        </Text>
      </View>
      <View style={styles.logoutContent}>
        <TouchableOpacity onPress={() => dispatch(logoutUser())} activeOpacity={0.8}>
          <Text style={styles.logout}>{strings.logout}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
