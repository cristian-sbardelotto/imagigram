import { collection, doc, getDoc } from 'firebase/firestore';
import { USER_STATE_CHANGE } from '../constants';

import { db, app } from '../../database/db';
import { getAuth } from 'firebase/auth';

export const fetchUser = () => {
  return dispatch => {
    const auth = getAuth(app);
    const uid = auth.currentUser.uid;

    const docRef = doc(db, 'users', uid);

    getDoc(docRef).then(snapshot => {
      if (snapshot.exists) {
        const data = snapshot.data();
        console.log(`Data: ${data}`);
        dispatch({ type: USER_STATE_CHANGE, currentUser: { ...data, uid } });
      } else {
        console.log('Action Fetch User: User does not exist');
      }
    });
  };
};
