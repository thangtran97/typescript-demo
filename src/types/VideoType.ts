export interface VideoInfo {
    id: number;
    label: string;
    url: string;
    type: string;
}

export interface VideoError {
    label?: string;
    url?: string;
    type?: string;
}

export interface VideoTouched {
    label?: boolean;
    url?: boolean;
    type?: boolean;
}

export interface VideoState {
    isLoading: boolean;
    isSuccessful: boolean;
    isCreateModalVisible: boolean;
    isEditModalVisible: boolean;
    values: VideoInfo[];
    errors: VideoError;
}

export interface VideoFormState {
    isValid: boolean;
    values: VideoInfo;
    touched: VideoTouched;
    errors: VideoError;
}

export interface GetListVideoResponse {
    success: boolean;
    total: number;
    data: VideoInfo[];
    errors: {};
}

export interface GetVideoResponse {
    success: boolean;
    data: VideoInfo;
    errors: {};
}

export interface CreateVideoResponse {
    success: boolean;
    errors: {};
}

export interface EditVideoResponse {
    success: boolean;
    errors: {};
}

export interface DeleteVideoResponse {
    success: boolean;
    errors: {};
}
