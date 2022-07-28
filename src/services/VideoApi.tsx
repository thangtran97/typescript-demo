import axiosClient from "../utils/axios";
import {
    AddVideoResponse, DeleteVideoResponse,
    EditVideoResponse,
    GetListVideoResponse,
    GetVideoResponse,
    VideoInfo
} from "../types/VideoType";

export const getAll = async () => {
    return await axiosClient.get<GetListVideoResponse>("/videos");
};

export const getDetail = async (id: number) => {
    return await axiosClient.get<GetVideoResponse>(`/videos/${id}`);
};

export const create = async (video: VideoInfo) => {
    return await axiosClient.post<AddVideoResponse>("/videos", video);
};

export const edit = async (id: number, video: VideoInfo) => {
    return await axiosClient.put<EditVideoResponse>(`/videos/${id}`, video);
};

export const remove = async (id: number) => {
    return await axiosClient.delete<DeleteVideoResponse>(`videos/${id}`);
};

const VideoService = {
    getAll,
    getDetail,
    create,
    edit,
    remove
};

export default VideoService;