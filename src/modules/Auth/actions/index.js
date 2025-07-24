// error handler
import reportError from "lib/errorHandler";
import { displayToast } from "lib/interactions";

// import Api
import { Api } from "api";

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  PASSWORD_REQUEST,
  PASSWORD_SUCCESS,
  PASSWORD_FAILURE,
} from "../actionsTypes";

//lib
import storage from "lib/storage";

// globalTypes
import { SET_CURRENT_USER } from "actionsTypes";

import { loginUrl, passwordUrl, logoutUrl } from "../api/endpoints";
// import { Actions } from "react-native-router-flux";
import WonderPush from "react-native-wonderpush";
import { setUserAdherentCard } from "actions/adherentCardActions";
import { refreshToken } from "actions";
import { navigate } from "router/navigator";

export const setCurrentUser = (payload) => ({
  type: SET_CURRENT_USER,
  payload,
});

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = () => ({
  type: LOGIN_SUCCESS,
});

export const loginFailure = (payload) => ({
  type: LOGIN_FAILURE,
  payload,
});

export const login = (payload) => {
  return (dispatch) => {
    dispatch(loginRequest());
    Api()
      .post(loginUrl(), payload)
      .then(async (data) => {
        console.log('Login success - Response headers should contain tokens');

        dispatch(loginSuccess());
        dispatch(setCurrentUser(data?.response));
        await WonderPush.subscribeToNotifications();
        await WonderPush.setUserId(data?.response?.id.toString());
        if (data?.response?.isCollaborator || data?.response?.isLegalRepresentative)
          await WonderPush.addTag('company');
        if (data?.response?.isCommercialAgent)
          await WonderPush.addTag('contact');
        if (data?.response?.isStudent)
          await WonderPush.addTag('student');
        Api()
          .get('/wallet/information')
          .then((data) => {

            dispatch(setUserAdherentCard(data?.response));
          })
          .catch(async (error) => {
            console.debug(JSON.stringify(error));
          });
        // ...
        // Actions.List();
        navigate("List");
      })
      .catch(async (error) => {
        console.log(error);
        displayToast(error?.status_text);
        dispatch(loginFailure());
        dispatch(setCurrentUser({}));
        await WonderPush.setUserId(null);
      });
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    Api()
      .get(logoutUrl())
      .then(async () => {
        await WonderPush.unsubscribeFromNotifications();
        // ...
        // Actions.reset("Login");
        navigate("Login");
        storage.clearSession();
        storage.clearJWT();

        dispatch(setCurrentUser({}));
      })
      .catch(async () => {
        await WonderPush.unsubscribeFromNotifications();
        // ...
        // Actions.reset("Login");
        navigate("Login");
        storage.clearSession();
        storage.clearSession();
        storage.clearJWT();
        dispatch(setCurrentUser({}));
      });
  };
};

export const passwordRequest = () => ({
  type: PASSWORD_REQUEST,
});

export const passwordSuccess = () => ({
  type: PASSWORD_SUCCESS,
});

export const passwordFailure = (payload) => ({
  type: PASSWORD_FAILURE,
  payload,
});

export const passwordReset = (payload) => {
  return (dispatch) => {
    dispatch(passwordRequest());
    Api()
      .post(passwordUrl(), payload)
      .then((data) => {
        dispatch(passwordSuccess(data));
        // ...
        // Actions.reset("PasswordMessage");
        navigate('PasswordMessage');
      })
      .catch((error) => {
        dispatch(passwordFailure());
        displayToast("Consulter votre boîte mail !");
      });
  };
};

// const fileToSend = {...img, name: img.fileName};
