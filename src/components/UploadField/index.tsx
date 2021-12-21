import { ProFormUploadDragger } from '@ant-design/pro-form';
import { message, Upload } from 'antd';
import { uploadUrl } from '@api/request';
import { getToken } from '@utils/utils';
import React, { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import InboxOutlined from '@ant-design/icons/lib/icons/InboxOutlined';

const { Dragger } = Upload;

type FileType = {
    uid: string;
    name: string;
    status: 'done' | 'loading' | 'success';
    url: string;
}

type Props = {
    onChange?: (value: string) => void;
    value?: string;
    [key: string]: any;
}
const UploadWrap: FC<Props> = ({ onChange, value, ...props }) => {

    const [fileList, setFileList] = useState<any[]>([]);

    const handleChange = (info: any) => {
        const { status } = info.file;

        let fileList = [...info.fileList];
        if (status === 'error') {
            message.error('图片上传失败');
        }

        fileList = fileList.map(file => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });
        let file = null;
        if (fileList[0] && fileList[0].response && fileList[0].response.code === 200) {
            file = fileList[0].response.url;
        }

        //传递给form组件
        onChange?.(file)

        setFileList(fileList);
    }

    useEffect(() => {
        console.log('props', value);
        let name = value?.substring(value.lastIndexOf('/') +1)
        if (value) {
            setFileList([{
                uid: Math.random(),
                name: name,
                status: 'done',
                url: value,
            }])
        }
    }, [])

    return <Dragger
        maxCount={1}
        accept=".png,.jpg.jpng"
        headers={getToken()}
        name='file'
        fileList={fileList}
        onChange={(files) => handleChange(files)}
        {...props}
    >
        <p className="ant-upload-drag-icon">
            <InboxOutlined />
        </p>
        <p className="ant-upload-text">将图片拖到此处或点击选择</p>
        <p className="ant-upload-hint"> 仅支持上传jpg/png格式文件，单个文件不能超过500kb </p>
    </Dragger>

}

export default UploadWrap;