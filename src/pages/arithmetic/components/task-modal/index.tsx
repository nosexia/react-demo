import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormCheckbox, ProFormRadio, ProFormSelect, ProFormText, StepsForm } from '@ant-design/pro-form';
import XBModalLine from '@components/xb-modal-line';
import { Button, Form, Input, message, Modal } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import IconImput from '../../../../components/icon-input-str';
import { get, post, base } from '@api/request'
import { CheckCircleFilled } from '@ant-design/icons';
import Countdown from '@components/countdown';
import { useNavigate } from 'react-router';
import { identity } from '@antv/util';
import axios from 'axios';
import Files from 'react-files'

type IProps = {
    modalVisible: boolean;
    algorithmName: string;
    algorithmId: string;
    algorithmNameEN: string,
    algorithmType: string,
    onOk: () => void;
    onCancel: () => void;
}
const TaskModal: FC<IProps> = ({ modalVisible, algorithmName, algorithmNameEN, algorithmType, onOk, onCancel }) => {
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [form4] = Form.useForm();
    const navigate = useNavigate();
    // const [modalVisible, setModalVisible] = useState(true);
    const [current, setCurrent] = useState(0);
    //数据集列表
    const [dataList, setDataList] = useState<any[]>([]);

    const [params, setParams] = useState<any[]>([{}])

    //动态sheetLabel
    const [sheetLabel, setSheetLabel] = useState([]);
    //保存数据
    const [sheetDataMap, setSheetDataMap] = useState<any>({});
    //保存动态渲染fields map
    const [sheetMap, setSheetMap] = useState({});
    //选中的数据
    const [selectSheetMap, setSelectSheetMap] = useState<any>({});
    //当前选中的sheet
    const [currentSheet, setCurrentSheet] = useState('');
    //原始对象
    const ref = useRef(null);
    //选中的文件
    const [files, setFiles] = useState([]);
    useEffect(() => {
        if (modalVisible) {
            //发起请求，获取索支持的数据模型列表
            // const dataListDemo = [{ label: '智慧城市数据集', value: 1 }, { label: 'AI城市挑战赛数据集', value: 2 }, { label: '智慧城市数据集2', value: 3 }, { label: 'AI城市挑战赛数据集2', value: 4 }]

            post('/spw/spwDataSet/list').then((res) => {
                setDataList(res.rows.map((item: any) => {
                    return {
                        label: item.dataSetName,
                        value: item.id,
                    }
                }))
            })
            // setDataList([...dataListDemo])
            //获取参数列表
            getParams(algorithmNameEN);
        } else {
            //关闭清空
            setCurrent(0);
            form1.resetFields();
            form2.resetFields();
            form3.resetFields();
            form4.resetFields();
        }
    }, [modalVisible])

    async function getParams(algorithmName: string) {
        let result = await get(`/spw/machineLearning/createTask/getModelParameter/${algorithmName}`)
        if (result.code === 200) {
            setParams(result.data)
        }
    }

    function getParamsItem(params: any[]) {
        let result: any[] = [];
        for (let i = 0; i < params.length; i += 2) {
            let curItem = params[i];
            let nextItem = params[i + 1];
            curItem && result.push(
                <ProForm.Group key={i}>
                    <Form.Item label={curItem.ParamsName} name={curItem.ParamsName}>
                        <IconImput {...curItem} />
                    </Form.Item>
                    {
                        nextItem && <Form.Item label={nextItem.ParamsName} name={nextItem.ParamsName}>
                            <IconImput   {...nextItem} />
                        </Form.Item>
                    }
                </ProForm.Group>
            )
        }

        return result;
    }

    function getSheetMap(data: any = []) {
        let labels: any[] = [];
        let sheetMap: any = {};
        let sheetDataMap: any = {};
        data.forEach((item: any) => {
            let sheetName = item.sheetName;
            labels.push({ label: sheetName, value: sheetName });
            sheetMap[sheetName] = item.fields;
            sheetDataMap[sheetName] = item.data;
        })
        return [labels, sheetMap, sheetDataMap]
    }

    function getSheetData(data: any[]) {
        let sheetData: any[] = [];
        data.forEach((item) => {
            let dataItem = item.data[0];
            let sheet = {
                sheetName: item.sheet,
                fields: Object.keys(dataItem),
                data: item.data,
            }
            sheetData.push(sheet)

        })
        return sheetData;
    }

    function onFilesChange(e: any) {
        console.log('onFilesChange', e)
        setFiles(e)
    }

    function onFilesError(e: any) {
        console.log('onFilesError', e)
    }

    function filesRemoveOne(file: string) {
        ref?.current?.removeFile?.(file)
    }

    return <StepsForm
        current={current}
        onCurrentChange={(step) => { setCurrent(step) }}
        // stepsRender={() => null}
        onFinish={async (values) => {
            setCurrent(0);
            form1.resetFields();
            form2.resetFields();
            form3.resetFields();
            onCancel();
            return true;
        }}
        formProps={{
            validateMessages: {
                required: '此项为必填项',
            },
        }}
        stepsFormRender={(dom, submitter) => {
            return (
                <Modal
                    centered
                    title="数据选择"
                    width={760}
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
        <StepsForm.StepForm
            form={form1}
            name="base"
            title="选择数据集"
            onFinish={async (fields) => {
                //获取数据集sheet信息
                let id = fields.dataSetId;
                let res = await get(`/spw/spwDataSet/dataBrowsingByTable/${id}`)
                if (res.code === 200) {
                    let sheetData = getSheetData(res.data)
                    let [labels, sheetMap, sheetDataMap] = getSheetMap(sheetData);
                    setSheetLabel(labels);
                    setSheetMap(sheetMap);
                    setSheetDataMap(sheetDataMap);
                    return true;
                }
            }}
        >

            <ProFormRadio.Group
                name="dataSetId"
                layout="vertical"
                rules={[{ required: true, message: '请选择数据集！' }]}
                label=""
                options={dataList}
            />


        </StepsForm.StepForm>
        <StepsForm.StepForm
            form={form2}
            name="base2"
            title="选择字段"
            onFinish={async () => {
                let res = await get(`/spw/machineLearning/createTask/getModelParameter/${algorithmNameEN}`);
                setParams(res.data)
                return true;
            }}
        >
            <ProFormSelect
                fieldProps={{
                    onChange: (value: string) => {
                        setCurrentSheet(value);
                    }
                }}
                name="resource"
                label="源"
                options={sheetLabel}
                placeholder="请选择数据源！"
                rules={[{ required: true, message: '数据源为必填项！' }]}
            />

            <ProFormCheckbox.Group
                fieldProps={{
                    onChange: (data) => {
                        setSelectSheetMap({ ...selectSheetMap, [currentSheet]: data })
                    }
                }}
                name="fields"
                layout="vertical"
                label="选择列"
                options={(sheetMap as any)[currentSheet]}
            />
        </StepsForm.StepForm>
        <StepsForm.StepForm
            form={form3}
            name="base3"
            title="参数配置"
            onFinish={async (fields) => {
                let { taskName, ...modelParameter } = fields;
                let body = {
                    modelFile: '',
                    params: {
                        modelParameter:files?.length > 0 ? {} : modelParameter ,
                        taskName,
                        algorithmName: algorithmNameEN,
                        algorithmType: algorithmType,
                        dataSetId: form1.getFieldValue('dataSetId'),
                        paramConfig: sheetDataMap[currentSheet]?.map((dataItem: any) => {
                            let fields = selectSheetMap[currentSheet]
                            let result: string[] = [];
                            for (let i = 0; i < fields.length; i++) {
                                if (dataItem.hasOwnProperty((fields as string[])[i])) {
                                    result.push(dataItem[(fields as string[])[i]])
                                }
                            }
                            return result;
                        })

                    },
                }
                let formData = new FormData();
                formData.append('params', JSON.stringify(body.params))
                if (files.length > 0) {
                    formData.append('modelFile',new Blob([files[0]], { type: files[0].type }), files[0].name || 'file')
                    // formData.append('modelFile', files[0],files[0].name || 'file')
                } else {
                    formData.append('modelFile', new File(['foo'], 'test.txt'))
                }

                let res = await axios.post(base + '/spw/machineLearning/createTask', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: localStorage.getItem("token")
                    }
                });

                if (res.data.code === 200) {
                    message.success(res.data.msg)
                    return true;
                }
                return false;
            }}
        >
            {/* <ProForm.Group> */}
            <ProFormText rules={[{ required: true, message: '请输入任务名称' }]} label="任务名称" name="taskName" />
            {/* </ProForm.Group> */}
            <Files
                ref={ref}
                className='files-dropzone'
                onChange={onFilesChange}
                onError={onFilesError}
                // accepts={[]}
                multiple={false}
                maxFiles={1}
                maxFileSize={10000000}
                minFileSize={0}
                clickable
            >
                <Button style={{ marginBottom: 16 }}>选择模型文件</Button>
            </Files>

            {
                files.length > 0
                    ? <div className='files-list'>
                        <ul>{files.map((file: any) =>
                            <li className='files-list-item' key={file.id}>
                                <div className='files-list-item-preview'>
                                    {file.preview.type === 'image'
                                        ? <img className='files-list-item-preview-image' src={file.preview.url} />
                                        : <div className='files-list-item-preview-extension'>{file.extension}</div>}
                                </div>
                                <div className='files-list-item-content'>
                                    <div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div>
                                    <div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>
                                </div>
                                <div
                                    id={file.id}
                                    className='files-list-item-remove'
                                    onClick={() => filesRemoveOne(file)} // eslint-disable-line
                                />
                            </li>
                        )}</ul>
                    </div>
                    : null
            }
            {
                files.length <= 0 && <ProForm.Group label={"算法参数"}>
                    {
                        getParamsItem(params)
                    }
                </ProForm.Group>
            }

        </StepsForm.StepForm>
        <StepsForm.StepForm
            form={form4}
            name="base4"
            title="调用成功"
            onFinish={async () => {
                return true;
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 350 }}>
                <CheckCircleFilled style={{ fontSize: 60, color: '#03b3c3', marginBottom: 25 }} />
                <span style={{ fontWeight: 'bold', fontSize: 20, color: '#FFF', marginBottom: 12 }}>新建任务完成</span>
                {/* <span style={{ color: '#7dcff4', fontSize: 9, marginBottom: 16 }}> */}
                {/* <Countdown callback={() => navigate('/arithmetic/task-list')} /> */}
                {/* 10秒后自动返回至算法任务列表页面</span> */}
                <Button onClick={() => navigate('/arithmetic/task-list')} type="primary">查看算法任务列表</Button>
            </div>

        </StepsForm.StepForm>
    </StepsForm>
}

export default TaskModal;