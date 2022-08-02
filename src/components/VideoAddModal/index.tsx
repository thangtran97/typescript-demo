import { Form, Input, message, Modal } from "antd";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    createVideo,
    selectIsCreateVideoModalVisible,
    selectIsLoading,
    setCreateVideoModalVisible,
} from "../../store/videoSlice";
import {
    VideoError,
    VideoFormState,
    VideoTouched,
} from "../../types/VideoType";
import validate from "validate.js";

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

const VideoAddModal: React.FC = () => {
    const [formState, setFormState] = useState<VideoFormState>(initFormState);
    const dispatch = useAppDispatch();
    const isCreateModalVisible = useAppSelector(
        selectIsCreateVideoModalVisible
    );
    const isLoading = useAppSelector(selectIsLoading);
    const [form] = Form.useForm();

    const handleOk = async () => {
        let resultAction = await dispatch(createVideo(formState.values));
        if (createVideo.fulfilled.match(resultAction)) {
            form.resetFields();
            setFormState(initFormState);
            message.success("Success");
            return;
        }
        if (createVideo.rejected.match(resultAction)) {
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
        dispatch(setCreateVideoModalVisible(false));
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
                title="Create new Video"
                visible={isCreateModalVisible}
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
                <Form form={form} layout="vertical" name="addVideoForm">
                    <Form.Item
                        name="label"
                        help={hasError("label") ? formState.errors.label : ""}
                        validateStatus={hasError("label") ? "error" : "success"}
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
                        validateStatus={hasError("url") ? "error" : "success"}
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
                        validateStatus={hasError("type") ? "error" : "success"}
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
            </Modal>
        </div>
    );
};

export default VideoAddModal;
