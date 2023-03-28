import React, { useEffect, useState } from 'react';

import { View, Text } from 'react-native';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducers from './redux/reducers'
import thunk from 'redux-thunk';

const store = createStore(rootReducers, applyMiddleware(thunk));

import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Main from './components/Main';
import Add from './components/Main/Add';

const firebaseConfig = {
  apiKey: 'AIzaSyAJ2WsPik41G3R8FP2vyoJEjGuS5BY2QLU',
  authDomain: 'imagigram-b4fdb.firebaseapp.com',
  projectId: 'imagigram-b4fdb',
  storageBucket: 'imagigram-b4fdb.appspot.com',
  messagingSenderId: '461137256661',
  appId: '1:461137256661:web:10634977cb16cf1601c25c',
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        return setIsLogged(false);
      } else {
        setIsLogged(true);
      }

      setIsLoading(false);
    });
  }, []);

  //TODO: create database folder and export all variables

  const Loading = () => {
    return (
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          gap: '1rem',
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  };

  const LoggedOutScreen = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Landing'
            component={Landing}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name='Register'
            component={Register}
          />

          <Stack.Screen
            name='Login'
            component={Login}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  const LoggedInScreen = () => {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Main'>
            <Stack.Screen
              name='Main'
              component={Main}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Add'
              component={Add}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isLogged) {
    return <LoggedInScreen />;
  }

  return <LoggedOutScreen />;
};

export default App;
