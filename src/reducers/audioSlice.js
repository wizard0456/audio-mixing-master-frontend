// store/audioSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentAudioId: null,
};

const audioSlice = createSlice({
    name: 'audio',
    initialState,
    reducers: {
        setCurrentAudio: (state, action) => {
            state.currentAudioId = action.payload;
        },
    },
});

export const { setCurrentAudio } = audioSlice.actions;

export default audioSlice.reducer;
