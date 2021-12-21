import { Button, Space } from 'antd';
import React, { FC,useRef,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.less'
const chartPage = (Com:any) => {
    const Wrap: FC = (props) => {
        const location = useLocation();
        const navigator = useNavigate();
        const comRef = useRef(null);

        const handleDownload = () => {
            comRef.current?.downloadImage();
        }

        useEffect(() => {
            console.log('comRef',comRef)
        }, [])

        return (
            <div className={styles.chartContent}>
                <Com ref={ comRef} {...props} />
                <Space>
                    <Button className={styles.button} type='primary' onClick={() => navigator(-1)}>返回</Button>
                    <Button type='primary' onClick={() => handleDownload()}>下载图片</Button>
                </Space>
            </div>
        )
    }

    return Wrap;
}

export default chartPage;
