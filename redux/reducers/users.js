import { USERS_DATA_CHANGE, USERS_POST_CHANGE } from '../constants';

const initialState = {
  users: [],
  feed: [],
  usersFollowingLoaded: 0,
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case USERS_DATA_CHANGE:
      return {
        ...state,
        users: [...state.users, action.user],
      };
    case USERS_POST_CHANGE:
      return {
        ...state,
        usersFollowingLoaded: state.usersFollowingLoaded + 1,
        feed: [...state.feed, ...action.posts],
      };
    default:
      return state;
  }
};

export default users;
