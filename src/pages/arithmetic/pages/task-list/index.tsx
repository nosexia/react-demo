import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { useTaskList } from '@api/algorithm';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Image, message, Progress, ProgressProps } from 'antd';
import React, { FC, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import listIcon from '@/assets/images/list-icon.png'
type DataListItemType = {
    id: string,
    imgUrl: string,
    name: string,
    type: string,
    number: number,
    collectionTime: string,
}
const TaskList: FC = () => {
    const actionRef = useRef<ActionType>();
    const navigate = useNavigate();

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
                dataIndex: 'taskName',
                valueType: 'textarea',
            },
            {
                title: '分类',
                dataIndex: 'task_core_algo_type',
                valueType: 'select',
                valueEnum: {
                    Cluster: { text: '聚类' },
                    Classifier: { text: '分类' },
                    AbnormalDetection: { text: '异常检测' },
                    Regressor: { text: '回归' },

                },
            },
            {
                title: '仿真进度',
                search: false,
                width: 300,
                dataIndex: 'AlgorithmNameCN',
                render(_: any, record: any) {
                    let percent = 30;
                    let status = 'active';
                    if (record['task_progress_status'] === '异常') {
                        status = 'exception';
                    } else if (record['task_progress_status'] === '完成') {
                        status = 'success'
                    }
                    return <Progress percent={record['task_progress']} status={status as any} />
                }
            },
            {
                search: false,
                title: '仿真开始时间',
                dataIndex: 'task_begin_time',
                valueType: 'textarea',
            },
            {
                title: '操作',
                key: 'option',
                valueType: 'option',
                render: (_: any, record: any) => {
                    let btns: any[] = []
                    if (record['task_progress_status'] === '完成') {
                        btns = [
                            <Button onClick={() => downloadTaskResult(record['predict_results_url'])}>下载算法任务结果</Button>
                        ]
                    }

                    if (record['task_progress_status'] === '异常') {
                        btns = [
                            <Button onClick={() => handleAbnormalLog(record['log_url'])} danger>查看异常日志</Button>
                        ]
                    }

                    return btns;
                }
            }
        ]
        , [])



    function handleAbnormalLog(url:string) {
        let a = document.createElement('a');
        a.href = url;
        let suf = url.substring(url.lastIndexOf('.'))
        a.download = `${suf}`;
        a.target = "_blank"
        a.click();
        message.success('文件下载中');
    }

    function downloadTaskResult(url:string) {
        let a = document.createElement('a');
        a.href = url;
        let suf = url.substring(url.lastIndexOf('.'))
        a.download = `${suf}`;
        a.target = "_blank"
        a.click();
        message.success('文件下载中');
    }
    return <ProTable
    options={{fullScreen:false,density:false}}
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        search={{
            labelWidth: 'auto',
        }}
        pagination={{
            pageSize: 20,
        }}
        bordered
        dateFormatter="string"
        headerTitle="算法任务列表"
        request={async (params = {}, sort, filter) => {
            return useTaskList(params, filter, sort)
        }}
        toolBarRender={() => [
            <Button type="primary" onClick={() => navigate('/arithmetic/list')}>返回算法列表</Button>
        ]}
    >

    </ProTable>
}

export default TaskList;