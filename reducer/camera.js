import { createAction, createReducer } from '@reduxjs/toolkit';

export const SET_MODAL_VISIBLE = 'cameraReducer/SET_MODAL_VISIBLE';
export const SET_IS_KEYWORD_PHASE = 'cameraReducer/SET_IS_KEYWORD_PHASE';
export const SET_SIMILAR_LIST = 'cameraReducer/SET_SIMILAR_LIST';
export const SET_ANSWER_USERNAME = 'cameraReducer/SET_ANSWER_USERNAME';

export const setModalVisible = createAction(SET_MODAL_VISIBLE);
export const setIsKeywordPhase = createAction(SET_IS_KEYWORD_PHASE);
export const setSimilarList = createAction(SET_SIMILAR_LIST);
export const setAnswerUsername = createAction(SET_ANSWER_USERNAME);

const initState = {
  modalVisibles: {
    keyword: false,
    hint: false,
    leave: false,
    compare: false,
    toast: false,
  },
  isKeywordPhase: true,
  similarList: [],
  answerUsername: '',
};

export default createReducer(initState, {
  [SET_MODAL_VISIBLE]: (state, action) => {
    console.log(action.payload);
    state.modalVisibles = action.payload;
  },
  [SET_IS_KEYWORD_PHASE]: (state, action) => {
    state.isKeywordPhase = action.payload;
  },
  [SET_SIMILAR_LIST]: (state, action) => {
    state.similarList = action.payload;
  },
  [SET_ANSWER_USERNAME]: (state, action) => {
    state.answerUsername = action.payload;
  },
});
