import React from "react";

import { View, ImageBackground, Text, Image } from "react-native";

import styles from "./styles";

//components
import Button from "components/Button";
// ...
// import { Actions } from "react-native-router-flux";

// ...
// import strings from "config/strings";
import strings from "modules/Auth/locales/fr";
import { navigate } from "router/navigator";

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("assets/imgs/homepicture.png")}
        // resizeMode="contain"
        style={styles.image}
      />
      <View style={styles.containerText}>
        <View style={styles.syndicatContent}>
          <Image
            source={require("assets/imgs/SNPI-logo.png")}
            style={styles.logoImage}
          />
          <Image
            source={require("assets/imgs/SNPI-Text.png")}
            style={styles.logoText}
          />
        </View>

        <View style={styles.text}>
          <Text style={styles.title}>{strings.homePage_acceuil}</Text>
          <Text style={styles.paragraph}>{strings.homePage_paragraph}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          // marginBottom: 5,
          // borderWidth: 0.5,
          justifyContent: "flex-end",
          alignSelf: "center",
          marginVertical: 20,
        }}
      >
        <Button big content={
          <View style={styles.buttonContentStyle}>
            <Text style={styles.btnText}>{strings.homePage_commencer}</Text>
          </View>
        }
          additonalContainerStyle={styles.additonalContainerStyle} onPress={() => {
            // ...
            // Actions.Login()
            navigate('Login');
          }}
        />
      </View>
    </View>
  );
};

export default HomePage;
