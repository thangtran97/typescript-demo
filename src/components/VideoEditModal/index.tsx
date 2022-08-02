import { Form, Input, message, Modal, Spin } from "antd";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    editVideo,
    getDetailVideo,
    selectIsEditVideoModalVisible,
    selectIsLoading,
    setEditVideoModalVisible,
} from "../../store/videoSlice";
import {
    VideoError,
    VideoFormState,
    VideoTouched,
} from "../../types/VideoType";
import validate from "validate.js";

interface PropTypes {
    id: number;
}

const initFormState = {
    isValid: false,
    values: {
        id: -1,
        label: "",
        url: "",
        type: "",
    },
    touched: {},
    errors: {},
};

const constraints = {
    label: {
        presence: {
            allowEmpty: false,
        },
    },
    url: {
        presence: {
            allowEmpty: false,
        },
    },
    type: {
        presence: {
            allowEmpty: false,
        },
    },
};

const VideoEditModal: React.FC<PropTypes> = props => {
    const [formState, setFormState] = useState<VideoFormState>(initFormState);
    const dispatch = useAppDispatch();
    const isEditModalVisible = useAppSelector(selectIsEditVideoModalVisible);
    const isLoading = useAppSelector(selectIsLoading);
    const [form] = Form.useForm();

    const getDetail = async () => {
        let resultAction = await dispatch(getDetailVideo(props.id));
        if (getDetailVideo.fulfilled.match(resultAction)) {
            let values = resultAction.payload.data;
            setFormState(prevState => ({
                ...prevState,
                values,
            }));
            form.setFieldsValue(values);
        }
    };

    const handleOk = async () => {
        let resultAction = await dispatch(editVideo(formState.values));
        if (editVideo.fulfilled.match(resultAction)) {
            form.resetFields();
            setFormState(initFormState);
            message.success("Success!");
            return;
        }
        if (editVideo.rejected.match(resultAction)) {
            setFormState(prevState => ({
                ...prevState,
                isValid: !resultAction.payload?.errors,
                errors: resultAction.payload?.errors || {},
            }));
            message.error("Error!");
            return;
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFormState(initFormState);
        dispatch(setEditVideoModalVisible(false));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormState(prevState => ({
            ...prevState,
            values: {
                ...prevState.values,
                [e.target.name]: e.target.value,
            },
            touched: {
                ...prevState.touched,
                [e.target.name]: true,
            },
        }));
    };

    const hasError = (field: keyof VideoTouched | keyof VideoError) =>
        !!(formState.touched[field] && formState.errors[field]);

    useEffect(() => {
        if (isEditModalVisible) {
            getDetail();
        }
    }, [isEditModalVisible]);

    useEffect(() => {
        let errors = validate(formState.values, constraints);
        setFormState(prevState => ({
            ...prevState,
            isValid: !errors,
            errors: errors || {},
        }));
    }, [formState.values]);

    return (
        <div>
            <Modal
                title="Edit Video"
                visible={isEditModalVisible}
                onCancel={() => {
                    handleCancel();
                }}
                onOk={() => {
                    form.validateFields().then(values => {
                        handleOk();
                    });
                }}
                okButtonProps={{
                    disabled: !formState.isValid,
                    loading: isLoading,
                }}
            >
                <Spin spinning={isLoading}>
                    <Form form={form} layout="vertical" name="addVideoForm">
                        <Form.Item
                            name="label"
                            help={
                                hasError("label") ? formState.errors.label : ""
                            }
                            validateStatus={
                                hasError("label") ? "error" : "success"
                            }
                        >
                            <Input
                                id="label"
                                name="label"
                                placeholder="Label"
                                value={formState.values.label}
                                onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            name="url"
                            help={hasError("url") ? formState.errors.url : ""}
                            validateStatus={
                                hasError("url") ? "error" : "success"
                            }
                        >
                            <Input
                                id="url"
                                name="url"
                                placeholder="URL"
                                style={{ marginTop: 10 }}
                                value={formState.values.url}
                                onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            name="type"
                            help={hasError("type") ? formState.errors.type : ""}
                            validateStatus={
                                hasError("type") ? "error" : "success"
                            }
                        >
                            <Input
                                id="type"
                                name="type"
                                placeholder="Type"
                                style={{ marginTop: 10 }}
                                value={formState.values.type}
                                onChange={handleChange}
                            />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

export default VideoEditModal;
