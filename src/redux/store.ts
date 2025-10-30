import { configureStore } from "@reduxjs/toolkit";
import accessibilityReducer from './slices/accessibilitySlice'

export const store = configureStore({ 
    reducer : { 
        accessibility : accessibilityReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch