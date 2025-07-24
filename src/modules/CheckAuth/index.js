/**
 * Copyright (c) Flexi Apps.
 *
 * Async Component to check user logged in.
 *
 */

"use strict";

import React, { useEffect } from "react";
import { View } from "react-native";
// ...
// import { Actions } from "react-native-router-flux";
import { ReactReduxContext } from "react-redux";

import storage from "../../lib/storage";
import { forceUpdateFromStore } from "../../config/appConfig";
import { useNavigation } from "@react-navigation/native";
import { navigate } from "router/navigator";

const styles = {
  container: {
    flex: 1,
    backgroundColor: "white",
  },
};


function CheckAuth() {
  useEffect(() => {
    const firstLoaded = async () => {
      try {
        const session = await storage.getSession();
        const jwt = await storage.getJWT();
        const refresh = await storage.getRefreshJWT();

        // Add debugging logs
        console.log('CheckAuth - Session:', session);
        console.log('CheckAuth - JWT:', jwt);
        console.log('CheckAuth - Refresh:', refresh);

        // check for update required
        if (forceUpdateFromStore) {
          navigate('ForceUpdate');
        } else {
          if (
            // session &&
            // session !== "null" &&
            jwt &&
            jwt !== "null" &&
            refresh &&
            refresh !== "null"
          ) {
            console.log('CheckAuth - Redirecting to List (authenticated)');
            navigate('List');
          } else {
            console.log('CheckAuth - Redirecting to Login (not authenticated)');
            navigate('Login');
          }
        }
      } catch (e) {
        console.log('CheckAuth - Error:', e);
        navigate('Login');
      }
    }
    firstLoaded();
  }, []);

  return <View style={styles.container} />;
}

export default CheckAuth;
