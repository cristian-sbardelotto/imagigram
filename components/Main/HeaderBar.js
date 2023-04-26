import React from 'react';
import { Appbar } from 'react-native-paper';

const HeaderBar = ({ navigation, previous }) => (
  <Appbar.Header style={{ backgroundColor: '#ff7300' }}>
    {previous && <Appbar.BackAction onPress={navigation.goBack} />}
    <Appbar.Content title='Imagigram' />
  </Appbar.Header>
);

export default HeaderBar;
