import React, { FC, useMemo, useRef } from 'react';
import { PlusOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Image } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { useGetDataList } from '@/api/data'
import { useNavigate } from 'react-router';
import { createBrowserHistory } from 'history';
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

    let columns: ProColumns<DataListItemType>[] = [
            {
                title: '图片',
                dataIndex: 'imgUrl',
                search: false,
                render: (_: any, record: any) => {
                    return <Image preview={{ mask: <EyeOutlined /> }} src={_} width={40} height={40} />
                }
            },
            {
                title: '名称',
                dataIndex: 'name',
                valueType: 'textarea',
            },
            {
                title: '分类',
                dataIndex: 'type',
                valueType: 'textarea',
            },
            {
                title: '仿真进度',
                dataIndex: 'number',
                search: false,
                valueType: () => ({
                    type: 'progress',
                    // status: ProcessMap[item.status],
                }),
            },
            {
                title: '仿真开始时间',
                dataIndex: 'collectionTime',
                search: false,
            },
            {
                title: '操作',
                key: 'option',
                valueType: 'option',
                render: (_: any, record: any) => [
                    <a key="detail" onClick={() => navigate(``)}>下载仿真结果</a>,
                    <a key="export" onClick={() => navigate(``)}>查看异常日志</a>,
                ]
            }
        ]
    return (
        <ProTable
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
            headerTitle="数据表格"
            request={async (params = {}, sort, filter) => {
                return useGetDataList(params, filter, sort)
            }}
            toolBarRender={() => [
                <Button type="primary" onClick={() => navigate("/model/model-scene")}>新建模型</Button>
            ]}
        >

        </ProTable>
    )
}

export default DataList;