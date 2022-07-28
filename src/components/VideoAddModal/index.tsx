import { Form, Input, Modal } from "antd";
import React, { ChangeEvent, useState } from "react";
import axiosClient from "../../utils/axios";
import { AddVideoResponse, VideoInfo } from "../../types/VideoType";

interface PropTypes {
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

const VideoAddModal: React.FC<PropTypes> = (props) => {
    const [video, setVideo] = useState<VideoInfo>(initVideo);
    const [form] = Form.useForm();

    const handleOk = () => {
        axiosClient.post<AddVideoResponse>("/videos", video).then(res => {
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

    return (
        <div>
            <Modal
                title="Add new Video"
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
                    name="addVideoForm"
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

export default VideoAddModal;