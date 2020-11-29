import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';

const middleware = [];

if (process.env.NODE_ENV === 'development') {
}

export default createStore(reducer, applyMiddleware(...middleware));
