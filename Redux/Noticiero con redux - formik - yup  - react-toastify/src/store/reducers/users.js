import { createSlice } from "@reduxjs/toolkit";
import { addToNewsLetter } from "../utils/thunks";

export const usersSlice = createSlice({
    name:'users',
    initialState:{
        action:{},
    },
    reducers:{
        clearNewsLetter:(state)=>{
            state.action = {};
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase( addToNewsLetter.fulfilled,(state,action)=>{
            state.action = action.payload  
        })
    }
})

export const { clearNewsLetter } = usersSlice.actions;
export default usersSlice.reducer;