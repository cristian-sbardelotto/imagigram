import React, { useState, useEffect } from 'react';
import { View, FlatList, Image } from 'react-native';
import { Avatar, Card } from 'react-native-paper';

import { doc, collection, query, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../database/db';

import { connect } from 'react-redux';

const Profile = ({ currentUser, posts, route }) => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const { uid } = route.params;

  useEffect(() => {
    if (uid && uid === currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      fetchUser();
      fetchUserPosts();
    }
  }, [uid]);

  const fetchUser = () => {
    const docRef = doc(db, 'users', uid);

    getDoc(docRef).then(snapshot => {
      if (snapshot.exists) {
        const data = snapshot.data();
        setUser({ ...data, uid });
      } else {
        console.log('Action Fetch User: User does not exists');
      }
    });
  };

  const fetchUserPosts = async () => {
   const postsRef = collection(db, 'posts');

   const queryPosts = query(collection(postsRef, uid, 'userPosts'));
   const querySnapshot = await getDocs(queryPosts);

   const posts = querySnapshot.docs.map(doc => {
     const data = doc.data();
     const id = doc.id;
     return { id, ...data };
   });

   setUserPosts(posts);
  };

  if (!user) return <View />;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ margin: 20 }}>
        <Card>
          <Card.Title
            title={user?.name}
            subtitle={user?.email}
            left={props => (
              <Avatar.Image
                size={24}
                {...props}
                source={
                  user?.avatar ||
                  'https://wealthspire.com/wp-content/uploads/2017/06/avatar-placeholder-generic-1.jpg'
                }
              />
            )}
          />
        </Card>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={{ flex: '1/3', height: 100 }}>
              <Image
                style={{
                  flex: 1,
                  aspectRatio: '1/1',
                  height: '100px',
                  width: '100px',
                }}
                source={{ uri: item.downloadURL }}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const mapStateToProps = store => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(Profile);
