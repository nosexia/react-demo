import { useGetDataDetail } from '@/api/data';
import { Button, Row, Space, Col, Dropdown, Menu, message, Tabs, Tag } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ProSkeleton from '@ant-design/pro-skeleton';
import { TableOutlined, AreaChartOutlined, LeftCircleOutlined, ExportOutlined } from '@ant-design/icons';

import styles from './index.module.less';

import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { reset } from 'cypress/types/sinon';
import PreviewTable from '@pages/data/components/previewTable';
import BorderBox from '@components/border-box';
import classnames from 'classnames';
const { TabPane } = Tabs;
import cardHeader from './assets/cardHeader.png';
import Export from '@pages/data/components/export';
type Detail = {
    dataSetDescribe: string;
    dataSetDescribeImg: string;
    dataSetDetail: string;
    dataSetDetailImg: string;
    dataSetName: string;
    dataSetDescribeKeyw:string;
    dataSetDescribeType:string;
}
const history = createBrowserHistory();
const Detail: FC = (props) => {
    const location = useLocation();
    const navigator = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    let id = useMemo(() => {
        let { pathname } = location;
        let id = pathname.substring(pathname.lastIndexOf('/') + 1)
        return id;
    }, [location])

    let { data: res, loading, error } = useGetDataDetail(id);
    //导致纯函数报错
    if (error) {
        message.error(error?.msg)
    }

    if (!res) return <ProSkeleton type="descriptions" />;

    const dataDetail: Detail = res as any as Detail;

    const handleMenuClick = (key: number) => {
        if (key === 2) {
            navigator(`/data/browsing/chart?id=${id}`)
        } else {
            setIsModalVisible(true)
        }
    }

    // const menu = (
    //     <Menu onClick={handleMenuClick}>
    //         <Menu.Item key="1" icon={<TableOutlined />}>
    //             表格
    //         </Menu.Item>
    //         <Menu.Item key="2" icon={<AreaChartOutlined />}>
    //             图表
    //         </Menu.Item>
    //     </Menu>
    // );



    return (
        <div className={styles.container}>
            <PreviewTable id={id} isModalVisible={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)} />
            {/* <header className={styles.header}>
                <h1 className={styles.headerTitle}>{dataDetail.dataSetName}</h1>
                <Space >
                    <Button type='primary' onClick={() => navigator('/data/list')}>返回数据列表</Button>
                    <Button type='primary' onClick={() => navigator(`/data/export?id=${id}`)}>数据导出</Button>
                    <Dropdown overlay={menu}>
                        <Button type='primary'>
                            数据预览 <DownOutlined />
                        </Button>
                    </Dropdown>
                </Space>
            </header> */}

            <Export id={id as unknown as string} modalVisible={exportModalVisible} onOk={() => setExportModalVisible(false)} onCancel={() => setExportModalVisible(false)}></Export>


            <div className={styles.header}>
                <span className={styles.titleEn}>{"CASE DATA SET"}</span>
                <span className={styles.title}>{dataDetail.dataSetName}</span>
                <Space >
                    <Button type='primary' icon={<LeftCircleOutlined />} onClick={() => navigator('/data/list')}>返回数据列表</Button>
                    <Button type='primary' icon={<ExportOutlined />} onClick={() => setExportModalVisible(true)}>数据导出</Button>
                    <Button type='primary' icon={<TableOutlined />} onClick={() => handleMenuClick(1)}>数据表格浏览</Button>

                    <Button type='primary' icon={<AreaChartOutlined />} onClick={() => handleMenuClick(2)}>数据图表浏览</Button>

                    {/* <Dropdown overlay={menu}>
                        <Button type='primary'>
                            数据预览 <DownOutlined />
                        </Button>
                    </Dropdown> */}
                </Space>

                <Space style={{ marginTop: 20 }}>
                    <Space >
                        <Tag style={{ borderRadius: 15 }} color="#7ed0f5">关键词: </Tag>
                        <span>{dataDetail?.dataSetDescribeKeyw}</span>
                    </Space>
                    <Space style={{ marginLeft: 40 }}>
                        <Tag style={{ borderRadius: 15 }} color="#7ed0f5">分类: </Tag>
                      <span>{dataDetail?.dataSetDescribeType}</span>
                    </Space>
                </Space>

            </div>

            <div className={classnames(styles.contentWrap, 'tabs-wrap')}>
                <Tabs defaultActiveKey="1" centered>
                    <TabPane tab="背景介绍" key="1">
                        <BorderBox>
                            <img className={styles.cardHeaderImg} src={dataDetail.dataSetDescribeImg !== "" ? '/dev-api'+dataDetail.dataSetDescribeImg : cardHeader} alt="header" />
                            <div className={styles.context}>
                                <span className={styles.cardTitle}>背景介绍
                                </span>
                                <p dangerouslySetInnerHTML={{ __html: dataDetail.dataSetDescribe }}></p>
                            </div>
                        </BorderBox>
                    </TabPane>
                    <TabPane tab="数据描述" key="2">
                        <BorderBox>
                            <img className={styles.cardHeaderImg} src={dataDetail.dataSetDetailImg !== "" ? '/dev-api'+dataDetail.dataSetDetailImg : cardHeader} alt="header" />
                            <div className={styles.context}>
                                <span className={styles.cardTitle}>数据描述
                                </span>
                                <p dangerouslySetInnerHTML={{ __html: dataDetail.dataSetDetail }}></p>
                            </div>
                        </BorderBox>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default Detail;