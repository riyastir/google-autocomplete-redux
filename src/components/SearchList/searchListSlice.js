import { createAsyncThunk,createSlice } from '@reduxjs/toolkit';

export const fetchHistory = createAsyncThunk(
    'history/fetch',
    async () => {
      const response = await localStorage.getItem("searchHistory");
      return JSON.parse(response);
    }
  )

export const searchListSlice = createSlice({
    name:'searches',
    initialState:{
        value:[],
        loading:'idle'
    },
    reducers:{
        add: (state,action)=>{
            state.value = [...state.value,action.payload];
            localStorage.setItem('searchHistory',JSON.stringify([...state.value,action.payload]));
        }
    },
    extraReducers: {
        [fetchHistory.fulfilled]: (state, action) => {
            if(action.payload!=null){
                state.value = [...action.payload,state.value];
            }
        }
      }
});

export const { add } = searchListSlice.actions;

export const selectSearches = state => state.searches.value;

export default searchListSlice.reducer;