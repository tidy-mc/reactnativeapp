import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";

//styles
import styles from "./styles";

//lib
// ...
// import { Actions } from "react-native-router-flux";

//componens
import Input from "common/components/Input";
import Button from "common/components/Button";
// ...
// import strings from "config/strings";
import strings from "modules/Auth/locales/fr";
import { navigate } from "router/navigator";

export const Login = (props) => {
  state = {
    password: "",
    login: "",
    showPassword: true,
  };

  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const loginPresed = () => {

    const payload = {
      login,
      password,
      // oneSignalPlayerId: this.props.oneSignalPlayerId,
    };
    props.actions.login(payload);
  };
  const onPress = () => {
    // ...
    // Actions.FirstView();
    navigate("FirstView")
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backContent} onPress={() => {
        onPress();
      }} activeOpacity={0.8}>
        <Image
          source={require("assets/imgs/arrow-back.png")}
          style={styles.back}
        />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.contentContainerner}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContent}>
          <Image
            source={require("assets/imgs/SNPI-logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Input
          label={strings.mail_address}
          value={login}
          onChangeText={(txt) => {
            setLogin(txt);
          }}
          keyboardType={"email-address"}
        />

        <Input
          label={strings.mot_de_passe}
          value={password}
          secureTextEntry={showPassword}
          onChangeText={(txt) => {
            setPassword(txt);
          }}
          rightIcon={
            <Image
              source={
                showPassword
                  ? require("assets/imgs/view.png")
                  : require("assets/imgs/invisible.png")
              }
              style={styles.rightIcon}
              resizeMode="cover"
            />
          }
          onPressRight={() => {
            setShowPassword(!showPassword);
          }}
        />
        <TouchableOpacity
          style={styles.forgetPasswordContainer}
          onPress={() => {
            // ...
            // Actions.ResetPassword()
            navigate('ResetPassword');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.textbutton}>{strings.forgetPassword}</Text>
        </TouchableOpacity>

        <View style={styles.cguAndButtonContainer}>
          <Button
            big
            content={strings.connexion}
            additonalContainerStyle={styles.additonalContainerStyle}
            onPress={() => {
              loginPresed();
            }}
            loading={props.auth.fetching}
            disabled={!login || !password}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default Login;
