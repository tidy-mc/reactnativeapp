/**
 * Copyright (c) Flexi Apps.
 *
 * Functions to display interactions toast
 */

//TODO : use Toast from native base

import { ToastAndroid, Alert, Platform } from 'react-native';

import strings from 'config/strings';
import storage from 'lib/storage';
import { navigate } from 'router/navigator';
export const displayToast = (msg) => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER);
  } else {
    Alert.alert('', msg, [{ text: 'OK', onPress: () => { } }]);
  }
};

export const displaySessionToast = () => {
  Alert.alert(
    '',
    strings.sessionExpired,
    [
      {
        text: 'OK',
        onPress: () => {
          storage
            .clearSession('null')
            .then(() => {
              // ...
              // Actions.Login()
              navigate('Login');
            })
            .catch(() => {
              // ...
              // Actions.Login()
              navigate('Login');
            });
        },
      },
    ],
    {
      cancelable: false,
    },
  );
};
