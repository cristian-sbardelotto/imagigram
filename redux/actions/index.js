import {
  collection,
  doc,
  getDoc,
  query,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import 'firebase/auth';
import 'firebase/firestore';

import {
  USER_STATE_CHANGE,
  USER_POST_CHANGE,
  USER_FOLLOWING_CHANGE,
  CLEAR_DATA,
  USERS_DATA_CHANGE,
  USERS_POST_CHANGE,
  USERS_LIKE_COUNT_CHANGE,
  USERS_LIKE_CHANGE,
} from '../constants';

import { db, app } from '../../database/db';

export const fetchUser = () => {
  return dispatch => {
    const auth = getAuth(app);
    const uid = auth.currentUser.uid;

    const docRef = doc(db, 'users', uid);

    getDoc(docRef).then(snapshot => {
      if (snapshot.exists) {
        const data = snapshot.data();
        console.log({ ...data, uid });
        dispatch({ type: USER_STATE_CHANGE, currentUser: { ...data, uid } });
      } else {
        console.log('Action Fetch User: User does not exist');
      }
    });
  };
};

export const fetchUserPosts = () => {
  return async dispatch => {
    const auth = getAuth(app);
    const uid = auth.currentUser.uid;

    const postsRef = collection(db, 'posts');

    const queryPosts = query(collection(postsRef, uid, 'userPosts'));
    const querySnapshot = await getDocs(queryPosts);

    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const id = doc.id;

      return { id, ...data };
    });

    dispatch({ type: USER_POST_CHANGE, posts });
  };
};

export const fetchUserFollowing = () => {
  return async dispatch => {
    const auth = getAuth(app);
    const uid = auth.currentUser.uid;

    const followingRef = collection(db, 'following');

    const queryFollowing = query(
      collection(followingRef, uid, 'userFollowing')
    );
    const querySnapshot = await getDocs(queryFollowing);
    const following = querySnapshot.docs.map(doc => doc.id);

    dispatch({ type: USER_FOLLOWING_CHANGE, following });

    following.map((value, index) => {
      dispatch(fetchUsersData(following[index], true));
    });
  };
};

export const fetchUsersData = (uid, getPosts) => {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some(el => el.uid === uid);

    if (!found) {
      const docRef = doc(db, 'users', uid);
      getDoc(docRef).then(snapshot => {
        if (snapshot.exists) {
          const data = snapshot.data();
          dispatch({ type: USERS_DATA_CHANGE, user: { ...data, uid } });
        } else {
          console.log('Action Fetch Users Data: Users data does not exists');
        }
      });

      if (getPosts) {
        dispatch(fetchUsersFollowingPosts(uid));
      }
    }
  };
};

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    const postsRef = collection(db, 'posts');
    const queryPosts = query(
      collection(postsRef, uid, 'userPosts'),
      orderBy('creation')
    );

    getDocs(queryPosts).then(snapshot => {
      const userUidPostFollowed = snapshot.docs[0]._key.path.segments[6];
      const user = getState().usersState.users.find(
        el => el?.uid === userUidPostFollowed
      );

      const posts = snapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;

        return { id, ...data, user };
      });

      posts.map(post => {
        dispatch(fetchUsersFollowingLikes(userUidPostFollowed, post.id));
      });

      dispatch({ type: USERS_POST_CHANGE, posts, uid });
    });
  };
}

export const fetchUsersFollowingLikes = (uid, postId) => {
  return dispatch => {
    const counterLikesRef = collection(
      db,
      'posts',
      uid,
      'userPosts',
      postId,
      'likes'
    );
    const queryUserCounterLikes = query(counterLikesRef);

    getDocs(queryUserCounterLikes).then(snapshot => {
      const likes = snapshot.docs.length;
      dispatch({ type: USERS_LIKE_COUNT_CHANGE, postId, likes });
    });

    const auth = getAuth(app);
    const authUid = auth.currentUser.uid;

    const authUserLikesRef = collection(
      db,
      'posts',
      uid,
      'userPosts',
      postId,
      'likes'
    );
    const queryAuthUserLikes = query(authUserLikesRef);

    getDocs(queryAuthUserLikes).then((snapshot) => {
      let currentUserLike = false;

      snapshot.docs.map(doc => {
        const dataUserId = doc._key.path.segments[10];
        currentUserLike = false;

        if (dataUserId === authUid) {
          const postId = doc._key.path.segments[8];
          currentUserLike = true;
          dispatch({ type: USERS_LIKE_CHANGE, postId, currentUserLike });
        }

        dispatch({ type: USERS_LIKE_CHANGE, postId, currentUserLike });
      })
    });
  };
};

export const clearData = () => {
  return dispatch => dispatch({ type: CLEAR_DATA });
};
