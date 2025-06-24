import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_ENDPOINT } from "../utils/constants";
import { Slide, toast } from "react-toastify";

// Initial State
const initialState = {
    items: [],
    status: 'idle',
    error: null
};

// Thunks
export const fetchFavorites = createAsyncThunk(
    'userFavorites/fetchFavorites',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_ENDPOINT}my-favourites?per_page=1&page=1`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')) || Cookies.get('user')}`,
                }
            });

            return response.data.data; // Adjust based on actual response structure
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addFavorite = createAsyncThunk(
    'userFavorites/addFavorite',
    async (service_id, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_ENDPOINT}my-favourites`, { service_id }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')) || Cookies.get('user')}`,
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
            await axios.delete(`${API_ENDPOINT}favourites/delete?service_id=${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')) || Cookies.get('user')}`,
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
            console.error(error);
        }
    }
);

// Redux Slice
const userFavoritesSlice = createSlice({
    name: "userFavorites",
    initialState,
    reducers: {
        setFavorites(state, action) {
            state.items = action.payload;
        },
        clearFavorites(state) {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFavorites.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                state.items = payload;
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
                state.items.push(payload);
            })
            .addCase(addFavorite.rejected, (state, { payload }) => {
                state.status = 'failed';
                state.error = payload;
            })
            .addCase(deleteFavorite.fulfilled, (state, { payload }) => {
                state.items = state.items.filter(item => item.service_id != payload);
                state.status = 'succeeded';
            })
    }
});

export const { clearFavorites, setFavorites } = userFavoritesSlice.actions;
export const getFavorites = state => state.userFavorites.items;
export const getFavoritesStatus = state => state.userFavorites.status;
export const getFavoritesError = state => state.userFavorites.error;
export default userFavoritesSlice.reducer;