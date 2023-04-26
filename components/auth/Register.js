import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, setDoc, doc } from 'firebase/firestore';

import { app, db } from '../../database/db';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const auth = getAuth(app);

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        const usersRef = collection(db, 'users');
        await setDoc(doc(usersRef, auth.currentUser.uid), { name, email });
      }
    } catch (error) {
      console.log(error);
    }
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
          placeholder='Nome'
          onChangeText={setName}
        />

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
        Sign Up
      </Button>
    </View>
  );
};

export default Register;
