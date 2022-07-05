import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { parseParams } from '@utils/utils';
import { Button, Image, message, Modal, Progress } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSimulationList } from '@api/model';
import listIcon from '@/assets/images/list-icon.png'
import XBModalLine from '@components/xb-modal-line';
import LoadingOutlined from '@ant-design/icons';
const Simulation: FC = () => {
    const location = useLocation();
    const navigator = useNavigate();
    const [imgPreviewVisible, setImgPreviewVisible] = useState(false);
    const [random, setRandom] = useState<number>();
    const [imgPreview, setImgPreview] = useState<number>();
    const [name, id] = useMemo(() => {
        let params = parseParams(location.search)
        return [decodeURI(params.name), params.id]
    }, [location]);
    const actionRef = useRef<ActionType>();
    const navigate = useNavigate();
    type DataListItemType = {
        id: string,
        imgUrl: string,
        name: string,
        type: string,
        number: number,
        collectionTime: string,
    }
    let columns: ProColumns<DataListItemType>[] = useMemo(() =>
        [
            {
                title: '图例',
                dataIndex: 'imgUrl',
                search: false,
                render: (_: any, record: any) => {
                    return <Image preview={{ mask: <EyeOutlined /> }} src={listIcon} width={40} height={40} />
                }
            },
            {
                title: '名称',
                dataIndex: 'name',
                valueType: 'textarea',
            },
            {
                title: '分类',
                search: false,
                dataIndex: 'scenarioIdx',
                valueType: 'select',
                render(_: number, record: any) {
                    return id == 1 ? '智慧园区' : "智慧城市"
                }
                // valueEnum: {
                //     Cluster: { text: '聚类' },
                //     Classifier: { text: '分类' },
                //     AbnormalDetection: { text: '异常检测' },
                //     Regressor: { text: '回归' },

                // },
            },
            {
                title: '仿真进度',
                width: 300,
                search: false,
                dataIndex: 'create_time',
                render(_: any, record: any) {
                    if(record.status === "初始化中"){
                        return "初始化中"
                    }
                    let status = 'active';
                    if (record['status'] === '异常') {
                        status = 'exception';
                    } else if (record['status'] === '已完成') {
                        status = 'success'
                    }
                    return <Progress percent={record['process']} status={status as any} />
                }
            },
            {
                title: '仿真开始时间',
                dataIndex: 'create_time',
                valueType: 'textarea',
                search: false,
            },
            {
                title: '操作',
                key: 'option',
                valueType: 'option',
                render: (_: any, record: any) => {
                    let btns: any[] = []
                    if (record['status'] === '已完成') {
                        btns = [
                            <Button style={{ color: '#03bcc2', border: '1px solid #03bcc2' }} onClick={() => downloadTaskResult(record['仿真结果文件URL'])}>下载仿真任务结果</Button>
                        ]
                    }

                    if (record['status'] === '进行中') {
                        btns = [
                            <Button onClick={() => handleSimulationStatus(record)}>查看仿真进度</Button>
                        ]
                    }


                    if (record['status'] === '异常') {
                        btns = [
                            <Button onClick={() => handleAbnormalLog(record['运行日志文件URL'])} danger>查看异常日志</Button>
                        ]
                    }

                    return btns;
                }
            }
        ]
        , [])
        
    const handleSimulationStatus = (record:any) => {
        if(Number(id) === 3) {
            const {protocol, host} = window.location
            window.open(`${protocol}//${host}/realtime-overview?id=${id}`)
        }else{
            setImgPreview(record["仿真程序截图URL"]); 
            setImgPreviewVisible(true); 
            setImgPreviewVisible(record["仿真程序截图URL"]) 
        }
    }
    function handleAbnormalLog(url: string) {
        let a = document.createElement('a');
        a.href = url;
        let suf = url.substring(url.lastIndexOf('.'))
        a.download = `${suf}`;
        a.target = "_blank"
        a.click();
        message.success('文件下载中');
    }

    function downloadTaskResult(url: string) {
        let a = document.createElement('a');
        a.href = url;
        let suf = url.substring(url.lastIndexOf('.'))
        a.download = `${suf}`;
        a.target = "_blank"
        a.click();
        message.success('文件下载中');
    }

    useEffect(() => {
        let timer = null;
        if (imgPreviewVisible) {
            timer = setInterval(() => {
                setRandom(Date.now());
            }, 1000)
        } else {
            clearInterval(timer);
            timer = null;
        }
    }, [imgPreviewVisible])

    function handlePreviewOk() {
        setImgPreviewVisible(false);
    }
    return <>
        <Modal visible={imgPreviewVisible}
            closable={false}
            width="61.8%"
            footer={[
                <Button key="submit" type="primary" onClick={() => handlePreviewOk()}>
                  确定
                </Button>,
              ]}
            title={"仿真进度图片预览"}
            // onOk={() => handlePreviewOk()}
            onCancel={() => setImgPreviewVisible(false)}>
            <Image
                preview={false}
                src={`${imgPreview}?${random}`}
                placeholder={
                    true
                }
            />
            <XBModalLine />
        </Modal>
        <ProTable
            options={{ fullScreen: false, density: false }}
            columns={columns}
            actionRef={actionRef}
            rowKey="task_core_algo_name"
            search={{
                labelWidth: 'auto',
            }}
            pagination={{
                pageSize: 20,
            }}
            bordered
            dateFormatter="string"
            headerTitle="模型进度"
            request={async (params = {}, sort, filter) => {
                return useSimulationList({ ...params, scenarioIdx: id }, filter, sort).then((res: any) => {
                    return {
                        data: res.data.results,
                        total: res.data.count,
                        code: res.code,
                        msg: res.msg
                    }
                })
            }}
            toolBarRender={() => [
                <Button type="primary" onClick={() => navigate('/model')}>返回模型详情</Button>
            ]}
        >

        </ProTable>
    </>
}

export default Simulation;