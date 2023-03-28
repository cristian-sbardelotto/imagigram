import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {  collection, setDoc, doc } from 'firebase/firestore';

import { app, db } from '../../App';

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

      <Button
        title='Sign Up'
        onPress={handleSubmit}
      />
    </View>
  );
};

export default Register;
