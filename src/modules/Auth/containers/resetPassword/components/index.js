import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";

//styles
import styles from "./styles";

// libs
// ...
// import { Actions } from "react-native-router-flux";

//componens
import Input from "common/components/Input";
import Button from "common/components/Button";
// ...
// import strings from "config/strings";
import strings from "modules/Auth/locales/fr";
import { navigate } from "router/navigator";

class Login extends React.Component {
  state = {
    login: "",
  };

  resetPassword = () => {
    const { login } = this.state;
    const paylaod = { login };
    // ...
    this.props.actions.passwordReset(paylaod);
  };

  onPress = () => {
    // ...
    // Actions.Login();
    navigate('Login');
  };
  render() {
    return (
      <View style={styles.container}>
        {/* <AuthHeader /> */}
        <TouchableOpacity style={styles.backContent} onPress={this.onPress} activeOpacity={0.8}>
          <Image
            source={require("assets/imgs/arrow-back.png")}
            style={styles.back}
          />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={styles.contentContainerner}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.recoverText}>{strings.passwordReset}</Text>
          <Input
            label={strings.loginEmail}
            value={this.state.login}
            onChangeText={(login) => this.setState({ login })}
          />

          <View style={styles.ButtonContainer}>
            <Button
              big
              content={strings.resetPassword}
              onPress={this.resetPassword}
              loading={this.props.auth.fetching}
              disabled={!this.state.login}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Login;
