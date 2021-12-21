import React, { FC, useMemo, useRef, useState } from 'react';
import { PlusOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Image } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { useGeAlgorithmList } from '@/api/algorithm'
import { useNavigate } from 'react-router';
import { createBrowserHistory } from 'history';
import TaskModal from '@pages/arithmetic/components/task-modal';
import listIcon from '@/assets/images/list-icon.png'
const history = createBrowserHistory();
type DataListItemType = {
    id: string,
    imgUrl: string,
    name: string,
    type: string,
    number: number,
    collectionTime: string,
}


const DataList: FC = (props) => {
    const actionRef = useRef<ActionType>();
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [algorithmName, setAlgorithmName] = useState('');
    const [algorithmNameEN, setAlgorithmNameEN] = useState('');
    const [algorithmType, setAlgorithmType] = useState('');
    
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
                dataIndex: 'AlgorithmNameCN',
                // valueType: 'textarea',
                render(_: string, record: any) {
                    return <a onClick={() => navigate(`/arithmetic/detail?name=${record.AlgorithmNameCN}`)}>{_}</a>
                }
            },
            {
                title: '分类',
                dataIndex: 'AlgorithmTypeCN',
                valueType: 'select',
                valueEnum: {
                    Cluster: { text: '聚类' },
                    Classifier: { text: '分类' },
                    AbnormalDetection: { text: '异常检测' },
                    Regressor: { text: '回归' },

                },
            },
            {
                title: '操作',
                key: 'option',
                valueType: 'option',
                render: (_: any, record: any) => [
                    <a key="detail" onClick={() => navigate(`/arithmetic/detail?name=${record.AlgorithmNameCN}`)}>详情</a>,
                    <a key="export" onClick={() => {setAlgorithmType(record.AlgorithmType);setAlgorithmName(record.AlgorithmNameCN);setAlgorithmNameEN(record.AlgorithmName);setModalVisible(true)}}>新建任务</a>,
                ]
            }

        ]
        , [])
    return (
        <>
            <TaskModal algorithmType={algorithmType} algorithmNameEN ={algorithmNameEN} algorithmId={algorithmName} modalVisible={modalVisible} algorithmName={algorithmName} onOk={() => { }} onCancel={() => { setModalVisible(false) }} />
            <ProTable
                columns={columns}
                actionRef={actionRef}
                rowKey="AlgorithmNameCN"
                search={{
                    labelWidth: 'auto',
                }}
                pagination={{
                    pageSize: 20,
                }}
                options={{fullScreen:false,density:false}}
                bordered
                dateFormatter="string"
                headerTitle="代表算法集"
                request={async (params = {}, sort, filter) => {
                    return useGeAlgorithmList(params, filter, sort)
                }}
                toolBarRender={() => [
                    <Button type="primary" onClick={() => navigate('/arithmetic/task-list')}>任务列表查看</Button>
                ]}
            >

            </ProTable>
        </>

    )
}

export default DataList;