import { configureStore } from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../slices/user-slice';
import projectReducer from '../slices/project-slice';

const reducers = combineReducers({
  user: userReducer,
  project: projectReducer
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
});