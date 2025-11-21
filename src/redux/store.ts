import { configureStore } from "@reduxjs/toolkit";
import accessibilityReducer from './slices/accessibilitySlice'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import orderHistoryReducer from './slices/orderHistorySlice'

export const store = configureStore({ 
    reducer : { 
        accessibility : accessibilityReducer,
        auth: authReducer,
        cart: cartReducer,
        orderHistory: orderHistoryReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch