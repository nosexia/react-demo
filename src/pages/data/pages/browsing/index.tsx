import { Button, Col, Form, message, Modal, Row } from 'antd';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../../index.module.less';
import { useNavigate, useLocation } from 'react-router-dom';
import qs from 'qs';
import { PlusOutlined, FullscreenOutlined, DownloadOutlined } from '@ant-design/icons'



import { ProFormRadio, ProFormSelect, StepsForm } from '@ant-design/pro-form';
import OpacityCart from '@pages/data/components/card';
import ChartSelect from '@pages/data/components/chartSelect';
import { get, post } from '@api/request';

import nullData from '../../assets/images/data-null.png'

//图表
import Area from './pages/area-chart';
import Line from './pages/line-chart';
import Lines from './pages/line-charts';
import Bar from './pages/bar-graph';
import Column from './pages/histogram'
import Pie from './pages/pie';
import Scatter from './pages/scatter-plot';
import Aggregation from './pages/data-aggregation';

import classnames from 'classnames';
import XBModalLine from '@components/xb-modal-line';

const LOCAL_PATH = '/data/browsing';

const CHART_TYPES = [
    'lines',
    'area',
    'column',
    'bar',
    'scatter',
    'aggregation'
];

type CHART_TYPE = 'area' | 'bar' | 'line' | 'lines' | 'pie' | 'aggregation' | 'column' | 'scatter'

type ChartData = {
    sheetName: string,
    chart: CHART_TYPE
    data: {
        x: string,
        y: string,
        category: string,
    }[]
}

const refs: any[] = [];

