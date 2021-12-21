import React, { useRef, FC, useState, useMemo, useEffect } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import classnames from 'classnames';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, {
    StepsForm,
    ProFormText,
    ProFormDatePicker,
    ProFormSelect,
    ProFormTextArea,
    ProFormCheckbox,
    ProFormDateRangePicker,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { message, Form, Select, Button } from 'antd';
import styles from '../../index.module.less';
import FileTypeSelect from '@pages/data/components/fileTypeSelect';
import { get, post } from '@api/request'
import { useLocation, useNavigate } from 'react-router-dom';
const { Option } = Select;
const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

type ExportTable = {
    id: string,
    key: string,
    value: string
}



const Export: FC = (props) => {
    const formRef = useRef<ProFormInstance>();
    const [current, setCurrent] = useState(0);
    const actionRef = useRef<ActionType>();
    const [columns, setColumns] = useState<ProColumns<ExportTable>[]>([])

    const navigator = useNavigate();
    const location = useLocation();

    let id = useMemo(() => {
        let { search } = location;
        let params: { [key: string]: string } = { id: '' };
        function parseSearch(search: string) {
            let params: { [key: string]: string } = {};
            if (search.startsWith('?')) {
                search = search.substring(1);
                let searchArr = search.split('&');

                searchArr.forEach((item) => {
                    let objArr = item.split('=');
                    params[objArr[0]] = objArr[1];
                })
            }

            return params
        }

        params = parseSearch(search);
        let { id } = params;
        return id || '';
    }, [location]);



    const [stepForm1] = Form.useForm();
    const [stepForm2] = Form.useForm();
    const [stepForm3] = Form.useForm();

    const [exportSheetData, setExportSheetData] = useState<any[]>([]);

    const [selectSheetLabel, setSelectSheetLabel] = useState([]);

    const [sheetFieldsMap, setSheetFieldsMap] = useState<{ [key: string]: any[] }>({});
    const [genSheetFieldsMap, setGenSheetFieldsMap] = useState<{ [key: string]: any[] }>({});
    const [selectSheetName, setSelectSheetName] = useState<string>('');
    const [selectFields, setSelectFields] = useState<string[]>([]);

    const [previewData, setPreviewData] = useState<any>({});

    //数据集名称
    const [dataSetName, setDataSetName] = useState('数据集')


    const getSheetForExport = async () => {
        let res = await get(`/spw/spwDataSet/getSheetForExport/${id}`)
        if (res.code === 200) {
            setExportSheetData(res.data)
        }
    }

    const initSheetMap = (arr: string[]) => {
        let map: { [key: string]: string[] } = {};
        if (!arr) return map;
        arr.forEach((item: string) => {
            map[item] = [];
        })

        return map;
    }

    const getSheetMap = (arr: any[]) => {
        let result: { [key: string]: any } = {};
        if (!arr) return result;
        arr.forEach(item => {
            result[item.sheetName] = item.fields;
        })

        return result;
    }

    const [step3Sheet, setStep3Sheet] = useState<string>('')

    const parseArrToObj = (obj: any) => {
        let arr: { sheetName: string, fields: string[] }[] = [];

        let keys = Object.keys(obj);
        keys.forEach((item) => {
            arr.push({
                sheetName: item,
                fields: obj[item]
            })
        })

        return arr;
    }

    let getColumns = (arr: string[]) => {
        const columns: ProColumns<ExportTable>[] = [
            {
                title: '序号',
                dataIndex: 'index',
                valueType: 'indexBorder',
                width: 48,
            },
        ]

        if (!arr) return columns;
        arr.forEach(item => {
            columns.push({
                title: item,
                dataIndex: item,
            })
        })

        return columns;
    }
    //初始化
    useEffect(() => {
        getSheetForExport();
    }, [])
    return (
        <div className={styles.exportWrap}>
            <StepsForm<{
                name: string;
            }>

                current={current}
                onCurrentChange={(step) => { setCurrent(step) }}
                formRef={formRef}
                onFinish={async () => {

                }}
                submitter={{
                    render: (props) => {
                        if (props.step === 3) {
                            return [
                                <Button key="pre" onClick={() => props.onPre?.()}>
                                    上一步
                                </Button>,
                                <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                                    导出数据
                                </Button>,
                            ]
                        }

                        return [
                            <Button key="pre" onClick={() => props.onPre?.()}>
                                上一步
                            </Button>,
                            <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                                下一步
                            </Button>,
                        ];
                    }
                }}
                formProps={{
                    validateMessages: {
                        required: '此项为必填项',
                    },
                }}
            >
                <StepsForm.StepForm<{
                    name: string;
                }>
                    form={stepForm1}
                    name="format"
                    stepProps={{
                        title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current >= 0 })}>选择格式</span>
                    }}
                    onFinish={async () => {
                        await stepForm1.validateFields();
                        return true;
                    }}
                >
                    <ProCard layout="center"
                        direction="column"
                        title="选择导出格式"
                        style={{ marginBottom: 30 }}>
                        <Form.Item name='fileType' rules={[{ required: true, message: '请选择要导出的格式' }]}>
                            <FileTypeSelect />
                        </Form.Item>
                    </ProCard>

                </StepsForm.StepForm>

                <StepsForm.StepForm<{
                    checkbox: string;
                }>
                    form={stepForm2}
                    name="data"
                    title="设置参数"
                    stepProps={{
                        title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current > 1 })}>选择数据</span>
                    }}
                    onFinish={async () => {
                        let { sheets } = await stepForm2.validateFields();
                        //设置选中的sheetlabel
                        setSelectSheetLabel(sheets);
                        let map = getSheetMap(exportSheetData);
                        //生成map
                        setSheetFieldsMap(map)
                        //设置第三步默认选中的sheet
                        setSelectSheetName(sheets[0]);
                        //设置字段
                        setSelectFields(map[sheets[0]]);

                        //设置第四步默认选中的sheet
                        setStep3Sheet(sheets[0])
                        return true;
                    }}
                >

                    <ProCard
                        direction="column"
                        title="选择表"
                        style={{ marginBottom: 30 }}>
                        <Form.Item
                            rules={[{ required: true, message: '请选择要导出的表' }]}
                            name='sheets'>
                            <ProFormCheckbox.Group
                                layout='vertical'
                                name="checkbox"
                                options={exportSheetData.map((item: { sheetName: string }) => {
                                    return item.sheetName
                                })}
                            />
                        </Form.Item>
                    </ProCard>
                </StepsForm.StepForm>
                <StepsForm.StepForm
                    form={stepForm3}
                    onFinish={async () => {
                        //根据选择要导出的表和列获取数据
                        const body = {
                            dataSetId: id,
                            paramConfig: parseArrToObj(genSheetFieldsMap)
                        }
                        let res = await post('/spw/spwDataSet/getDataForExport', body)
                        if (res.code === 200) {
                            let result: { [key: string]: any[] } = {};
                            let resData: any[] = res.data || [];
                            resData.forEach(item => {
                                result[item.sheet] = item.data;
                            })

                            resData[0] && setDataSetName(resData[0]['data_set_name'])
                            setPreviewData(result)
                            return true;
                        } else {
                            message.warning(res.msg)
                            return false;
                        }
                    }}
                    name="field"
                    stepProps={{
                        title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current > 2 })}>选择字段</span>
                    }}
                >
                    <ProCard
                        direction="column"
                        title="选择字段"
                        style={{ marginBottom: 30 }}>
                        <ProFormSelect
                            fieldProps={{
                                value: selectSheetName,
                                onChange: (value) => {
                                    setSelectSheetName(value);
                                    //渲染所有列
                                    setSelectFields(sheetFieldsMap[value])
                                    //切换选择状态
                                    stepForm3.setFieldsValue({ 'fields': genSheetFieldsMap[value] })
                                }
                            }}
                            name="resource"
                            label="源"
                            options={selectSheetLabel}
                            placeholder="请选择数据源！"
                        // rules={[{ required: true, message: '数据源为必填项！' }]}
                        />

                        <ProFormCheckbox.Group
                            fieldProps={{
                                onChange: (selectFields) => {
                                    genSheetFieldsMap[selectSheetName] = selectFields;
                                    setGenSheetFieldsMap(genSheetFieldsMap)
                                }
                            }}
                            name="fields"
                            layout="vertical"
                            label="选择列"
                            options={selectFields}
                        />
                    </ProCard>
                </StepsForm.StepForm>

                <StepsForm.StepForm
                    name="success"
                    onFinish={async () => {
                        //根据选择要导出的表和列获取数据
                        const body = {
                            dataSetId: id,
                            type: stepForm1.getFieldValue('fileType'),
                            paramConfig: parseArrToObj(genSheetFieldsMap)
                        }
                        let res = await post('/spw/spwDataSet/export', body)
                        if (res.code === 200) {
                            let { data } = res;
                            let url:string = data.url;
                            if(!url) {
                                return message.warning('资源怎么不见了！');
                            }
                            let a = document.createElement('a');
                            a.href = url;
                            let suf = url.substring(url.lastIndexOf('.'))
                            a.download = `${dataSetName}.${suf}`;
                            a.click();
                            message.success('文件下载中');
                        } else {
                            message.error(res.msg);
                        }
                        return false;
                    }}
                    stepProps={{
                        title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current > 3 })}>导出完成</span>
                    }}
                >
                    <ProCard
                        direction="column"
                        title="导出表格"
                        style={{ marginBottom: 30 }}
                    >
                        <Select value={step3Sheet} style={{ width: '100%', marginBottom: 30 }} onChange={(value) => setStep3Sheet(value)}>
                            {
                                selectSheetLabel.map((item: any) =>
                                    <Option key={item} value={item}>{item}</Option>
                                )
                            }
                        </Select>
                        <ProTable<ExportTable>
                            options={{fullScreen:false,density:false}}
                            columns={getColumns(genSheetFieldsMap[step3Sheet])}
                            search={false}
                            bordered
                            actionRef={actionRef}
                            dataSource={previewData[step3Sheet]}
                            toolBarRender={false}
                            rowKey={(recoed, index) => index + step3Sheet}
                            pagination={{
                                showQuickJumper: true,
                                pageSize: 10
                            }}
                            dateFormatter="string"
                        >

                        </ProTable>

                    </ProCard>
                </StepsForm.StepForm>
            </StepsForm>
        </div>
    )
}

export default Export;