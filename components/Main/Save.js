import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import { getAuth } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

import { app, db } from '../../database/db';

const auth = getAuth(app);
const storage = getStorage(app);

export const Save = ({ navigation, route }) => {
  const { image } = route.params;
  const [caption, setCaption] = useState('');

  const uploadImage = async () => {
    const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(
      36
    )}`;
    const res = await fetch(image);
    const blob = await res.blob();
    const storageRef = ref(storage, childPath);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`upload is ${progress}% done`);

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },

      // * Error Cases

      error => {
        switch (error.code) {
          case 'storage/unauthorized':
            console.log(`storage/unauthorized: ${error.message}`);
            break;
          case 'storage/canceled':
            console.log(`storage/canceled: ${error.message}`);
            break;
          case 'storage/unknown':
            console.log(`storage/unknown: ${error.message}`);
            break;
        }
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          console.log(`File available at ${downloadURL}`);
          savePostData(downloadURL);
        });
      }
    );
  };

  const savePostData = async (downloadURL) => {
    const postsRef = collection(db, 'posts');

    await addDoc(collection(postsRef, auth.currentUser.uid, 'userPosts'), {
      downloadURL,
      caption,
      creation: serverTimestamp(),
    })

    navigation.popToTop();
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: image }} />

      <TextInput
        placeholder='Enter a description...'
        onChangeText={caption => setCaption(caption)}
      />

      <Button
        icon={'download'}
        onPress={() => uploadImage()}
      >
        Save
      </Button>
    </View>
  );
};

export default Save;
