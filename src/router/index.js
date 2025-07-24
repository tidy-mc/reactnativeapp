import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icons from 'react-native-vector-icons/AntDesign';
import CheckAuth from 'modules/CheckAuth';
import Login from "modules/Auth/containers/Login"
import ResetPassword from 'modules/Auth/containers/resetPassword';
import PasswordMessage from 'modules/Auth/containers/passwordMessage';
import Home from 'modules/Auth/containers/homePage';
import List from 'modules/Home/containers/Home'
import Details from 'modules/Home/containers/Details';
import Profile from 'modules/Profile/containers/compte'
import Notifications from 'modules/Profile/containers/notifications';
import Abonnements from 'modules/Profile/containers/followers';
import Card from 'modules/Profile/containers/card';
import ForceUpdate from 'modules/ForceUpdate/containers';


const Rootstack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={'CheckAuth'} screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}} /> */}
      <Stack.Screen
        name="CheckAuth"
        component={CheckAuth}
      />
      {/* AUTH */}
      <Stack.Group>
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
        />
        <Stack.Screen
          name="PasswordMessage"
          component={PasswordMessage}
        />
        <Stack.Screen
          name="FirstView"
          component={Home}
        />
      </Stack.Group>
      {/* Home */}
      <Stack.Group>
        <Stack.Screen
          name="List"
          component={List}
        />
        <Stack.Screen
          name="Details"
          component={Details}
        />
      </Stack.Group>
      {/* Profile */}
      <Stack.Group>
        <Stack.Screen
          name="Profile"
          component={Profile}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
        />
        <Stack.Screen
          name="Abonnements"
          component={Abonnements}
        />
        <Stack.Screen
          name="Card"
          component={Card}
        />
      </Stack.Group>
      {/* ForceUpdate / Update From Store*/}
      <Stack.Screen
        name="ForceUpdate"
        component={ForceUpdate}
      />
    </Stack.Navigator>
  );
}

export default Rootstack;