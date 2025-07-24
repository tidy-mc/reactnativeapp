"use strict";

import React from "react";

import { Provider } from "react-redux";
import { NetworkProvider } from "./contextProviders/NetworkProvider";
import { AppStateProvider } from "./contextProviders/AppStateProvider";
import { MenuProvider } from "react-native-popup-menu";
import store from "./store";

import notificationHandler from "./lib/notificationHandler";

import Router from "./router";
import { navigate, navigationRef } from "router/navigator";
import { NavigationContainer } from '@react-navigation/native';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  async componentWillUnmount() {
  }

  onOpened = (openResult) => {
    const { additionalData, isAppInFocus } = openResult.notification.payload;
    const { dispatch, getState } = store;
    notificationHandler({ additionalData, isAppInFocus }, dispatch, getState);
  };

  render() {
    return (
      <MenuProvider skipInstanceCheck>
        <Provider store={store}>
          <NetworkProvider>
            <AppStateProvider>
              <NavigationContainer ref={navigationRef}>
                <Router />
              </NavigationContainer>
            </AppStateProvider>
          </NetworkProvider>
        </Provider>
      </MenuProvider>
    );
  }
}
