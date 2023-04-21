import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Avatar, Chip, Paragraph, Button, TextInput } from 'react-native-paper';

import { collection, addDoc, query, getDocs } from 'firebase/firestore';
import { db } from '../../database/db';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const genericAvatar =
  'https://wealthspire.com/wp-content/uploads/2017/06/avatar-placeholder-generic-1.jpg';

const Comment = ({ currentUser, users, route }) => {
  const { postId, uid } = route.params;
  const [currentComment, setCurrentComment] = useState('');
  const [commentslist, setCommentsList] = useState([]);
  const [showUpdate, setShowUpdate] = useState(true);

  useEffect(() => {
    if (showUpdate) {
      const postsRef = collection(db, 'posts');
      const queryComments = query(
        collection(postsRef, uid, 'userPosts', postId, 'comments')
      );

      getDocs(queryComments).then(snapshot => {
        const comments = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });

        const updatedComments = comments.map(comment => {
          if (users) {
            if (comment.hasOwnProperty('user')) return comment;

            const creator = users?.find(user => user.uid === comment.creator);

            if (creator) {
              comment.user = creator;
            } else {
              comment.user = currentUser;
            }
            return comment;
          }
        });

        setCommentsList(updatedComments);
      });

      setShowUpdate(false);
    }
  }, [postId, showUpdate]);

  const handleCommentSubmit = () => {
    if (currentComment) {
      setCurrentComment('');
      const postsRef = collection(db, 'posts');

      addDoc(collection(postsRef, uid, 'userPosts', postId, 'comments'), {
        creator: currentUser.uid,
        comment: currentComment,
      }).then(snapshot => {
        setShowUpdate(true);
        console.log(`Comentário ${currentComment} adicionado com sucesso!`);
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={commentslist}
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

const mapStateToProps = store => ({
  currentUser: store.userState.currentUser,
  users: store.usersState.users,
});

export default connect(mapStateToProps, null)(Comment);
