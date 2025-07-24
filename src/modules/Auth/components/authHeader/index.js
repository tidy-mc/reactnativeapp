import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

//styles
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

//lib
// ...
// import {Actions} from 'react-native-router-flux';

const AuthHeader = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        // ...
        // Actions.pop()
        navigation.goBack();
      }}>
        <Image
          source={require('assets/imgs/back.png')}
          style={styles.backImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {props.title && (
        <TouchableOpacity onPress={() => {
          // ...
          // Actions.pop()
          navigation.goBack();
        }}>
          <Text style={styles.title}>{props.title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AuthHeader;
