import { createAction, createReducer } from '@reduxjs/toolkit';

export const UPDATE_GAME = 'gameReducer/UPDATE_GAME';

export const updateGame = createAction(UPDATE_GAME);

const initState = {
  gameInfo: { quizList: [] },
  users: [{ gameIndex: -1 }],
};

export default createReducer(initState, {
  [UPDATE_GAME]: (state, action) => {
    return action.payload;
  },
});
