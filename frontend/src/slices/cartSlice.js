import {createSlice} from "@reduxjs/toolkit";
import {toast} from "react-hot-toast";

const initialState = {
    TotalItems : localStorage.getItem("TotalItem") ? JSON.parse(localStorage.getItem("TotalItems")) : 0
};

const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducer:{
        setTotalItems(state, value){
            state.user = value.payload;
        },
        //add to Cart
        //remove cart
        //reset cart
    },
});

export const {setCart} = cartSlice.actions;
export default  cartSlice.reducer;
