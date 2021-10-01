import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useMemo } from 'react';
import { Dimensions, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Login from './screens/Login'
import Home from './screens/Home'
import Paiement from './screens/Paiement'
import Scan from './screens/Scan'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from './components/Context'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

export default function App() {

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          id: action.id,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {
      const userToken = foundUser.token
      const userName = JSON.stringify(foundUser.user.id)

      try {
        await AsyncStorage.multiSet([["userToken", userToken], ["userName", userName]]);
      } catch (e) {
        console.log(e)
      }
      dispatch({ type: 'LOGIN', id: userName, token: userToken })
    },
    signOut: async () => {
      try {
        await AsyncStorage.multiRemove(['userToken', 'userName'])
      } catch (e) {
        console.log(e)
      }
      dispatch({ type: 'LOGOUT' })
    },
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      let user;
      user = null;
      try {
        user = await AsyncStorage.multiGet(['userToken', 'userName']);
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', id: user[1][1], token: user[0][1] })
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <LinearGradient
          // Background Linear Gradient
          colors={['#7F00FF', '#E100FF']}
          style={styles.background}
        />
        <ActivityIndicator size="large" color="#ecf0f1" />
      </View>
    )
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken !== null ? (
          <Drawer.Navigator initialRouteName="Home" >
            <Drawer.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Drawer.Screen name="Paiement" component={Paiement} options={{ headerShown: false }} />
            <Drawer.Screen name="Scan" component={Scan} options={{ headerShown: false }} />
          </Drawer.Navigator>
        )
          : <Login />
        }
      </NavigationContainer>
    </AuthContext.Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('screen').height,
  },
});
