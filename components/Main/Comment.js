import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Avatar, Chip, Paragraph, Button, TextInput } from 'react-native-paper';

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../database/db';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const genericAvatar =
  'https://wealthspire.com/wp-content/uploads/2017/06/avatar-placeholder-generic-1.jpg';

const Comment = ({ currentUser, route }) => {
  const { postId, uid } = route.params;
  const [currentComment, setCurrentComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleCommentSubmit = () => {
    if (currentComment) {
      setCurrentComment('');
      const postsRef = collection(db, 'posts');

      addDoc(collection(postsRef, uid, 'userPosts', postId, 'comments'), {
        creator: currentUser.uid,
        comment: currentComment,
      }).then(snapshot => {
        console.log(`Comment '${currentComment}' successfully added!`);
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <>
            <Chip
              style={{ margin: 12 }}
              avatar={
                <Avatar.Image
                  size={24}
                  source={item?.user?.avatar || genericAvatar}
                />
              }
            >
              {item?.user?.name}
            </Chip>

            <Paragraph style={{ marginLeft: 48, marginBottom: 12 }}>
              {item?.comment}
            </Paragraph>
          </>
        )}
      />
      <View>
        <TextInput
          placeholder='Leave a comment...'
          value={currentComment}
          onChangeText={value => setCurrentComment(value)}
        />
        <Button
          icon='send'
          mode='contained'
          onPress={handleCommentSubmit}
        >
          Send
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = store => ({ currentUser: store.userState.currentUser });

export default connect(mapStateToProps, null)(Comment);
