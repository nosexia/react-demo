import React, { FC, useMemo, useRef, useState } from 'react';
import { PlusOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Menu, Image, Dropdown, Select, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { useGetDataList } from '@/api/data'
import { useNavigate } from 'react-router';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();
import { MenuInfo } from 'rc-menu/lib/interface';
import { TableOutlined, AreaChartOutlined, DownOutlined } from '@ant-design/icons';
import { get } from '@api/request';
import PreviewTable from '@pages/data/components/previewTable';
import XBModalLine from '@components/xb-modal-line';
import Import from '@pages/data/components/import';
import Export from '@pages/data/components/export';
import listIcon from '@/assets/images/list-icon.png'
const { Option } = Select;
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [exportId, setExportId] = useState()

    const [selectSheet, setSelectSheet] = useState<string>('');
    const [sheetLabel, setSheetLabel] = useState<any>([]);
    const [previewColumn, setPreviewColumn] = useState<any>([]);
    const [previewData, setPreviewData] = useState<any>([]);

    const getColumn = (obj: { [key: string]: string }): ProColumns<{ [key: string]: string }> => {
        let columns: any = [];
        let keys = Object.keys(obj);
        keys.forEach(key => {
            columns.push({
                title: key,
                dataIndex: key,
            })
        })

        return columns
    }

    const getDataSetMap = (arr: any[]) => {
        let result: { [key: string]: { [key: string]: string }[] } = {};

        arr.forEach(item => {
            result[item.sheet] = item.data;
        })

        return result;
    }

    const handleMenuClick = async (e: MenuInfo, id: string) => {
        if (e.key === '2') {
            navigate(`/data/browsing/chart?id=${id}`)
        } else {
            let res = await get(`/spw/spwDataSet/dataBrowsingByTable/${id}`)
            let data: { [key: string]: any }[] = res.data;
            if (res.code === 200) {
                if (!data || !data.length) {
                    message.warning('无数据')
                }
                setIsModalVisible(true)

                if (!data[0] || !data[0].data || !data[0].data[0]) return;
                //设置表头
                setPreviewColumn(getColumn(data[0]?.data[0]))
                //设置表数据
                setPreviewData(getDataSetMap(data));
                //设置sheet选择器
                let labels = data.map(item => {
                    return item.sheet;
                })
                setSheetLabel(labels)
                //设置默认的选中
                setSelectSheet(labels[0])
            } else {
                message.error(res.msg)
            }
        }
    }

    let columns: ProColumns<DataListItemType>[] =
        [
            {
                title: '图片',
                dataIndex: 'dataSetImg',
                search: false,
                render: (_: any, record: any) => {
                    return <Image preview={{ mask: <EyeOutlined /> }} src={listIcon} width={40} height={40} />
                }
            },
            {
                title: '名称',
                dataIndex: 'dataSetName',
                valueType: 'textarea',
            },
            {
                title: '分类',
                dataIndex: 'dataSetType',
                valueType: 'textarea',
            },
            {
                title: '数据量',
                dataIndex: 'dataSetCount',
                search: false,
            },
            {
                title: '数据采集时间',
                dataIndex: 'dataSetImportDate',
                search: false,
            },
            {
                title: '操作',
                key: 'option',
                valueType: 'option',
                render: (_: any, record: any) => [
                    <a key="detail" onClick={() => navigate(`/data/detail/${record.id}`)}>查看详情</a>,
                    <a key="detail" onClick={() => navigate(`/data/detail/edit/${record.id}`)}>编辑详情</a>,
                    <a key="export" onClick={() => { setExportModalVisible(true); setExportId(record.id) }}>导出</a>,
                    <Dropdown key="browsing" overlay={(
                        <Menu onClick={(e) => handleMenuClick(e, record.id)}>
                            <Menu.Item key="1" icon={<TableOutlined />}>
                                表格
                            </Menu.Item>
                            <Menu.Item key="2" icon={<AreaChartOutlined />}>
                                图表
                            </Menu.Item>
                        </Menu>
                    )}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            数据浏览 <DownOutlined />
                        </a>
                    </Dropdown>
                ]
            }
        ]

    const handleSelectChange = (value: string) => {
        setSelectSheet(value)
        previewData[value] && previewData[value][0] && setPreviewColumn(getColumn(previewData[value][0]))
    }

    const ref = useRef<ActionType>();

    return (
        <>
            <Modal
                title="数据浏览"
                width="80%"
                style={{ maxWidth: 1160 }}
                centered
                visible={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}>
                <Select value={selectSheet} style={{ width: '100%', marginBottom: 30 }} onChange={(value) => handleSelectChange(value)}>
                    {
                        sheetLabel.map((item: any) =>
                            <Option key={item} value={item}>{item}</Option>
                        )
                    }
                </Select>
                <ProTable
                options={{fullScreen:false,density:false}}
                    actionRef={ref}
                    toolBarRender={false}
                    columns={previewColumn}
                    search={false}
                    dataSource={previewData[selectSheet] || []}
                    rowKey={() => Math.random()}
                    pagination={{
                        showQuickJumper: true,
                        pageSize: 10
                    }}
                    dateFormatter="string"
                >

                </ProTable>
                <XBModalLine />
            </Modal>
            <Import modalVisible={importModalVisible} onOk={() => {setImportModalVisible(false); actionRef?.current?.reload?.();}} onCancel={() => setImportModalVisible(false)}></Import>
            <Export id={exportId as unknown as string} modalVisible={exportModalVisible} onOk={() => setExportModalVisible(false)} onCancel={() => setExportModalVisible(false)}></Export>
            <ProTable
            options={{fullScreen:false,density:false}}
                bordered
                columns={columns}
                actionRef={actionRef}
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                }}
                pagination={{
                    pageSize: 20,
                }}
                dateFormatter="string"
                headerTitle="核心数据集"
                request={async (params = {}, sort, filter) => {
                    let tableData = useGetDataList(params, filter, sort);
                    return tableData;
                }}
                toolBarRender={() => [
                    <Button type="primary" onClick={() => setImportModalVisible(true)}>导入数据集</Button>
                ]}
            >
            </ProTable>
        </>

    )
}

export default DataList;