import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import userReducer from "./reducers/userSlice";
import cartReducer from './reducers/cartSlice';
import userFavirotesReducer from './reducers/userFavirotesSlice';
import audioReducer from './reducers/audioSlice';

const store = configureStore({
    reducer: {
        user: authReducer,
        userInfo: userReducer,
        cart: cartReducer,
        userFavorites: userFavirotesReducer,
        audio: audioReducer,
    }
})


export default store;