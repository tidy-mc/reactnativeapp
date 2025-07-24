import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

//styles
import styles from './styles';

//lib
// ...
// import {Actions} from 'react-native-router-flux';

//components
import Button from 'common/components/Button';
// ...
// import strings from 'config/strings';
import strings from 'modules/Auth/locales/fr';
import { navigate } from 'router/navigator';

const PasswordMessage = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButtonContainer}
        onPress={() => {
          // ...
          // Actions.reset('FirstView')
          navigate('FirstView');
        }}>
        <Image
          source={require('assets/imgs/close.png')}
          style={styles.closeButton}
        />
      </TouchableOpacity>
      <Text style={styles.messageText}>{strings.receivePassword}</Text>
      <Image
        source={require('assets/imgs/passwordMessage.png')}

        style={styles.passwordMessage}
        resizeMode="cover"
      />
      <View style={styles.ButtonContainer}>
        <Button
          big
          content={strings.understand}
          onPress={() => {
            // ...
            // Actions.reset('Login')
            navigate('Login');
          }}
        />
      </View>
    </View>
  );
};

export default PasswordMessage;
