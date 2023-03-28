import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

import { app } from '../../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const auth = getAuth(app);
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
  };

  return (
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

      <Button
        title='Sign In'
        onPress={handleSubmit}
      />
    </View>
  );
};

export default Login;
