import { useGetDataDetail } from '@/api/data';
import { Button, Row, Space, Col, Dropdown, Menu, Form, Upload, message, Input } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ProSkeleton from '@ant-design/pro-skeleton';

import styles from '../../index.module.less';
import ProForm, { ProFormTextArea, ProFormUploadButton, ProFormUploadDragger } from '@ant-design/pro-form';
import Dragger from 'antd/lib/upload/Dragger';
import InboxOutlined from '@ant-design/icons/lib/icons/InboxOutlined';
import ProCard from '@ant-design/pro-card';

import { post, uploadUrl } from '@/api/request'
import { getToken } from '@utils/utils';
import UploadField from '@components/UploadField';
import BorderBox from '@components/border-box';
type Detail = {
    dataSetDescribe: string;
    dataSetDescribeImg: string;
    dataSetDetail: string;
    dataSetDetailImg: string;
    dataSetName: string;
    dataSetDescribeKeyw: string;
    dataSetDescribeType: string;
}
const history = createBrowserHistory();
const Edit: FC = (props) => {
    const navigator = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [keywords, setKeywords] = useState('')
    const [type, setType] = useState('')
    let id = useMemo(() => {
        let { pathname } = location;
        let id = pathname.substring(pathname.lastIndexOf('/') + 1)
        return id;
    }, [])

    let { data: res, loading, error } = useGetDataDetail(id);
    //导致纯函数报错
    if (error) {
        message.error(error?.msg)
    }

    const dataDetail: Detail = res as any as Detail;

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail
        });
        setKeywords(dataDetail?.dataSetDescribeKeyw)
        setType(dataDetail?.dataSetDescribeType)
        
    }, [dataDetail])


    if (!res) return <ProSkeleton type="descriptions" />;

    const handleSave = async () => {
        await form.validateFields();
        const formData = form.getFieldsValue();
        //新增关键词和分类
        const others: any = {};
        if (keywords !== '') {
            others.dataSetDescribeKeyw = keywords;
        }

        if (type !== '') {
            others.dataSetDescribeType = type;
        }

        let res = await post('/spw/spwDataSet/addDetail', {
            id: id,
            ...formData,
            ...others
        })

        if (res.code === 200) {
            message.success('详情修改成功')
        } else {
            message.error(res.msg)
        }
    }

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleInputChange = (key: string, e: any) => {
        if (key === 'type') {
            setType(e.target.value)
        } else {
            setKeywords(e.target.value)
        }
    }

    return (
        <div className={styles.dataDetailWrap}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>{dataDetail?.dataSetName}</h1>
                <Space >
                    <Button type='primary' onClick={() => navigator('/data/list')}>返回数据列表</Button>
                    <Button type='primary' onClick={() => handleSave()}>保存数据</Button>
                </Space>
                <Space style={{ marginTop: 40, color: '#FFF' }}>
                    <Space >
                        <span >关键词: </span>
                        <Input value={keywords} onChange={(e) => handleInputChange('keywords', e)} style={{ width: 300 }}></Input>
                    </Space>
                    <Space style={{ marginLeft: 40 }}>
                        <span >分类: </span>
                        <Input value={type} onChange={(e) => handleInputChange('type', e)} style={{ width: 300 }} ></Input>
                    </Space>
                </Space>
            </header>
            <div className={styles.contentWrap}>
                <ProForm<{
                    dataSetDescribe: string;
                    dataSetDescribeImg: string;
                    dataSetDetail: string;
                    dataSetDetailImg: string;
                }>
                    form={form}
                    submitter={{
                        render: () => null
                    }}
                >
                    <BorderBox>
                        <Row gutter={16}>
                            <Col flex='289px'>
                                <Form.Item
                                    rules={[{ required: true, message: '描述图片是必填项' }]}
                                    name="dataSetDescribeImg">
                                    <UploadField action={uploadUrl} />
                                </Form.Item>
                            </Col>
                            <Col className={styles.context} flex='1'>
                                <ProFormTextArea
                                    rules={[{ required: true, message: '简介内容是必填项' }]}
                                    name="dataSetDescribe"
                                    label="数据简介"
                                    placeholder="请输入简介内容"
                                    fieldProps={{
                                        allowClear: true,
                                        showCount: false,
                                        autoSize: { minRows: 6 },
                                    }}
                                />
                            </Col>
                        </Row>
                    </BorderBox>
                    <BorderBox>
                        <Row gutter={16}>
                            <Col className={styles.context} flex='1'>
                                <ProFormTextArea
                                    rules={[{ required: true, message: '详情内容是必填项' }]}
                                    name="dataSetDetail"
                                    label="数据详情"
                                    placeholder="请输入详情内容"
                                    fieldProps={{
                                        allowClear: true,
                                        showCount: false,
                                        autoSize: { minRows: 6 },
                                    }}
                                />
                            </Col>
                            <Col flex='289px' style={{ display: 'flex', padding: 10 }}>
                                <Form.Item
                                    style={{ flex: 1 }}
                                    rules={[{ required: true, message: '详情图片是必填项' }]}
                                    name="dataSetDetailImg">
                                    <UploadField action={uploadUrl} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </BorderBox>
                </ProForm>
            </div>
        </div>
    )
}

export default Edit;