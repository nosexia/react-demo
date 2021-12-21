import React, { FC, useCallback, useState } from 'react';
import styles from './index.module.less';
import excel from './assets/v1.png';
import pdf from './assets/v2.png'
import wb from './assets/v3.png'
import { Space } from 'antd';
import classnames from 'classnames';

interface FileTypeProps {
    value?: FILE_TYPE;
    onChange?: (value: string) => void;
}

enum FILE_TYPE {
    word,
    pdf,
    excel,
    txt,
    zip,
    ppt,
}

type FileItem = {
    img: string,
    value: FILE_TYPE,
    label: string
}

const FileTypeList: FileItem[] = [
    {
        img: wb,
        value: FILE_TYPE.word,
        label: '智慧园区'
    },
    {
        img: pdf,
        value: FILE_TYPE.pdf,
        label: '智慧城市'
    },
    {
        img: excel,
        value: FILE_TYPE.excel,
        label: '智慧城市'
    }
]

const FileTypeSelect: FC<FileTypeProps> = (props) => {
    const [fileType, setFileType] = useState<FILE_TYPE | undefined>(props.value)

    const handleClick = (item: FileItem) => {
        props.onChange?.(FILE_TYPE[item.value])
        setFileType(item.value)
    }

    return (
        <div className={styles.flleTypeWrap}>
            <Space size={[8, 16]} wrap>
                {
                    FileTypeList.map(item => (
                        <div onClick={() => handleClick(item)}
                            key={item.value}
                            className={classnames(styles.fileTypeView, item.value === fileType && styles.fileTypeViewActive)}>
                            <img src={item.img} alt={item.label} />
                            <span>{item.label}</span>
                        </div>
                    ))
                }

            </Space>
        </div>
    )

}

export default FileTypeSelect;