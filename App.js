import React, { useEffect, useState } from 'react';

import { View } from 'react-native';
import {
  DefaultTheme,
  Provider as PaperProvider,
  ActivityIndicator,
  MD2Colors,
} from 'react-native-paper';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducers from './redux/reducers';
import thunk from 'redux-thunk';

import HeaderBar from './components/main/HeaderBar.js';
import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Main from './components/Main';
import Add from './components/main/Add';
import Save from './components/main/Save';
import Comment from './components/main/Comment';

import { app } from './database/db';

const Stack = createStackNavigator();

const store = createStore(
  rootReducers,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ff7300',
    accent: '#ffffff',
  },
};

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
      <ActivityIndicator
        animating={true}
        color={MD2Colors.orange500}
        size='large'
      />
    </View>
  );

  const LoggedOutScreen = () => (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator initialRouteName='Landing'>
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
    </PaperProvider>
  );

  const LoggedInScreen = () => (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator initialRouteName='Main'>
            <Stack.Screen
              name='Main'
              component={Main}
              options={{ header: props => <HeaderBar {...props} /> }}
            />
            <Stack.Screen
              name='Add'
              component={Add}
            />
            <Stack.Screen
              name='Save'
              component={Save}
            />
            <Stack.Screen
              name='Comment'
              component={Comment}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
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
