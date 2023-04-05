import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import 'firebase/storage';
import 'firebase/auth';

import { app } from '../../database/db';

const auth = getAuth(app);
const storage = getStorage(app);

export const Save = ({ navigaion, route }) => {
  const { image } = route.params;
  const [caption, setCaption] = useState('');

  const uploadImage = async () => {
    const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(
      36
    )}`;
    const result = await fetch(image);
    const blob = result.blob();

    const storageRef = ref(storage, childPath);

    uploadBytes(storageRef, blob).then(snapshot => {
      console.log('Uploaded a blob or file!');
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: image }} />

      <TextInput
        placeholder='Enter a description...'
        onChangeText={caption => setCaption(caption)}
      />

      <Button icon={'download'} onPress={() => uploadImage()}>Save</Button>
    </View>
  );
};

export default Save;
