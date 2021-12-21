import React, { FC, useCallback, useState } from 'react';
import styles from './index.module.less';
import excel from './assets/bgIcon.png';
import ppt from './assets/pptIcon.png'
import pdf from './assets/pdfIcon.png'
import txt from './assets/txtIcon.png'
import json from './assets/jsonIcon.png'
import wb from './assets/wbIcon.png'
import zip from './assets/zipIcon.png'
import { Space } from 'antd';
import classnames from 'classnames';

interface FileTypeProps {
    value?: FILE_TYPE;
    onChange?: (value: string) => void;
}

enum FILE_TYPE {
    word,
    pdf,
    xlsx,
    txt,
    zip,
    ppt,
    json
}

type FileItem = {
    img: string,
    value: FILE_TYPE,
    label: string
}

const FileTypeList: FileItem[] = [
    // {
    //     img: wb,
    //     value: FILE_TYPE.word,
    //     label: 'Word文件(*.docx)'
    // },
    // {
    //     img: pdf,
    //     value: FILE_TYPE.pdf,
    //     label: 'PDF文件(*.pdf)'
    // },
    {
        img: excel,
        value: FILE_TYPE.xlsx,
        label: 'Excel文件(2007或更高版本)(*.docx)'
    },
     {
        img: json,
        value: FILE_TYPE.json,
        label: 'JSON文件(*.json)'
    },
     // {
    //     img: txt,
    //     value: FILE_TYPE.txt,
    //     label: 'TXT文件(*.txt)'
    // },
    // {
    //     img: txt,
    //     value: FILE_TYPE.txt,
    //     label: 'TXT文件(*.txt)'
    // },
    // {
    //     img: zip,
    //     value: FILE_TYPE.zip,
    //     label: 'ZIP文件(*.zip)'
    // },
    // {
    //     img: ppt,
    //     value: FILE_TYPE.ppt,
    //     label: 'PPT文件(*.ppt)'
    // },

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
                        <div key={item.value} onClick={() => handleClick(item)}
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