import React from "react";

// rn-comp
import { View, Image, Text, TouchableOpacity } from "react-native";

// styles
import styles from "./styles";

// strings
// ...
// import strings from "config/strings";
import strings from "modules/Auth/locales/fr";
import LinearGradient from "react-native-linear-gradient";

const ForceUpdate = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("assets/imgs/SNPI-Text.png")}
          style={styles.moovanceHeader}
          resizeMode="contain"
        />
      </View>
      {/* <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#FFF", "#2e2e2e9e"]}
        style={styles.updateContainer}
      > */}
      <View style={styles.updateContainer}>
        <Image
          source={require("assets/imgs/icon.jpg")}
          style={styles.moovanceLogo}
          resizeMode="contain"
        />
        <View style={styles.messageConatainer}>
          <Text style={styles.messageContent}>{strings.update}</Text>
        </View>
        <TouchableOpacity style={styles.btnToStore}>
          <Text style={styles.visit_store}>{strings.visit_store}</Text>
        </TouchableOpacity>
      </View>
      {/* </LinearGradient> */}
    </View>
  );
};

export default ForceUpdate;
