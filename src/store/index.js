import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import reducers from '../reducers';
import promiseMiddleware from 'redux-promise';

const rootReducer = combineReducers(
  Object.keys(reducers).length ? reducers : { dummy: () => ({}) }
);

const enhancer = compose(applyMiddleware(promiseMiddleware));

const store = configureStore({
  reducer: rootReducer,
  devTools: true
});

export default store;
