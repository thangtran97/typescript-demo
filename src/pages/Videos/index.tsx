import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import { Button, message, Modal, Table } from "antd";
import VideoAddModal from "../../components/VideoAddModal";
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PlayCircleOutlined,
} from "@ant-design/icons";
import VideoEditModal from "../../components/VideoEditModal";
import {
    deleteVideo,
    getAllVideo,
    selectIsCreateVideoModalVisible,
    selectIsEditVideoModalVisible,
    selectIsLoading,
    selectVideoList,
    setCreateVideoModalVisible,
    setEditVideoModalVisible,
} from "../../store/videoSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { VideoInfo } from "../../types/VideoType";

const { confirm } = Modal;

const Video: React.FC = () => {
    const [videoId, setVideoId] = useState<number>(-1);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLoading = useAppSelector(selectIsLoading);
    const isCreateModalVisible = useAppSelector(
        selectIsCreateVideoModalVisible
    );
    const isEditModalVisible = useAppSelector(selectIsEditVideoModalVisible);
    const videoList = useAppSelector(selectVideoList);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Label",
            dataIndex: "label",
            key: "label",
        },
        {
            title: "URL",
            dataIndex: "url",
            key: "url",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "",
            dataIndex: "action",
            key: "action",
            render: (text: string, record: VideoInfo, index: number) => {
                return (
                    <div>
                        <Button
                            shape="circle"
                            style={{ color: "green", borderColor: "green" }}
                            icon={<PlayCircleOutlined />}
                            onClick={event => play(record.id)}
                        />
                        <Button
                            shape="circle"
                            style={{
                                marginLeft: 10,
                                color: "blue",
                                borderColor: "blue",
                            }}
                            icon={<EditOutlined />}
                            onClick={event => showEditModal(record.id)}
                        />
                        <Button
                            shape="circle"
                            icon={<DeleteOutlined />}
                            style={{
                                marginLeft: 10,
                                color: "red",
                                borderColor: "red",
                            }}
                            onClick={event => showDeleteConfirm(index)}
                        />
                    </div>
                );
            },
        },
    ];

    const showAddModal = () => {
        dispatch(setCreateVideoModalVisible(true));
    };

    const showEditModal = (id: number) => {
        setVideoId(id);
        dispatch(setEditVideoModalVisible(true));
    };

    const play = (id: number) => {
        navigate(`/videos/play/${id}`);
    };

    const showDeleteConfirm = (id: number) => {
        confirm({
            title: "Are you sure delete this video?",
            icon: <ExclamationCircleOutlined />,
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                handleDelete(id);
            },
        });
    };

    const handleDelete = async (id: number) => {
        let resultAction = await dispatch(deleteVideo(id));
        if (deleteVideo.fulfilled.match(resultAction)) {
            message.success("Success!");
        } else if (deleteVideo.rejected.match(resultAction)) {
            message.error("Error!");
        }
    };

    useEffect(() => {
        dispatch(getAllVideo());
    }, [dispatch]);

    return (
        <Page
            content={
                <div>
                    <VideoAddModal />
                    <VideoEditModal id={videoId} />
                    <Button
                        type="primary"
                        style={{
                            float: "right",
                            marginTop: 10,
                            marginBottom: 30,
                        }}
                        onClick={showAddModal}
                        disabled={
                            isLoading &&
                            !isCreateModalVisible &&
                            !isEditModalVisible
                        }
                    >
                        New
                    </Button>
                    <Table
                        loading={
                            isLoading &&
                            !isCreateModalVisible &&
                            !isEditModalVisible
                        }
                        style={{ marginTop: 50 }}
                        dataSource={videoList?.map((d, i) => ({
                            key: i,
                            ...d,
                        }))}
                        columns={columns}
                    />
                </div>
            }
        />
    );
};

export default Video;
