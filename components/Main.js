import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchUser } from '../redux/actions';

import Feed from './Main/Feed';
import Profile from './Main/Profile';

const Tab = createMaterialBottomTabNavigator();

const Null = () => null;

const Main = props => {
  useEffect(() => {
    props.fetchUser();
  }, []);

  return (
    <>
      <Tab.Navigator
        initialRouteName='Feed'
        labeled={false}
      >
        <Tab.Screen
          name='Feed'
          component={Feed}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon
                name='newspaper-variant'
                size={30}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name='AddContainer'
          component={Null}
          listeners={({ navigation }) => ({
            tabPress: event => {
              event.preventDefault();
              navigation.navigate('Add');
            },
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon
                name='plus-box'
                size={30}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name='Profile'
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon
                name='account-circle'
                size={30}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

// const mapStateToProps = store => ({
//   currentUser: store.userState.currentUser,
// });

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchUser }, dispatch);

export default connect(null, mapDispatchToProps)(Main);
