import { Button, Row, Space, Col, Modal, Form } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from '../../index.module.less';

import info from '../../assets/images/info.png';
import detail from '../../assets/images/detail.png';

import { parseParams } from '@utils/utils';
import { useGetAlgorithmDetail } from '@api/algorithm';
import TaskModal from '@pages/arithmetic/components/task-modal';
import BorderBox from '@components/border-box';
const Detail: FC = (props) => {
    const navigator = useNavigate();
    const location = useLocation();
    const [modalVisible, setModalVisible] = useState(false);

    let name = useMemo(() => {
        let { name } = parseParams(location.search)
        return name;
    }, [])

    let { data: res, error } = useGetAlgorithmDetail(name);
    console.log('res', res)
    const dataDetail = res;

    return (
        <div className={styles.dataDetailWrap}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>{dataDetail?.AlgorithmNameCN}</h1>
                <Space >
                    <Button type='primary' onClick={() => navigator('/arithmetic/list')}>返回算法列表</Button>
                    <Button type='primary' onClick={() => setModalVisible(true)}>新建任务</Button>
                </Space>
            </header>
            <div className={styles.contentWrap}>
                {/* <BorderBox>
                    <Row gutter={16}>
                        <Col style={{ padding: 0 }} flex='289px'>
                            <img className={styles.imgStyle} src={s5}></img>
                        </Col>
                        <Col className={styles.context} flex='1'>
                            <span className={styles.contextTitle}>算法简介</span>
                            <p>{dataDetail?.introduction}</p>
                        </Col>
                    </Row>
                </BorderBox>
                <BorderBox>
                    <Row gutter={16}>
                        <Col className={styles.context} flex='1'>
                            <span className={styles.contextTitle} style={{ paddingLeft: 16 }}>算法详情</span>
                            <p style={{ paddingLeft: 16 }}>{dataDetail?.detail}</p>
                        </Col>
                        <Col style={{ padding: 10 }} flex='289px'>
                            <img className={styles.imgStyle} src={s3}></img>
                        </Col>
                    </Row>
                </BorderBox> */}
                <BorderBox style={{ width: 490, height: 380, marginRight: 50 }}>
                    <img className={styles.cardContentImg} src={info} alt="img" />
                    <div className={styles.cardContentText}>
                        <div className={styles.cardContentHeader}>
                            <span>算法简介</span>
                        </div>
                        <div className={styles.cardContentP}>
                           {
                               dataDetail?.introduction
                           }
                        </div>
                    </div>
                </BorderBox>
                <BorderBox style={{ width: 490, height: 380 }}>
                    <img className={styles.cardContentImg} src={detail} alt="img" />

                    <div className={styles.cardContentText}>
                        <div className={styles.cardContentHeader}>
                            <span>算法详情</span>
                        </div>
                        <div className={styles.cardContentP}>
                        {
                            dataDetail?.detail
                        }
                        </div>
                    </div>
                </BorderBox>
            </div>
            <TaskModal algorithmType={dataDetail?.AlgorithmType} algorithmNameEN ={dataDetail?.AlgorithmName}  algorithmId={dataDetail?.AlgorithmNameCN} modalVisible={modalVisible} algorithmName={dataDetail?.AlgorithmNameCN} onOk={() => { }} onCancel={() => { setModalVisible(false) }} />
        </div>
    )
}

export default Detail;