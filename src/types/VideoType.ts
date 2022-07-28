export interface VideoInfo {
    id: number;
    label: string;
    url: string;
    type: string;
};

export interface VideoState {
    isLoading: boolean;
    values: VideoInfo[];
}

export interface GetListVideoResponse {
    success: boolean;
    total: number;
    data: VideoInfo[];
};

export interface GetVideoResponse {
    success: boolean;
    data: VideoInfo;
};

export interface AddVideoResponse {
    success: boolean;
};

export interface EditVideoResponse {
    success: boolean;
};

export interface DeleteVideoResponse {
    success: boolean;
};