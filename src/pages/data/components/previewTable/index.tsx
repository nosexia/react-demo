import ProTable, { ProColumns } from '@ant-design/pro-table';
import { get } from '@api/request';
import XBModalLine from '@components/xb-modal-line';
import { message, Modal, Select } from 'antd';
import React, { FC, useEffect, useState } from 'react';
const { Option } = Select;

type Props = {
    isModalVisible: boolean;
    id: string;
    onOk?: () => void;
    onCancel?: () => void;
}
const PreviewTable: FC<Props> = ({ id, isModalVisible, ...props }) => {
    const [previewData, setPreviewData] = useState<any>([]);
    const [sheetLabel, setSheetLabel] = useState<any>([]);
    const [previewColumn, setPreviewColumn] = useState<any>([]);
    const [selectSheet, setSelectSheet] = useState<string>('');

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

    const handleSelectChange = (value: string) => {
        setSelectSheet(value)
        previewData[value] && previewData[value][0] && setPreviewColumn(getColumn(previewData[value][0]))
    }

    const getDataSetMap = (arr: any[]) => {
        let result: { [key: string]: { [key: string]: string }[] } = {};

        arr.forEach(item => {
            result[item.sheet] = item.data;
        })

        return result;
    }

    const init = async () => {
        let res = await get(`/spw/spwDataSet/dataBrowsingByTable/${id}`)
        let data: { [key: string]: any }[] = res.data;
        if (res.code === 200) {
            if (!data || !data.length) {
                message.warning('无数据')
            }
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


    useEffect(() => {
        if (isModalVisible) {
            init();
        }
    }, [isModalVisible])
    return <Modal
        width={'80%'}
        centered
        style={{ maxWidth: 1160 }}
        title="数据浏览"
        visible={isModalVisible}
        onOk={() => props?.onOk?.()}
        onCancel={() => props?.onCancel?.()}>
        <Select value={selectSheet} style={{ width: '100%', marginBottom: 30 }} onChange={(value) => handleSelectChange(value)}>
            {
                sheetLabel.map((item: any) =>
                    <Option key={item} value={item}>{item}</Option>
                )
            }
        </Select>
        <ProTable
        options={{fullScreen:false,density:false}}
            columns={previewColumn}
            search={false}
            bordered
            dataSource={previewData[selectSheet] || []}
            toolBarRender={false}
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
}


export default PreviewTable;