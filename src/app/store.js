import { configureStore } from '@reduxjs/toolkit';
import searchListReducer from '../components/SearchList/searchListSlice';

export default configureStore({
  reducer: {
    searches: searchListReducer,
  },
});
