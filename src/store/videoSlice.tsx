import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import VideoService from "../services/VideoService";
import {
    CreateVideoResponse,
    DeleteVideoResponse,
    EditVideoResponse,
    GetListVideoResponse,
    GetVideoResponse,
    VideoInfo,
    VideoState,
} from "../types/VideoType";
import { RootState } from "./index";

const initialState: VideoState = {
    isLoading: false,
    isSuccessful: false,
    isCreateModalVisible: false,
    isEditModalVisible: false,
    values: [],
    errors: {},
};

export const getAllVideo = createAsyncThunk("videos/getAll", async () => {
    let response = await VideoService.getAll();
    return response.data as GetListVideoResponse;
});

export const getDetailVideo = createAsyncThunk<GetVideoResponse, number>(
    "videos/getDetail",
    async (id, thunkAPI) => {
        let response = await VideoService.getDetail(id);
        return response.data as GetVideoResponse;
    }
);

export const createVideo = createAsyncThunk<
    GetListVideoResponse,
    VideoInfo,
    {
        rejectValue: CreateVideoResponse;
    }
>("videos/create", async (video, thunkAPI) => {
    let response = await VideoService.create(video);
    if (response.data.success) {
        let getAllResponse = await VideoService.getAll();
        return getAllResponse.data as GetListVideoResponse;
    }
    return thunkAPI.rejectWithValue(response.data as CreateVideoResponse);
});

export const editVideo = createAsyncThunk<
    GetListVideoResponse,
    VideoInfo,
    {
        rejectValue: EditVideoResponse;
    }
>("videos/edit", async (video, thunkAPI) => {
    let response = await VideoService.edit(video);
    if (response.data.success) {
        let getAllResponse = await VideoService.getAll();
        return getAllResponse.data as GetListVideoResponse;
    }
    return thunkAPI.rejectWithValue(response.data as EditVideoResponse);
});

export const deleteVideo = createAsyncThunk(
    "videos/delete",
    async (id: number, thunkAPI) => {
        let response = await VideoService.remove(id);
        if (response.data.success) {
            let getAllResponse = await VideoService.getAll();
            return getAllResponse.data as GetListVideoResponse;
        }
        return thunkAPI.rejectWithValue(response.data as DeleteVideoResponse);
    }
);

export const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setCreateVideoModalVisible: (state, action) => {
            state.isCreateModalVisible = action.payload;
        },
        setEditVideoModalVisible: (state, action) => {
            state.isEditModalVisible = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(getAllVideo.pending, state => {
            state.isLoading = true;
        });

        builder.addCase(getAllVideo.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccessful = true;
            state.values = action.payload.data;
        });

        builder.addCase(getDetailVideo.pending, state => {
            state.isLoading = true;
        });

        builder.addCase(getDetailVideo.fulfilled, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(createVideo.pending, state => {
            state.isLoading = true;
        });

        builder.addCase(createVideo.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccessful = true;
            state.isCreateModalVisible = false;
            state.values = action.payload.data;
        });

        builder.addCase(createVideo.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccessful = false;
            state.isCreateModalVisible = true;
            state.errors = action.payload?.errors || action.error;
        });

        builder.addCase(editVideo.pending, state => {
            state.isLoading = true;
        });

        builder.addCase(editVideo.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccessful = true;
            state.isEditModalVisible = false;
            state.values = action.payload.data;
        });

        builder.addCase(editVideo.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccessful = false;
            state.isEditModalVisible = true;
            state.errors = action.payload?.errors || action.error;
        });

        builder.addCase(deleteVideo.pending, state => {
            state.isLoading = true;
        });

        builder.addCase(deleteVideo.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccessful = true;
            state.values = action.payload.data;
        });

        builder.addCase(deleteVideo.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccessful = false;
        });
    },
});

export const { setCreateVideoModalVisible, setEditVideoModalVisible } =
    videoSlice.actions;

export const selectIsLoading = (state: RootState) => state.video.isLoading;
export const selectIsSuccessful = (state: RootState) =>
    state.video.isSuccessful;
export const selectIsCreateVideoModalVisible = (state: RootState) =>
    state.video.isCreateModalVisible;
export const selectIsEditVideoModalVisible = (state: RootState) =>
    state.video.isEditModalVisible;
export const selectVideoList = (state: RootState) => state.video.values;
export const selectErrors = (state: RootState) => state.video.errors;

export default videoSlice.reducer;
