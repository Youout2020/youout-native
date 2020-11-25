import { createAction, createReducer } from '@reduxjs/toolkit';

export const INIT_USER = 'userReducer/INIT_USER';

export const initUser = createAction(INIT_USER);

const initState = { id: '' };

export default createReducer(initState, {
  [INIT_USER]: (state, action) => {
    return action.payload;
  },
});
