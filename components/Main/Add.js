import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

const App = () => {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    // if (!permission || !permission.granted) {
    //   return <Text>No access to camera</Text>;
    // }

    const toggleCameraType = () => {
      setType(current =>
        current === CameraType.back ? CameraType.front : CameraType.back
      );
    };

    return (
      <View>
        <Camera
          type={type}
        >
          <View>
            <TouchableOpacity
              onPress={toggleCameraType}
            >
              <Text>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
};

export default App;
