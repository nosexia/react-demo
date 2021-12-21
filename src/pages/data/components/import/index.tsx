import React, { useRef, FC, useState, useEffect, ReactNode } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import { CheckCircleFilled } from '@ant-design/icons';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import classnames from 'classnames';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, {
    StepsForm,
    ProFormText,
    ProFormSelect,
    ProFormCheckbox,
    ProFormUploadButton,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { message, Form, Button, Select, Modal } from 'antd';
import styles from '../../index.module.less';
import { getToken } from '@utils/utils';
import { base, getSelectListOne, post } from '@/api/request';
import { useNavigate } from 'react-router';
import XBModalLine from '@components/xb-modal-line';
import Countdown from '@components/countdown';
type IProps = {
    modalVisible: boolean;
    onOk: () => void;
    onCancel: () => void;
}

type Label = {
    label: ReactNode;
    value: string
}

type DataSourceType = {
    fieldName: string;
    isInclude: string;
    isPrimary: string;
    type: string;
}


type ImportTable = {
    [key: string]: string;
}
const { Option } = Select;
const sheetParamsMap: any = {};

const columns: ProColumns<DataSourceType>[] = [
    {
        title: '序号',
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: '字段名称',
        dataIndex: 'fieldName',
        search: false,
        editable: false,
    },
    {
        title: '是否包含该字段',
        valueType: 'checkbox',
        dataIndex: 'isInclude',
        valueEnum: {
            '1': {
                text: ' ',
                status: true,
            },
        }
    },
    {
        title: '唯一身份标识字段',
        dataIndex: 'isPrimary',
        valueType: 'checkbox',
        valueEnum: {
            '1': {
                text: ' ',
                status: true,
            },
        },
        search: false,
    },
    {
        title: '字段类型选择',
        dataIndex: 'type',
        valueType: 'select',
        valueEnum: {
            UUID: {
                text: 'UUID',
                status: 'UUID',
            },
            Integer: {
                text: 'Integer',
                status: 'Integer',
            },
            Float: {
                text: 'Float',
                status: 'Float',
            },
            Datetime: {
                text: 'Datetime',
                status: 'Datetime',
            },
            Text: {
                text: 'Text',
                status: 'Text',
            },
            Boolean: {
                text: 'Boolean',
                status: 'Boolean',
            },
        },
        search: false,
    },
]
const Import: FC<IProps> = ({ modalVisible, onOk, onCancel }) => {
    const formRef = useRef<ProFormInstance>();
    const [current, setCurrent] = useState(0);
    const actionRef = useRef<ActionType>();
    const [importFileList, setImportFileList] = useState<any[]>([]);
    //sheets
    const [sheetList, setSheetList] = useState<Label[]>([]);
    //select sheets
    const [selectSheetList, setSelectSheetList] = useState<Label[]>([]);
    //selectSheet
    const [selectSheet, setSelectSheet] = useState<string>();

    const [step2httpData, setStep2httpData] = useState<any>([])

    const navigator = useNavigate();


    const [stepForm1] = Form.useForm();
    const [stepForm2] = Form.useForm();
    const [stepForm3] = Form.useForm();
    //上传文件
    const handleImpoetChange = (info: any) => {
        let fileList = [...info.fileList];
        fileList = fileList.map(file => {
            if (!file.response) {
                return file;
            }

            if (file.response.code === 200) {
                file.url = file.response.url;

                //上传成功根据响应数据生成sheet选择
                let sheets = file.response.data.sheets.map((item: any) => {
                    return {
                        label: item.sheetName,
                        value: item.sheetName,
                        maxNum: item.maxNum
                    }
                });
                setSheetList(sheets);
            } else {
                file.status = 'error';
                file.msg = file.response.msg;
                message.error(file.response.msg)
            }
            return file;
        });
        setImportFileList(fileList)
    }

    //修改sheet的选择
    const handleSelectSheetChange = (value: string) => {
        setSelectSheet(value);
        if (!sheetParamsMap[value]) {
            sheetParamsMap[value] = {};
            stepForm2.setFieldsValue({ fieldNameNum: '', firstDataNum: '', lastDataNum: '' })
        } else {
            let formData = sheetParamsMap[value];
            stepForm2.setFieldsValue({ ...formData })
        }
    }

    const inputChange = (value: string, key: string) => {
        if (!selectSheet) {
            message.warning('请选择要操作的sheet');
            return;
        }
        sheetParamsMap[selectSheet][key] = value
    }


    //校验所有的数据源是否已经进行选择
    const validateSheetParams = (data: { [key: string]: string }) => {
        let keys = [
            { name: 'fieldNameNum', des: '字段名称' },
            { name: 'firstDataNum', des: '第一个数据行' },
            { name: 'lastDataNum', des: '最后一个数据行' }
        ]
        let result = true;
        for (let item of selectSheetList) {
            if (!sheetParamsMap.hasOwnProperty(item.value)) {
                result = false;
                message.warning(item.label + '有效区间未设置')
            } else {
                let sheetParams = sheetParamsMap[item.value];
                for (let key of keys) {
                    if (!sheetParams[key.name] || sheetParams[key.name] === '') {
                        message.warning(`${item.label}中的${key.des}未设置`);
                        result = false;
                    }
                }
            }
        }
        return result;
    }

    const parseObj2Arr = (obj: any) => {
        let keys = Object.keys(obj);
        return keys.map(key => {
            return { sheetName: key, ...obj[key] }
        })
    }

    const obj2Arr = (obj: any) => {
        let keys = Object.keys(obj);
        return keys.map(key => {
            return { ...obj[key] }
        })
    }

    const getStep3Body = (obj: any) => {
        let keys = Object.keys(obj);
        //过滤未选择导出的字段
        return keys.map(key => {
            return {
                sheetName: key,
                fields: [...obj[key]].filter((item) => item.isInclude != 0),
                ...sheetParamsMap[key]
            }
        })
    }




    // -------------第三步----------------
    const getStep3DataMap = (arr: any) => {
        let res: any = {};
        arr.map((item: any) => {
            if (!res.hasOwnProperty(item.sheetName)) {
                let fields = item.fields || [];
                res[item.sheetName] = fields.map((field: any) => {
                    return {
                        "fieldName": field.fieldName,
                        "isInclude": 0,
                        "isPrimary": 0,
                        // "type": field.type,
                        "type": ''
                    }
                })

            }
        })

        return res;
    }

    const objProps2String = (arr: any[]) => {
        for (let item of arr) {
            if (Array.isArray(item.isPrimary)) {
                item.isPrimary = item.isPrimary[0]
            }
            if (Array.isArray(item.isInclude)) {
                item.isInclude = item.isInclude[0]
            }
            if (item.hasOwnProperty('index')) {
                delete item?.index;
            }

            if (item.isPrimary === undefined) {
                item.isPrimary = 0;
            }
            if (item.isInclude === undefined) {
                item.isInclude = 0;
            }
        }

        return arr;
    }


    //所有sheet数据
    const [step3DataMap, setStepDataMap] = useState<any>()
    const [step3Sheet, setStep3Sheet] = useState<string>('')
    //当前正在操作的sheet数据
    const [step3SelectSheet, setStep3SelectSheet] = useState([])
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(step3SelectSheet.map((item: any) => item.fieldName));



    const [step4Data, setStep4Data] = useState<any>({});

    const step3SheetChange = (sheet: string) => {
        setStep3Sheet(sheet)
        setStep3SelectSheet(step3DataMap[sheet])
        setEditableRowKeys(step3DataMap[sheet].map((item: any) => item.fieldName))
    }

    const handleSheetParamChange = (data: any) => {
        setStepDataMap({ ...step3DataMap, [step3Sheet]: objProps2String(data) })
    }

    //初始化
    useEffect(() => {
    }, [])

    const validateTableData = (arr: any[]) => {
        return new Promise((resolve, reject) => {
            let success = true;
            arr.forEach(sheet => {
                let { fields, sheetName } = sheet;
                if (fields.length === 0) {
                    success = false;
                    message.warning(`${sheetName}最少选择一个需要包含的字段`)
                }
                (fields as any[]).forEach(field => {
                    if (field.isInclude == 1 && (!field.type || field.type === '')) {
                        success = false;
                        message.warning(`${sheetName}-${field.fieldName}未选择字段类型`)
                    }
                })
            })

            if (success) {
                resolve(true)
            } else {
                reject(false)
            }
        })
    }

    function handleClose(){
        stepForm1.resetFields();
        stepForm2.resetFields();
        stepForm3.resetFields();
        setCurrent(0)
        setSheetList([])
        setImportFileList([])
        onCancel();
    }
    return <StepsForm<{
        name: string;
    }>

        current={current}
        onCurrentChange={(step) => { setCurrent(step) }}
        formRef={formRef}
        onFinish={async () => {
        }}
        submitter={{
            render: (props) => {
                if (props.step === 0) {
                    return [
                        <Button type="primary" key={props.step} onClick={() => props.onSubmit?.()}>
                            下一步
                        </Button>,
                    ]
                }
                if (props.step === 2) {
                    return [
                        <Button key="pre" onClick={() => props.onPre?.()}>
                            上一步
                        </Button>,
                        <Button type="primary" key={props.step} onClick={() => props.onSubmit?.()}>
                            确认导入
                        </Button>,
                    ]
                }

                if (props.step === 3) {
                    return [
                        <Button key="pre" onClick={() => props.onPre?.()}>
                            上一步
                        </Button>,
                        <Button type="primary" key={props.step} onClick={() => {props.onSubmit?.();handleClose();onOk()}}>
                            返回列表
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
        stepsFormRender={(dom, submitter) => {
            return (
                <Modal
                    style={{ maxWidth: 1160 }}
                     centered
                    title="数据选择"
                    width={700}
                    onCancel={() => onCancel()}
                    visible={modalVisible}
                    footer={submitter}
                    destroyOnClose
                >
                    {dom}
                    <XBModalLine />
                </Modal>
            );
        }}
    >
        {/* 第一步 */}
        <StepsForm.StepForm<{
            name: string;
        }>
            name="format"
            stepProps={{
                title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current > 0 })}>上传数据</span>
            }}
            form={stepForm1}
            onFinish={async () => {
                //设置选中的sheet
                let fields = await stepForm1.validateFields();
                let sheets = stepForm1.getFieldValue(['sheets']);
                if (sheets) setSelectSheetList(sheets.map((item: string) => { return { label: item, value: item } }));
                return true;
            }}
        >

            <ProFormUploadButton
                rules={[{ required: true, message: '请上传文件' }]}
                accept=".csv,.xlsx"
                fieldProps={{
                    name: 'file',
                    multiple: false,
                    headers: { ...getToken() },
                    onChange: (info: any) => handleImpoetChange(info),
                    fileList: importFileList
                }}
                label="选择文件"
                max={1}
                action={base + '/spw/spwDataSet/getFileSheet'}
            />

            <ProFormText name="dataSetName" label="数据集名称" rules={[{ required: true, message: '请输入数据集名称' }]} />
            <ProFormSelect
                request={async () => {
                    const data = await getSelectListOne('platformTypeList', '/spw/spwDataSet/getTypes');
                    console.log(data)
                    return [...data];
                }}
                name="dataSetType"
                rules={[{ required: true, message: '请选择类型' }]}
                label="类型"
            />

            <ProFormCheckbox.Group
                name="sheets"
                // layout='vertical'
                label="表"
                rules={[{ required: true, message: '请选择表' }]}
                options={sheetList}
            />

        </StepsForm.StepForm>

        {/* 第二步 */}
        <StepsForm.StepForm<{
            checkbox: string;
        }>
            form={stepForm2}
            name="data"
            title="设置参数"
            stepProps={{
                title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current > 1 })}>参数配置</span>
            }}
            onFinish={async () => {
                let success = validateSheetParams(sheetParamsMap);
                if (!success) return;
                let body = {
                    pathFileName: importFileList[0].response.data.pathFileName,
                    paramConfig: [...parseObj2Arr(sheetParamsMap)]
                }
                let res = await post('/spw/spwDataSet/getFileFields', { ...body })
                if (res.code === 200) {
                    if (res.data.length === 0) {
                        message.warning('区间内无数据')
                        return false;
                    }
                    setStep2httpData(res.data);
                    let map = getStep3DataMap(res.data);
                    setStepDataMap(map)
                    setStep3Sheet(res.data[0]?.sheetName);
                    console.log('map[res.data[0]?.sheetName]', map[res.data[0]?.sheetName])
                    setStep3SelectSheet(map[res.data[0]?.sheetName])
                    stepForm3.setFieldsValue({})
                    setEditableRowKeys(map[res.data[0]?.sheetName].map((item: any) => item.fieldName))

                    return true;
                } else {
                    message.error(res.msg)
                    return false;
                }
            }}
        >


            <ProFormSelect
                name="sheetName"
                fieldProps={{
                    onChange: (value: string) => {
                        handleSelectSheetChange(value)
                    }
                }}
                label="Sheet"
                options={selectSheetList}
                placeholder="选择数据源"
            />
            <ProFormText
                name="fieldNameNum"
                fieldProps={{
                    onChange: (e) => { inputChange(e.target.value, 'fieldNameNum') }
                }}
                label="字段名行"
            />
            <ProFormText
                name="firstDataNum"
                fieldProps={{
                    onChange: (e) => { inputChange(e.target.value, 'firstDataNum') }
                }}
                label="第一个数据行" />
            <ProFormText
                name="lastDataNum"
                fieldProps={{
                    onChange: (e) => { inputChange(e.target.value, 'lastDataNum') }
                }}
                label="最后一个数据行"
            />
        </StepsForm.StepForm>
        {/* 第三步 */}
        <StepsForm.StepForm
            form={stepForm3}
            name="field"
            onFinish={async () => {
                const paramConfig = getStep3Body(step3DataMap);
                await validateTableData(paramConfig)
                let fileData = importFileList[0].response.data;
                let body = {
                    pathFileName: fileData.pathFileName,
                    originalFileName: fileData.originalFileName,
                    dataSetName: stepForm1.getFieldValue('dataSetName'),
                    dataSetType: stepForm1.getFieldValue('dataSetType'),
                    paramConfig: paramConfig
                }
                let res = await post('/spw/spwDataSet/upload', { ...body })
                if (res.code === 200) {
                    setStep4Data(res.data)
                    return true;
                } else {
                    message.error(res.msg)
                    return false;
                }
            }}
            stepProps={{
                title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current > 2 })}>字段设置</span>
            }}
        >

            <Select value={step3Sheet} style={{ width: '100%', marginBottom: 30 }} onChange={step3SheetChange}>
                {
                    step2httpData.map((item: any) => <Option key={item.sheetName} value={item.sheetName}>{item.sheetName}</Option>)
                }
            </Select>
            <EditableProTable<DataSourceType>
                style={{ maxWidth: '700px' }}
                columns={columns}
                rowKey="fieldName"
                controlled={true}
                recordCreatorProps={false}
                value={step3SelectSheet}
                onChange={(data) => handleSheetParamChange(data)}
                editable={{
                    type: 'multiple',
                    editableKeys,
                }}
            />

        </StepsForm.StepForm>

        <StepsForm.StepForm
            onFinish={async () => {
                navigator('/data/list')
            }}
            name="success"
            stepProps={{
                title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current > 2 })}>导入完成</span>
            }}
        >

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 350 }}>
                <CheckCircleFilled style={{ fontSize: 60, color: '#03b3c3', marginBottom: 25 }} />
                <span style={{ fontWeight: 'bold', fontSize: 20, color: '#FFF', marginBottom: 12 }}>数据导入完成</span>
                {/* <span style={{ color: '#7dcff4', fontSize: 9, marginBottom: 16 }}> */}
                {/* <Countdown callback={() => onCancel()} isStart={false} /> */}
                {/* 10秒后自动返回至算法任务列表页面</span>
                <Button onClick={() => onCancel()} type="primary">查看算法任务列表</Button> */}
                <div className={styles.importResult}>
                    <span style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#FFF' }}>导入结果信息</span>
                    <span className={styles.base}>导入用时：{step4Data['导入用时']}</span>
                    <span className={styles.base}>处理记录：{step4Data['处理记录']}</span>
                    <span className={styles.success}>导入成功：{step4Data['导入成功']}</span>
                    <span className={styles.error}>导入失败：{step4Data['导入失败']}</span>
                </div>
            </div>

        </StepsForm.StepForm>
    </StepsForm>
}

export default Import;