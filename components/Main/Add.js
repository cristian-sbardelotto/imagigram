import { Camera, CameraType } from 'expo-camera';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Add = () => {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    if (!permission) return <View />;

    if (!permission.granted) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center' }}>
            We need your permission to show the camera
          </Text>
          <Button
            onPress={requestPermission}
            title='grant permission'
          />
        </View>
      );
    }

    const toggleCameraType = () => {
      setType(current =>
        current === CameraType.back ? CameraType.front : CameraType.back
      );
    };

    return (
      <View>
        <View style={{ height: '50vh', width: '100vw', display: 'flex', alignItems: 'center' }}>
          <Camera
            style={{ flex: 1, aspectRatio: 1, height: '50vh', width: '50vw' }}
            type={type}
          />
          <Button
            title='Flip Camera'
            onPress={toggleCameraType}
          />
        </View>
      </View>
    );
};

export default Add;
