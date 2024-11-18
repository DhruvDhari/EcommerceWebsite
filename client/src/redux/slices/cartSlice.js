import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartCount: 0,  
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        incrementCartCount: (state) => {
            state.cartCount += 1;
        },
        decrementCartCount: (state) => {
            if (state.cartCount > 0) {
                state.cartCount -= 1;
            }
        },
        setCartCount:(state,action)=>{
            state.cartCount=action.payload;
        },
    },
});

export const { incrementCartCount, decrementCartCount,setCartCount } = cartSlice.actions;
export default cartSlice.reducer;
