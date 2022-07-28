import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import axiosClient from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import { Button, Table } from "antd";
import VideoAddModal from "../../components/VideoAddModal";
import { DeleteOutlined, EditOutlined, PlayCircleOutlined } from "@ant-design/icons";
import VideoEditModal from "../../components/VideoEditModal";
import { DeleteVideoResponse, GetListVideoResponse, VideoInfo } from "../../types/VideoType";
import { useDispatch } from "react-redux";

const Video: React.FC = () => {
    const [videoList, setVideoList] = useState<VideoInfo[]>([]);
    const [videoId, setVideoId] = useState<number>(-1);
    const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Label",
            dataIndex: "label",
            key: "label"
        },
        {
            title: "URL",
            dataIndex: "url",
            key: "url"
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type"
        },
        {
            title: "",
            dataIndex: "action",
            key: "action",
            render: (text: string, record: VideoInfo, index: number) => {
                return <div>
                    <Button
                        shape="circle"
                        style={{color: "green", borderColor: "green"}}
                        icon={<PlayCircleOutlined/>}
                        onClick={event => play(record.id)}
                    />
                    <Button
                        shape="circle"
                        style={{ marginLeft: 10, color: "blue", borderColor: "blue"}}
                        icon={<EditOutlined/>}
                        onClick={event => showEditModal(record.id)}
                    />
                    <Button shape="circle"
                            icon={<DeleteOutlined />}
                            style={{ marginLeft: 10, color: "red", borderColor: "red" }}
                            onClick={event => handleDelete(index)}
                    />
                </div>;
            }
        }
    ];

    const showAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleCloseAdd = () => {
        setIsAddModalVisible(false);
    };

    const showEditModal = (id: number) => {
        setVideoId(id);
        setIsEditModalVisible(true);
    };

    const play = (id: number) => {
        setVideoId(id);
        navigate(`/videos/play/${id}`);
    };

    const handleCloseEdit = () => {
        setIsEditModalVisible(false);
    };

    const getAll = async () => {
        await axiosClient.get<GetListVideoResponse>("/videos").then(res => {
            setVideoList(res.data.data);
        });
    };

    const handleDelete = async (id: number) => {
        await axiosClient.delete<DeleteVideoResponse>(`videos/${id}`).then(res => {
            let success = res.data.success;
            if (success) {
                getAll();
            }
        });
    };

    useEffect(() => {
        getAll();
    }, []);

    return (
        <Page content={
            <div>
                <VideoAddModal
                    isModalVisible={isAddModalVisible}
                    handleClose={handleCloseAdd}
                    getAll={getAll}
                />
                <VideoEditModal
                    id={videoId}
                    isModalVisible={isEditModalVisible}
                    handleClose={handleCloseEdit}
                    getAll={getAll}
                />
                <Button style={{ marginTop: 10 }} type="primary" onClick={showAddModal}>
                    Add
                </Button>
                <Table
                    style={{ marginTop: 50 }}
                    dataSource={videoList.map((d, i) => ({ key: i, ...d }))}
                    columns={columns}
                />
            </div>}
        />
    );
};

export default Video;