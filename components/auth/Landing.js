import React from 'react';
import { Text, View, Button } from 'react-native';

const Landing = ({ navigation }) => {
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '1rem'
      }}
    >
      <Text style={{ marginBottom: '1rem' }}>Welcome to Imagigram!</Text>
      <Button
        title='Register'
        onPress={() => navigation.navigate('Register')}
      />
      <Button
        title='Login'
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default Landing;
