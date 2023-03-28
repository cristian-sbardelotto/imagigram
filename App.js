import React, { useEffect, useState } from 'react';

import { View, Text } from 'react-native';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducers from './redux/reducers';
import thunk from 'redux-thunk';


import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Main from './components/Main';
import Add from './components/Main/Add';

import { app } from './database/db';

const Stack = createStackNavigator();

const store = createStore(
  rootReducers,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, user => {
      if (!user) {
        setIsLogged(false);
      } else {
        setIsLogged(true);
      }
      setIsLoading(false);
    });
  }, []);

  const Loading = () => (
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

  const LoggedOutScreen = () => (
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

  const LoggedInScreen = () => (
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

  if (isLoading) {
    return <Loading />;
  }

  if (isLogged) {
    return <LoggedInScreen />;
  }

  return <LoggedOutScreen />;
};

export default App;
