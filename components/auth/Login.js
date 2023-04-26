import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

import { app } from '../../database/db';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const auth = getAuth(app);
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
  };

  return (
    <View
      style={{
        height: '60vh',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <TextInput
          placeholder='E-mail'
          onChangeText={setEmail}
        />

        <TextInput
          placeholder='Senha'
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Button
        buttonColor='rgba(255, 115, 0, 0.3)'
        icon={'login-variant'}
        onPress={handleSubmit}
      >
        Sign In
      </Button>
    </View>
  );
};

export default Login;
