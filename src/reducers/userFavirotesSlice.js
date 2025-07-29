import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_ENDPOINT } from "../utils/constants";
import { Slide, toast } from "react-toastify";
import { getUserToken } from "./authSlice";

// Helper function to safely get user data
const getStoredUser = () => {
    try {
        const localStorageUser = localStorage.getItem('user');
        if (localStorageUser && localStorageUser !== 'null' && localStorageUser !== 'undefined') {
            return JSON.parse(localStorageUser);
        }
        
        const cookieUser = Cookies.get('user');
        if (cookieUser && cookieUser !== 'null' && cookieUser !== 'undefined') {
            return JSON.parse(cookieUser);
        }
        
        return null;
    } catch (error) {
        return null;
    }
};

// Initial State
const initialState = {
    items: [], // Always ensure this is an array
    status: 'idle',
    error: null
};

// Thunks
export const fetchFavorites = createAsyncThunk(
    'userFavorites/fetchFavorites',
    async (_, { rejectWithValue }) => {
        try {
            const user = getStoredUser();
            const token = getUserToken(user);
            
            if (!token) {
                throw new Error('No valid token found');
            }

            const response = await axios.get(`${API_ENDPOINT}my-favourites?per_page=15&page=1`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            // Handle the new JSON structure with pagination
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                return response.data.data; // Return the array of favorites
            } else if (Array.isArray(response.data)) {
                return response.data; // Fallback for old structure
            } else {
                return []; // Return empty array if no data
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addFavorite = createAsyncThunk(
    'userFavorites/addFavorite',
    async (service_id, { rejectWithValue }) => {
        try {
            const user = getStoredUser();
            const token = getUserToken(user);
            
            if (!token) {
                throw new Error('No valid token found');
            }

            const response = await axios.post(`${API_ENDPOINT}my-favourites`, { service_id }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            toast.error(`${error.response?.data?.message || error.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteFavorite = createAsyncThunk(
    'userFavorites/deleteFavorite',
    async (id) => {
        try {
            const user = getStoredUser();
            const token = getUserToken(user);
            
            if (!token) {
                throw new Error('No valid token found');
            }

            await axios.delete(`${API_ENDPOINT}my-favourites/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            return id;
        } catch (error) {
            toast.error(`${error.response?.data?.message || error.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        }
    }
);

// Redux Slice
const userFavoritesSlice = createSlice({
    name: "userFavorites",
    initialState,
    reducers: {
        setFavorites(state, action) {
            // Ensure we always set an array
            if (Array.isArray(action.payload)) {
                state.items = action.payload;
            } else {
                state.items = [];
            }
        },
        clearFavorites(state) {
            state.items = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFavorites.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                // Ensure payload is always an array
                if (payload && Array.isArray(payload)) {
                    state.items = payload;
                } else if (payload && payload.favourites && Array.isArray(payload.favourites)) {
                    state.items = payload.favourites;
                } else {
                    state.items = [];
                }
            })
            .addCase(fetchFavorites.rejected, (state, { payload }) => {
                state.status = 'failed';
                state.error = payload;
            })
            .addCase(addFavorite.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addFavorite.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                // Ensure state.items is an array
                if (!Array.isArray(state.items)) {
                    state.items = [];
                }
                // Ensure we're adding a proper favorite object
                if (payload && typeof payload === 'object') {
                    // If payload is a service object, create a favorite entry
                    if (payload.service_id) {
                        state.items.push(payload);
                    } else if (payload.data && payload.data.service_id) {
                        state.items.push(payload.data);
                    }
                }
            })
            .addCase(addFavorite.rejected, (state, { payload }) => {
                state.status = 'failed';
                state.error = payload;
            })
            .addCase(deleteFavorite.fulfilled, (state, { payload }) => {
                if (Array.isArray(state.items)) {
                    state.items = state.items.filter(item => item.service_id != payload);
                } else {
                    state.items = [];
                }
                state.status = 'succeeded';
            })
    }
});

export const { clearFavorites, setFavorites } = userFavoritesSlice.actions;
export const getFavorites = state => state.userFavorites.items;
export const getFavoritesStatus = state => state.userFavorites.status;
export const getFavoritesError = state => state.userFavorites.error;
export default userFavoritesSlice.reducer;