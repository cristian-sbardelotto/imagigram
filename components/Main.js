import React, { useEffect } from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserPosts } from '../redux/actions';

import { getAuth } from 'firebase/auth';
import { app } from '../database/db';

import Feed from './Main/Feed';
import Profile from './Main/Profile';
import Search from './Main/Search';

const Tab = createMaterialBottomTabNavigator();

const Null = () => null;

const Main = ({ fetchUser, fetchUserPosts }) => {
  useEffect(() => {
    fetchUser();
    fetchUserPosts();
  }, []);

  const auth = getAuth(app);
  const uid = auth.currentUser.uid;

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
          name='Search'
          component={Search}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                name='magnify'
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
            tabBarIcon: ({ color }) => (
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
          listeners={({navigation}) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate('Profile', {
                uid,
              })
            }
          })}
          options={{
            tabBarIcon: ({ color }) => (
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

const mapStateToProps = store => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchUser, fetchUserPosts }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
