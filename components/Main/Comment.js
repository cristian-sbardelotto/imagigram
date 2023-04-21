import React from 'react';
import { View, Text } from 'react-native';

const Comment = ({ route }) => {
  const { postId, uid } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Text>
        {postId} - {uid}
      </Text>
    </View>
  );
};

export default Comment;
