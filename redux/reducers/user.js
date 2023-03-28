const initialState = {
  currentUser: null,
};

const user = (state = initialState, action) => {
  return {
    ...state,
    currentuser: action.currentUser,
  };
};

export default user;
