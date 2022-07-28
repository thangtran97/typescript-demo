import { Form, Input, Modal } from "antd";
import React, { ChangeEvent, useEffect, useState } from "react";
import axiosClient from "../../utils/axios";
import { EditVideoResponse, GetVideoResponse, VideoInfo } from "../../types/VideoType";

interface PropTypes {
    id: number;
    isModalVisible: boolean;
    handleClose: Function;
    getAll: Function;
}

const initVideo = {
    id: -1,
    label: "",
    url: "",
    type: ""
};

const VideoEditModal: React.FC<PropTypes> = (props) => {
    const [video, setVideo] = useState<VideoInfo>(initVideo);
    const [form] = Form.useForm();

    const getDetail = async () => {
        await axiosClient.get<GetVideoResponse>(`/videos/${props.id}`).then(res => {
            setVideo(res.data.data);
            form.setFieldsValue(res.data.data);
        });
    };

    const handleOk = () => {
        axiosClient.put<EditVideoResponse>(`/videos/${props.id}`, video).then(res => {
            let success = res.data.success;
            if (success) {
                props.getAll();
                props.handleClose();
            }
        });
    };

    const handleCancel = () => {
        props.handleClose();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setVideo(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        if (props.id != -1)
            getDetail();
    }, [props.id]);

    return (
        <div>
            <Modal
                title="Edit Video"
                visible={props.isModalVisible}
                onCancel={() => {
                    form.resetFields();
                    handleCancel();
                }}
                onOk={() => {
                    form.validateFields().then(values => {
                        form.resetFields();
                        handleOk();
                    });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="editVideoForm"
                    initialValues={video}

                >
                    <Form.Item
                        name="label"
                        rules={[{ required: true, message: "Please input the Label!" }]}
                    >
                        <Input
                            id="label"
                            name="label"
                            placeholder="Label"
                            value={video.label}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item
                        name="url"
                        rules={[{ required: true, message: "Please input the URL!" }]}
                    >
                        <Input
                            id="url"
                            name="url"
                            placeholder="URL"
                            style={{ marginTop: 10 }}
                            value={video.url}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        rules={[{ required: true, message: "Please input the Type!" }]}
                    >
                        <Input
                            id="type"
                            name="type"
                            placeholder="Type"
                            style={{ marginTop: 10 }}
                            value={video.type}
                            onChange={handleChange}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default VideoEditModal;