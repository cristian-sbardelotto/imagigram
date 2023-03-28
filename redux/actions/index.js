import { collection, doc, getDoc } from 'firebase/firestore';
import { USER_STATE_CHANGE } from '../constants';

import { db, app } from '../../database/db';
import { getAuth } from 'firebase/auth';

async function getAllUsers() {
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach(doc => {
    return doc.id, doc.data();
  });
}

// export const fetchUser = () => {
//   return dispatch => {
//     getAllUsers().then(snapshot => {
//       if (snapshot) {
//         console.log(snapshot.data());
//         dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
//       } else {
//         console.log('Action Fetch User: User does not exists.');
//       }
//     });
//   };
// };

export const fetchUser = () => {
  return dispatch => {
    const auth = getAuth(app);
    const uid = auth.currentUser.uid;

    const docRef = doc(db, 'users', uid);

    getDoc(docRef).then((snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.data();
        dispatch({  type: USER_STATE_CHANGE, currentUser: { ...data, uid } });
      } else {
        console.log('Action Fetch User: User does not exist');
      }
    })
  };
};
