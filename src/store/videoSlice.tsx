import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetListVideoResponse, GetVideoResponse, VideoInfo, VideoState } from "../types/VideoType";
import VideoService from "../services/VideoApi";

const initialState: VideoState = {
    isLoading: false,
    values: []
};

export const getAllVideo = createAsyncThunk(
    "videos/getAll",
    async () => {
        const res = await VideoService.getAll();
        return res.data;
    }
);

// Config slice
export const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllVideo.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(getAllVideo.fulfilled, (state, action) => {
           state.values = action.payload.data;
        });
    }
});

export const selectIsLoading = (state: VideoState) => state.isLoading;
export const selectVideos = (state: VideoState) => state.values;

export default videoSlice.reducer;
