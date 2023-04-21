import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, FlatList } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Card,
  Paragraph,
  Button,
  Caption
} from 'react-native-paper';

import { connect } from 'react-redux';

import { collection, doc, setDoc } from 'firebase/firestore';

import { db } from '../../database/db';

const genericAvatar = 'https://wealthspire.com/wp-content/uploads/2017/06/avatar-placeholder-generic-1.jpg';

const Loading = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator
      animating={true}
      color={'#ff7300'}
      size='large'
    />
  </View>
);

const Feed = ({ currentUser, feed, navigation, following, usersFollowingLoaded }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (following.length > 0 && usersFollowingLoaded === following.length) {
      feed.sort((x, y) => x.creation - y.creation);
      setPosts(feed);
    }
  }, [feed, usersFollowingLoaded]);

  const onLikePress = async (userId, postId) => {
   const postsRef = collection(db, 'posts');
   await setDoc(
     doc(postsRef, userId, 'userPosts', postId, 'likes', currentUser.uid),
     {}
   );
  }

  return (
    <View style={styles.container}>
      {posts.length === 0 && <Loading />}

      <View style={styles.gallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <Card>
              <Card.Title
                title={item?.user?.name}
                subtitle={item?.user?.email}
                left={props => (
                  <Avatar.Image
                    size={24}
                    {...props}
                    source={
                      item?.user?.avatar ||
                      genericAvatar
                    }
                  />
                )}
              />
              <Card.Content>
                <View style={styles.images}>
                  <Image
                    style={styles.image}
                    source={{ uri: item?.downloadURL }}
                  />
                </View>
                <Paragraph>{item?.caption}</Paragraph>

                <Card.Actions>
                  <Caption>10</Caption>
                  <Button
                    icon={'heart'}
                    onPress={() => onLikePress(item.user.uid, item.id)}
                  >
                    Like
                  </Button>

                  <Button
                    icon={'comment-arrow-right'}
                    onPress={() => {
                      navigation.navigate('Comment', {
                        postId: item.id,
                        uid: item.user.uid,
                      });
                    }}
                  >
                    Comments
                  </Button>
                </Card.Actions>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  gallery: {
    flex: 1,
  },
  images: {
    flex: 1,
    height: 100,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    width: '100%',
  },
});

const mapStateToProps = store => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