const Browsing: FC = (props) => {
    const navigator = useNavigate();
    const [addModelVisible, setAddModelVisible] = useState<boolean>(false);
    const location = useLocation();
    let params = location.search.length > 1 && qs.parse(location.search.substring(1)) || {}
    let id: string | undefined;
    if (params.hasOwnProperty('id')) {
        id = params.id as unknown as string;
    }


    const [chartDataArr, setChartDataArr] = useState<any[]>([])


    const [sheet, setSheet] = useState<string | undefined>();
    const [xRadios, setxRadios] = useState<string[]>([])
    const [yRadios, setyRadios] = useState<string[]>([])
    const [classRadios, setClassRadios] = useState<string[]>([])
    const [chart, setChart] = useState<string | undefined>()
    const [sheetDataMap, setSheetDataMap] = useState<{ [key: string]: any[] }>({})

    const [current, setCurrent] = useState(0);

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();

    const parseSheetDataMap = (arr: any[]) => {
        let map: { [key: string]: any } = {};
        arr.forEach(item => {
            map[item.sheetName] = item.fields;
        })

        return map;
    }

    const getSheetInfo = async () => {
        let res = await get(`/spw/spwDataSet/getSheetForExport/${id}`)
        if (res.code === 200) {
            setSheetDataMap(parseSheetDataMap(res.data));
        }
    }

    const getChartComponent = (type: CHART_TYPE, data: any) => {
        switch (type) {
            case 'area':
                return <Area callback={handleRefBack} data={data} />
            case 'bar':
                return <Bar callback={handleRefBack} data={data} />
            case 'line':
                return <Line callback={handleRefBack} data={data} />
            case 'lines':
                return <Lines callback={handleRefBack} data={data} />
            case 'pie':
                return <Pie callback={handleRefBack} data={data} />
            case 'scatter':
                return <Scatter callback={handleRefBack} data={data} />
            case 'column':
                return <Column callback={handleRefBack} data={data} />
            case 'aggregation':
                return <Aggregation callback={handleRefBack} data={data} />
        }
    }

    const getRefChartComponent = (type: CHART_TYPE | undefined, data: any) => {
        switch (type) {
            case 'area':
                return <Area ref={modalChartRef} data={data} />
            case 'bar':
                return <Bar ref={modalChartRef} data={data} />
            case 'line':
                return <Line ref={modalChartRef} data={data} />
            case 'lines':
                return <Lines ref={modalChartRef} data={data} />
            case 'pie':
                return <Pie ref={modalChartRef} data={data} />
            case 'scatter':
                return <Scatter ref={modalChartRef} data={data} />
            case 'column':
                return <Column ref={modalChartRef} data={data} />
            case 'aggregation':
                return <Aggregation ref={modalChartRef} data={data} />
        }
    }

    const clearData = () => {
        setChart(undefined);
        setSheet(undefined);
        setAddModelVisible(false);
        form2.setFieldsValue({ sheet: '', x: '', y: '', z: '' })
        setCurrent(0)
    }

    useEffect(() => {
        if (addModelVisible) {
            //初始化
            let sheet = Object.keys(sheetDataMap)[0]
            setSheet(sheet);
        } else {
            clearData();
        }
    }, [addModelVisible])

    const modalChartRef = useRef(null);
    const [screenChartData, setScreenChartData] = useState<ChartData>();

    //放大展示
    const [fullscreenActive, setFullscreenActive] = useState(false);
    const handleFullscreen = (chartItem: ChartData) => {
        setFullscreenActive(true);
        setScreenChartData(chartItem)
    }


    const handleRefBack = (ref: any) => {
        refs.push(ref.downloadImage);
    }

    const handleDownload = (chartItem: ChartData, index: number) => {
        refs[index](`${chartDataArr[index]?.sheetName}-${chartDataArr[index]?.chart}`)
    }

    const renderCharts = useMemo(() => {
        return chartDataArr.map((item, index) => (
            <Col key={index} xxl={8} xl={12} lg={12} md={24} sm={24} xs={24} className={styles.col}>
                <OpacityCart>
                    {/* <Line callback={handleRefBack} data={item.data} /> */}
                    {
                        getChartComponent(item.chart, item.data)
                    }
                    <div className={styles.bar}>
                        <span>{item.sheetName}</span>
                        < FullscreenOutlined onClick={() => handleFullscreen(item)} className={classnames(styles.icon, styles.iconScreen)} />
                        <DownloadOutlined onClick={() => handleDownload(item, index)} className={classnames(styles.icon, styles.iconDownload)} />
                    </div>
                </OpacityCart>
            </Col>
        ))
    }, [chartDataArr])

    useEffect(() => {
        getSheetInfo();
        //添加window 自定义事件
    }, [])
    return (
        <div className={styles.browsingContainer}>
            <Row justify="start" className={styles.rowClass} gutter={[16, 40]} wrap>
                {renderCharts}
                <Col key={'add2'} xxl={8} xl={8} lg={12} md={12} sm={12} xs={24}>
                    <OpacityCart>
                        {/* <div className={styles.pie}></div> */}
                        <span className={styles.cardTitle}>请添加展示数据</span>
                        <span className={styles.cardDesc}>添加数据后才能执行相关操作</span>
                        <img style={{ width: 100, height: 100 }} src={nullData} alt="空" />
                        <Button onClick={() => setAddModelVisible(true)} type="primary" style={{ marginTop: 10 }} shape="round" icon={<PlusOutlined />}>添加数据</Button>
                    </OpacityCart>
                </Col>

            </Row>

            <Modal
                width={'80%'}
                title={screenChartData?.sheetName}
                footer={[
                    <Button key="back" onClick={() => setFullscreenActive(false)}>
                        关闭
                    </Button>,
                    <Button key="submit" type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => (modalChartRef.current as any)?.downloadImage(`${screenChartData?.sheetName}-${screenChartData?.chart}`)}>
                        下载
                    </Button>,
                ]}
                onCancel={() => setFullscreenActive(false)}
                visible={fullscreenActive}
            >
                {
                    getRefChartComponent(screenChartData && screenChartData.chart, screenChartData && screenChartData.data || [])
                }
                {/* <Line ref={modalChartRef} data={} /> */}
                <XBModalLine />
            </Modal>

            <StepsForm
                current={current}
                onCurrentChange={(step) => { setCurrent(step) }}
                // stepsRender={() => null}
                onFinish={async (values) => {
                    let chartCardData = {
                        ...values,
                        sheetName: sheet,
                        type: chart,
                        dataSetId: id,
                    }
                    //获取数据
                    let res = await post('/spw/spwDataSet/dataBrowsingByCharts', { ...chartCardData });
                    if (res.code === 200) {
                        let charData = {
                            sheetName: sheet,
                            chart: chart,
                            data: [...res.data]
                        }

                        console.log('charData', charData)
                        setChartDataArr([...chartDataArr, charData])

                        message.success('图表生成成功');
                        clearData();
                    } else {
                        // message.error('图表生成失败:' + res.msg)
                    }
                    console.log(res)
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
                            width={700}
                            onCancel={() => setAddModelVisible(false)}
                            visible={addModelVisible}
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
                    title="图表选择"
                    onFinish={async () => {
                        if (!chart) {
                            message.warning('请选择图表')
                            return;
                        }
                        if (sheet) {
                            let radios = sheetDataMap[sheet]
                            //设置X的选项
                            setxRadios(radios)
                            //设置Y的选项
                            setyRadios(radios)
                            //设置类型的选项
                            setClassRadios(radios)
                        }

                        return true;
                    }}
                >
                    <Form.Item>
                        <ChartSelect selectChange={(value) => {
                            setChart(value);

                        }}></ChartSelect>
                    </Form.Item>
                </StepsForm.StepForm>
                <StepsForm.StepForm
                    form={form2}
                    onFinish={async () => {
                        await form2.validateFields()
                        return true;
                    }}
                    name="checkbox"
                    title="数据选择">

                    <ProFormSelect
                        name="sheetName"
                        fieldProps={{
                            value: sheet,
                            onChange: (value: string) => {
                                setSheet(value);

                                let radios = sheetDataMap[value]
                                //设置X的选项
                                setxRadios(radios)
                                //设置Y的选项
                                setyRadios(radios)
                                //设置类型的选项
                                setClassRadios(radios)
                            }
                        }}
                        label="选择表"
                        // rules={[{ required: true, message: '请选择表' }]}
                        options={Object.keys(sheetDataMap)}
                        placeholder="请选择表"
                    />

                    <ProFormRadio.Group
                        rules={[{ required: true, message: '请选择X轴' }]}
                        name="x"
                        label={chart !== 'pie' ? "X轴" : '分类'}
                        options={xRadios}
                    />

                    <ProFormRadio.Group
                        rules={[{ required: true, message: '请选择Y轴' }]}
                        name="y"
                        label={chart !== 'pie' ? "Y轴" : "数量"}
                        options={yRadios}
                    />

                    {CHART_TYPES.includes(chart as string) && <ProFormRadio.Group
                        // rules={[{ required: true, message: '请选择分类' }]}
                        name="z"
                        label="分类"
                        options={classRadios}
                    />}
                </StepsForm.StepForm>
            </StepsForm>
        </div>

    )
}

export default Browsing;