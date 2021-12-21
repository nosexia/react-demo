import React, { FC, useCallback, useState } from 'react';
import styles from './index.module.less';
import lines from '../../assets/images/e1.png';
import line from '../../assets/images/e2.png';
import area from '../../assets/images/e3.png';
import column from '../../assets/images/e4.png';
import bar from '../../assets/images/e5.png';
import pie from '../../assets/images/e6.png';
import scatter from '../../assets/images/e7.png';
import aggregation from '../../assets/images/e8.png';
import { Col, Row, Space } from 'antd';
import classnames from 'classnames';

interface FileTypeProps {
    value?: CHART_TYPE;
    onChange?: (value: string) => void;
    selectChange?: (value: string) => void;
}

export enum CHART_TYPE {
    area,
    bar,//条形图
    column,//柱状图
    line,
    lines,
    pie,
    // rose,
    aggregation,//聚合
    // histogram,
    scatter,//散点图
}

type FileItem = {
    img: string,
    value: CHART_TYPE,
    label: string
}

const FileTypeList: FileItem[] = [
    {
        img: area,
        value: CHART_TYPE.area,
        label: '面积图'
    },
    {
        img: bar,
        value: CHART_TYPE.bar,
        label: '条形图'
    },
   
    {
        img: line,
        value: CHART_TYPE.line,
        label: '折线图'
    },
    {
        img: lines,
        value: CHART_TYPE.lines,
        label: '折线图(多条)'
    },
    {
        img: pie,
        value: CHART_TYPE.pie,
        label: '饼图'
    },
    // {
    //     img: pie,
    //     value: CHART_TYPE.rose,
    //     label: '玫瑰图'
    // },
    {
        img: scatter,
        value: CHART_TYPE.scatter,
        label: '散点图'
    },
    {
        img: column,
        value: CHART_TYPE.column,
        label: '柱状图'
    },
    {
        img: aggregation,
        value: CHART_TYPE.aggregation,
        label: '散点四象图'
    },
]

const FileTypeSelect: FC<FileTypeProps> = (props) => {
    const [fileType, setFileType] = useState<CHART_TYPE | undefined>(props.value)

    const handleClick = (item: FileItem) => {
        props.onChange?.(CHART_TYPE[item.value])
        props.selectChange?.(CHART_TYPE[item.value])
        setFileType(item.value)
    }

    return (
        <div className={styles.flleTypeWrap}>
            <Row gutter={[16, 16]} >
                {
                    FileTypeList.map(item => (
                        <Col key={item.value} style={{ display:'flex',justifyContent: 'center', alignItems: 'center' }} span={12}>
                            <div onClick={() => handleClick(item)}
                                key={item.value}
                                className={classnames(styles.fileTypeView, item.value === fileType && styles.fileTypeViewActive)}>
                                {/* <span>{item.label}</span> */}
                                <img src={item.img} alt={item.label} />
                            </div>
                        </Col>

                    ))
                }

            </Row>
        </div>
    )

}

export default FileTypeSelect;