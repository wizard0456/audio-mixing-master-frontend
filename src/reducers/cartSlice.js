import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast, Slide } from 'react-toastify';
import Cookies from 'js-cookie';
import { API_ENDPOINT } from '../utils/constants';
import { getUserToken } from './authSlice';

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

const initialState = {
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
    status: 'idle',
    error: null,
};

// Thunks
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ services, isIntialPageLoad }, { rejectWithValue }) => {
        try {

            const response = await axios({
                url: `${API_ENDPOINT}cart`,
                method: "POST",
                data: {
                    "services": services.map((service) => {
                        return {
                            "id": service.service_id,
                            "qty": service.qty,
                            "service_name": service.service_name,
                            "price": service.price,
                            "total_price": service.total_price,
                            "service_type": service.service_type,
                            "paypal_plan_id": service.paypal_plan_id,
                            "stripe_plan_id": service.stripe_plan_id
                        }
                    })
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${getUserToken(getStoredUser())}`,
                }
            });

            return { data: response.data, isIntialPageLoad };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateCart = createAsyncThunk(
    'cart/updateCart',
    async (service, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_ENDPOINT}cart/${service.service_id}`, {
                "qty": service.qty,
                "price": service.price,
                "total_price": service.total_price
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${getUserToken(getStoredUser())}`,
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (serviceId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_ENDPOINT}cart/${serviceId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${getUserToken(getStoredUser())}`,
                }
            });
            return serviceId;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_ENDPOINT}cart`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${getUserToken(getStoredUser())}`,
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, { payload }) => {
            const itemIndex = state.items.findIndex(item => item.service_id == payload.service_id);
            if (itemIndex >= 0) {
                state.items[itemIndex].qty = Number(state.items[itemIndex].qty) + Number(payload.qty);
                state.items[itemIndex].total_price = Number(state.items[itemIndex].total_price) + Number(payload.total_price);
            } else {
                state.items.push(payload);
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items));
            toast.success('Item added to cart', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Slide
            });
        },
        updateItem: (state, { payload }) => {
            const itemIndex = state.items.findIndex(item => item.service_id == payload.service_id);
            if (itemIndex >= 0) {
                state.items[itemIndex].qty = +payload.qty;
                state.items[itemIndex].total_price = +payload.total_price;
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeItem: (state, { payload }) => {
            state.items = state.items.filter(item => item.service_id != payload);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cartItems');
        },
        saveCartItemsToLocalStorage: (state) => {
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addToCart.fulfilled, (state, { payload }) => {
                const { data, isIntialPageLoad } = payload;
                
                // Handle different response structures
                let cartData = data;
                
                // If data has a data property, use that
                if (data && data.data) {
                    cartData = data.data.cartItems || data.data;
                } else if (data && Array.isArray(data)) {
                    cartData = data;
                } else {
                    // If data is not an array, set empty array
                    cartData = [];
                }
                
                // Ensure cartData is an array
                if (!Array.isArray(cartData)) {
                    cartData = [];
                }
                
                state.items = cartData.map(service => {
                    return {
                        service_id: service.service_id || service.id,
                        service_name: service.service?.name || service.name || "Dommy Name here for now",
                        qty: Number(service.qty) || 0,
                        total_price: Number(service.total_price) || 0,
                        price: Number(service.price) || 0,
                        service_type: service.service?.service_type || service.service_type,
                        paypal_plan_id: service.service?.paypal_plan_id || service.paypal_plan_id,
                        stripe_plan_id: service.service?.stripe_plan_id || service.stripe_plan_id
                    }
                });

                localStorage.removeItem('cartItems');
                state.status = 'succeeded';

                if (isIntialPageLoad) return; // Checking Initial Page Load

                toast.success('Items added to cart', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Slide
                });
            })
            .addCase(addToCart.rejected, (state, { payload }) => {
                state.status = 'failed';
                state.error = payload;
                
                // Show error toast
                toast.error('Failed to add item to cart', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Slide
                });
            })
            .addCase(updateCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCart.fulfilled, (state, { payload }) => {
                // Handle different response structures
                let updateData = payload;
                
                // If payload has a data property, use that
                if (payload && payload.data) {
                    updateData = payload.data;
                }
                
                // Only update if we have valid data
                if (updateData && updateData.service_id) {
                    const itemIndex = state.items.findIndex(item => item.service_id == updateData.service_id);
                    if (itemIndex >= 0) {
                        state.items[itemIndex].qty = Number(updateData.qty) || state.items[itemIndex].qty;
                        state.items[itemIndex].total_price = Number(updateData.total_price) || state.items[itemIndex].total_price;
                    }
                }
                state.status = 'succeeded';
            })
            .addCase(updateCart.rejected, (state, { payload }) => {
                state.status = 'failed';
                state.error = payload;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeFromCart.fulfilled, (state, { payload }) => {
                state.items = state.items.filter(item => item.service_id !== payload);
                state.status = 'succeeded';
            })
            .addCase(removeFromCart.rejected, (state, { payload }) => {
                state.status = 'failed';
                state.error = payload;
            })
            .addCase(fetchCartItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCartItems.fulfilled, (state, { payload }) => {
                // Handle different response structures
                let cartData = payload;
                
                // If payload has a data property, use that
                if (payload && payload.data) {
                    cartData = payload.data.cartItems;
                } else if (payload && Array.isArray(payload)) {
                    cartData = payload;
                } else {
                    // If payload is not an array, set empty array
                    cartData = [];
                }
                
                // Ensure cartData is an array
                if (!Array.isArray(cartData)) {
                    cartData = [];
                }
                
                state.items = cartData.map(item => ({
                    service_id: item.service_id,
                    service_name: item.service?.name || "Dommy Name here for now",
                    qty: Number(item.qty) || 0,
                    price: Number(item.price) || 0,
                    total_price: Number(item.total_price) || 0,
                    service_type: item.service?.service_type,
                    paypal_plan_id: item.service?.paypal_plan_id,
                    stripe_plan_id: item.service?.stripe_plan_id
                }));
                state.status = 'succeeded';
            })
            .addCase(fetchCartItems.rejected, (state, { payload }) => {
                state.status = 'failed';
                state.error = payload;
            });
    },
});

export const { addItem, updateItem, removeItem, clearCart, saveCartItemsToLocalStorage } = cartSlice.actions;
export const getCartItems = state => state.cart.items;
export default cartSlice.reducer;