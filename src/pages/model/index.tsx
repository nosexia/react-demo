import React, { FC, useState, useEffect, useMemo } from 'react'
import CardItem from '../../components/CardItem'
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.less";
import { Button, Form, message, Space, Tabs } from 'antd';
import BorderBox from '@components/border-box';
import { PlusCircleOutlined, EyeOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import cardHeader from './assets/cardHeader.png';
import BorderModal from '@components/border-modal';
import ProForm from '@ant-design/pro-form';
import IconImput from '@components/icon-input';
import BorderModalForm from '@components/border-modal-form';
import { parseParams } from '@utils/utils';
import { get, post } from '@api/request';
import { LoadingOutlined } from '@ant-design/icons';
import IconNumbert from '@components/icon-number';
import IconBool from '@components/icon-bool';
import IconFloat from '@components/icon-float';
const PATH_NAME = '/model';
const { TabPane } = Tabs;

const staticDate: any = {
    1: {
        description: `智慧园区场景建模聚焦于3个体系能力，包括园区危险态势感知能力、细粒度空气质量预测能力和交通流量预测能力。场景模拟使用了体系多源异构数据融合的方法，利用有限的空气质量监测站和其他各系统的数据，利用半监督协同训练的方法完成细粒度的空气质量预测。场景模拟整合了安防、交通、地理信息等系统产生的数据，使用多系统交互的危险识别方法，实现园区的危险态势感知。场景模拟对交通要素进行了分类设计，并按照园区的实际工作时间对速度、密度进行模拟，使用神经网络等算法，对交通流量进行了实时预测。
        `,
        modalScene: `搭建建模场景中的地图系统，设置道路、工厂、居民区、商业区等场景要素，可以按照需求进行配置初始化，
        同时支持对场景内智能体导入算法。场景基于初始条件与智能体进行仿真迭代，并实时保存环境参数、迭代状态
        、算法结果等实验相关数据。园区场景范围为9km*5km，包括30个工厂，35个居民区，15个商业区，300个危险品传感器，9
        个空气质量监测站等元素。工厂按每厂10人的标准配置工人，工人随机分为三班，并在换班时在居民区与工厂间进行流动。车
        辆随机进入场景，为工厂提供原材料并运走产品。工厂在正常生产的过程中产生危险品和污染物，污染物发生扩散，受风速、风
        向的影响，并被空气传感器监测。`,
        ys: `包括车辆、人员、场景控制器等智能体，和工厂、居民区、传感器等非智
        能体。智能体拥有算法能力，能够在感知到当前状态后自行制定策略。例如，
        车辆可以感知目的地坐标、交通密度、时间、场景出入口等，能够规划下一刻的
        位置、速度或切换目的地，并拥有移动、装卸、速度调整等行为。非智能体不具备算
        法能力，无法指定策略，仅能按设定对发生的简单事件做出响应。例如，工厂可以感知输入材
        料数量、当前工人数量、当前产品堆积量等，并拥有产品生产、效率变化、污染产生等行为。`,
        dataService: `仿真模拟过程，可以对生成的数据进行格式统一与存储。方法为MinIO，是一种对
        象存储方法。对象存储是一种用于处理大量非结构
        化数据的数据存储架构。这些数据不符合或无法轻松组织到具有行和列
        的传统关系数据库中。MinIO具有高性能、可扩展性、云的原生支持、源代码开放、企业级支持等优势。`,
        arithemtic: `
        <p>. 多语言算法源代码集成：基于Pybind、Pymatlab等技术集成当前使用Python,C++,Matlab等不同语言实现的算法及算子，并提供Python接口。</p>
        <p>. 算法模块标准化输入输出：按算法任务（分类，回归，聚类等）分类，对不同任务的算法设计统一数据输入与结果输出接口，并依据此标准接口，对该算法核心进行基于Python的I/O封装。</p>
        <p>. 算法参数可配置：提供标准化的算法参数配置接口。</p>
        <p>. 算法结果持久化：在算法推理迭代过程中，按标准格式对算法单步输出结果进行本地持久化。</p>
        `
    },

    2: {
        description: `智慧应急场景建模设定发生在智慧城市中，模拟了不同时段，不同气象和交通状况下，多种烈度的恐怖袭击事件，并对恐怖袭击发生后的区域失明、智能体混乱、建筑物与道路被破坏等情况进行了仿真模拟。 模拟场景中，恐怖分子将携带武器对城市的智能体和设施进行破坏。同时，城市内的安防、医疗、救援等系统得到调度，完成对恐袭的反击、对人员的救护、对车辆、建筑等设施的维修。 在此场景和过程中，利用人工智能技术，解决复杂气象、交通、透明度模糊的态势感知等条件下的实时应急疏散方案制定和对恐袭的反击行动规划调度方案制定。

        `,
        modalScene: `搭建建模场景中的地图系统，设置道路、工厂、居民区、商业区等场景要素，可以按照需求进行配置初始化，同时支持对场景内智能体导入算法。场景基于初始条件与智能体进行仿真迭代，并实时保存环境参数、迭代状态、算法结果等实验相关数据。城市场景范围为5km*5km，包括30个工厂，35个居民区，15个商业区，3种WZ力量，30名医疗救护人员，30名消防人员，20名工程人员，15名恐怖分子。模拟不同时段，不同气象和交通状况下，多种烈度的恐怖袭击事件，并对恐怖袭击发生后的区域失明、信息滞后、智能体混乱、建筑物与道路被破坏等情况进行了建模。恐袭发生时，恐怖分子将携带不同攻击力的武器对城市的智能体和设施进行破坏，影响范围内交通失效，非智能体面临不同程度的失效，被攻击的智能体损失健康度，传感器和网络的态势感知能力降低。同时，城市内的安防、医疗、救援等系统得到调度，完成对恐袭的反击、对人员的救护、对车辆、建筑、道路及其他设施的维修。`,
        ys: `包括车辆、人员（WZ力量、医疗救护人员、消防人员、工程人员、恐怖分子、普通人员）等智能体，和道路、工厂、居民区、传感器等非智能体。智能体拥有算法能力，能够在感知到当前状态后自行制定策略。例如，普通人员可以感知目的地坐标、道路地图、交通密度、时间、健康度等，能够规划下一刻的位置、速度或切换目的地，并拥有移动、速度调整等行为；医疗救护人员在此基础上，增加交战时在交战区外进行伤员救护，交战结束后进入交战区进行伤员救护的能力和行为。非智能体不具备算法能力，无法指定策略，仅能按设定对发生的简单事件做出响应。例如，居民区可以感知健康度和当前人员数量等，并在健康度为0时产生后果。`,
        dataService: `仿真模拟过程，可以对生成的数据进行格式统一与存储。方法为MinIO，是一种对象存储方法。对象存储是一种用于处理大量非结构化数据的数据存储架构。这些数据不符合或无法轻松组织到具有行和列的传统关系数据库中。MinIO具有高性能、可扩展性、云的原生支持、源代码开放、企业级支持等优势。`,
        arithemtic: `<p>. 多语言算法源代码集成：基于Pybind、Pymatlab等技术集成当前使用Python,C++,Matlab等不同语言实现的算法及算子，并提供Python接口。</p>
        <p>. 算法模块标准化输入输出：按算法任务（分类，回归，聚类等）分类，对不同任务的算法设计统一数据输入与结果输出接口，并依据此标准接口，对该算法核心进行基于Python的I/O封装。</p>
        <p> . 算法参数可配置：提供标准化的算法参数配置接口。</p>
        <p>. 算法结果持久化：在算法推理迭代过程中，按标准格式对算法单步输出结果进行本地持久化。</p>`
    },

    3: {
        description: `中关村环保园智慧应急场景建模设定发生在智慧城市中，模拟了不同时段，不同气象和交通状况下，多种烈度的恐怖袭击事件，并对恐怖袭击发生后的区域失明、智能体混乱、建筑物与道路被破坏等情况进行了仿真模拟。 模拟场景中，恐怖分子将携带武器对城市的智能体和设施进行破坏。同时，城市内的安防、医疗、救援等系统得到调度，完成对恐袭的反击、对人员的救护、对车辆、建筑等设施的维修。 在此场景和过程中，利用人工智能技术，解决复杂气象、交通、透明度模糊的态势感知等条件下的实时应急疏散方案制定和对恐袭的反击行动规划调度方案制定。

        `,
        modalScene: `搭建建模场景中的地图系统，设置道路、工厂、居民区、商业区等场景要素，可以按照需求进行配置初始化，同时支持对场景内智能体导入算法。场景基于初始条件与智能体进行仿真迭代，并实时保存环境参数、迭代状态、算法结果等实验相关数据。城市场景范围为5km*5km，包括30个工厂，35个居民区，15个商业区，3种WZ力量，30名医疗救护人员，30名消防人员，20名工程人员，15名恐怖分子。模拟不同时段，不同气象和交通状况下，多种烈度的恐怖袭击事件，并对恐怖袭击发生后的区域失明、信息滞后、智能体混乱、建筑物与道路被破坏等情况进行了建模。恐袭发生时，恐怖分子将携带不同攻击力的武器对城市的智能体和设施进行破坏，影响范围内交通失效，非智能体面临不同程度的失效，被攻击的智能体损失健康度，传感器和网络的态势感知能力降低。同时，城市内的安防、医疗、救援等系统得到调度，完成对恐袭的反击、对人员的救护、对车辆、建筑、道路及其他设施的维修。`,
        ys: `包括车辆、人员（WZ力量、医疗救护人员、消防人员、工程人员、恐怖分子、普通人员）等智能体，和道路、工厂、居民区、传感器等非智能体。智能体拥有算法能力，能够在感知到当前状态后自行制定策略。例如，普通人员可以感知目的地坐标、道路地图、交通密度、时间、健康度等，能够规划下一刻的位置、速度或切换目的地，并拥有移动、速度调整等行为；医疗救护人员在此基础上，增加交战时在交战区外进行伤员救护，交战结束后进入交战区进行伤员救护的能力和行为。非智能体不具备算法能力，无法指定策略，仅能按设定对发生的简单事件做出响应。例如，居民区可以感知健康度和当前人员数量等，并在健康度为0时产生后果。`,
        dataService: `仿真模拟过程，可以对生成的数据进行格式统一与存储。方法为MinIO，是一种对象存储方法。对象存储是一种用于处理大量非结构化数据的数据存储架构。这些数据不符合或无法轻松组织到具有行和列的传统关系数据库中。MinIO具有高性能、可扩展性、云的原生支持、源代码开放、企业级支持等优势。`,
        arithemtic: `<p>. 多语言算法源代码集成：基于Pybind、Pymatlab等技术集成当前使用Python,C++,Matlab等不同语言实现的算法及算子，并提供Python接口。</p>
        <p>. 算法模块标准化输入输出：按算法任务（分类，回归，聚类等）分类，对不同任务的算法设计统一数据输入与结果输出接口，并依据此标准接口，对该算法核心进行基于Python的I/O封装。</p>
        <p> . 算法参数可配置：提供标准化的算法参数配置接口。</p>
        <p>. 算法结果持久化：在算法推理迭代过程中，按标准格式对算法单步输出结果进行本地持久化。</p>`
    }
}

const Model: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    let { pathname } = location;
    const [params, setParams] = useState<any[]>([])
    const [addModalVisible, setAddModalVisible] = useState(false);

    function handleChange(obj: any, value: string) {
        obj.defaultValue = value;
    }

    //多个form
    function getParamsForms(params: any[]) {
        if (!params || params.length === 0) return <LoadingOutlined style={{ marginLeft: 335, display: 'inline-block', color: '#FFF' }} />;
        let result: any[] = [];
        for (let i = 0; i < params.length; i += 2) {
            let { form, name: formName } = params[i];
            let formGroup = <ProForm.Group key={formName + i} label={formName} >
                {
                    getParamsForm(form)
                }
            </ProForm.Group>

            result.push(formGroup)
        }

        return result;
    }

    function getSub(arr: any[]) {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            let curItem = arr[i];
            let nextItem = arr[i + 1];
            curItem && result.push(
                <ProForm.Group key={i}>
                    <Form.Item label={curItem.name} name={curItem.name}>
                        {
                            getFormItemByType(curItem.type, curItem)
                        }
                        {/* <IconImput onChange={((value) => handleChange(curItem, value))} ParamsDefaultValue={curItem.defaultValue} ParamsName={curItem.name} ParamsType={curItem.type} /> */}
                    </Form.Item>
                    {
                        nextItem && <Form.Item label={nextItem.name} name={nextItem.name}>
                            {
                                getFormItemByType(nextItem.type, nextItem)
                            }
                            {/* <IconImput onChange={((value) => handleChange(nextItem, value))} ParamsDefaultValue={nextItem.defaultValue} ParamsName={nextItem.name} ParamsType={nextItem.type} /> */}
                        </Form.Item>
                    }
                </ProForm.Group>
            )
        }

        return result;
    }

    function getFormItemByType(type: string, data: any) {
        switch (type) {
            case 'float':
                return <IconFloat onChange={((value) => handleChange(data, value))} ParamsDefaultValue={data.defaultValue} ParamsName={data.name} ParamsType={data.type} />
            case 'int':
                return <IconNumbert onChange={((value) => handleChange(data, value))} ParamsDefaultValue={data.defaultValue} ParamsName={data.name} ParamsType={data.type} />
            case 'bool':
                return <IconBool onChange={((value) => handleChange(data, value))} ParamsDefaultValue={data.defaultValue} ParamsName={data.name} ParamsType={data.type} />
            default:
                return <IconImput onChange={((value) => handleChange(data, value))} ParamsDefaultValue={data.defaultValue} ParamsName={data.name} ParamsType={data.type} />

        }
    }

    //Form下的表单子项
    function getParamsForm(arr: any[]) {
        if (!arr) return null;
        let result = [];
        for (let i = 0; i < arr.length; i += 2) {
            let curItem = arr[i];
            let nextItem = arr[i + 1];
            if (curItem.sub === null && nextItem?.sub === null) {
                curItem && result.push(
                    <ProForm.Group key={curItem.name + i}>
                        <Form.Item label={curItem.name} name={curItem.name} tooltip={curItem.description}>
                            {
                                getFormItemByType(curItem.type, curItem)
                            }
                        </Form.Item>
                        {
                            nextItem && <Form.Item label={nextItem.name} name={nextItem.name} tooltip={curItem.description}>
                                {
                                    getFormItemByType(nextItem.type, nextItem)
                                }
                                {/* <IconImput onChange={((value) => handleChange(nextItem, value))} ParamsDefaultValue={nextItem.defaultValue} ParamsName={nextItem.name} ParamsType={nextItem.type} /> */}
                            </Form.Item>
                        }
                    </ProForm.Group>
                )
            }

            if (curItem?.hasOwnProperty('sub') && curItem?.sub !== null) {
                result.push(<ProForm.Group label={curItem.name}>
                    {
                        getSub(curItem.sub)
                    }
                </ProForm.Group>)
            }
            if (nextItem?.hasOwnProperty('sub') && nextItem?.sub !== null) {
                result.push(<ProForm.Group label={nextItem.name}>
                    {
                        getSub(nextItem.sub)
                    }
                </ProForm.Group>)
            }

        }

        return result;
    }
    const id = useMemo(() => {
        let params = parseParams(location.search)
        return params.id || '1'
    }, [location]);

    useEffect(() => {
        if (addModalVisible) {
            get(`/spw/simmanger/getparamofcreate?scenarioIdx=${id}`).then((res) => {
                setParams(res.data)
            })
        } else {
            setParams([])
        }
    }, [addModalVisible])

    return (
        pathname === PATH_NAME ?
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.titleEn}>{'MODEL'}</span>
                    <span className={styles.title}>{`场景模型介绍`}</span>
                    <p className={styles.contextText}>{staticDate[id].description}</p>
                    <Space>
                        <Button onClick={() => setAddModalVisible(true)} icon={<PlusCircleOutlined />} type="primary">新建模型</Button>
                        <Button onClick={() => navigate(`/model/simulation?name="模型1"&id=${id}`)} icon={<EyeOutlined />} type="primary">仿真结果查看</Button>
                    </Space>


                </div>
                <div className={classnames(styles.contentWrap, 'tabs-wrap')}>
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="建模场景搭建" key="1">
                            <BorderBox>
                                <img className={styles.cardHeaderImg} src={cardHeader} alt="header" />
                                <div className={styles.context}>
                                    <span className={styles.cardTitle}>建模场景搭建详情介绍</span>
                                    <p dangerouslySetInnerHTML={{ __html: staticDate[id].modalScene }}></p>
                                </div>
                            </BorderBox>
                        </TabPane>
                        <TabPane tab="要素构建" key="2">
                            <BorderBox>
                                <img className={styles.cardHeaderImg} src={cardHeader} alt="header" />
                                <div className={styles.context}>
                                    <span className={styles.cardTitle}>要素构建详情介绍</span>
                                    <p dangerouslySetInnerHTML={{ __html: staticDate[id].ys }}>

                                    </p>
                                </div>
                            </BorderBox>
                        </TabPane>
                        <TabPane tab="数据服务" key="3">
                            <BorderBox>
                                <img className={styles.cardHeaderImg} src={cardHeader} alt="header" />
                                <div className={styles.context}>
                                    <span className={styles.cardTitle}>数据服务详情介绍</span>
                                    <p dangerouslySetInnerHTML={{ __html: staticDate[id].dataService }}>

                                    </p>
                                </div>
                            </BorderBox>
                        </TabPane>
                        <TabPane tab="算法服务" key="5">
                            <BorderBox>
                                <img className={styles.cardHeaderImg} src={cardHeader} alt="header" />
                                <div className={styles.context}>
                                    <span className={styles.cardTitle}>算法服务详情介绍</span>
                                    <p dangerouslySetInnerHTML={{ __html: staticDate[id].arithemtic }}>

                                    </p>
                                </div>
                            </BorderBox>
                        </TabPane>
                    </Tabs>
                </div>
                <BorderModalForm
                    title="新建模型"
                    visible={addModalVisible}
                    onFinish={async (fields: any) => {
                        let res = await post('/spw/simmanger/initInfo', {
                            "code": 200,
                            "msg": "操作成功",
                            "data": params
                        })
                        if (res.code === 200) {
                            message.success('提交成功');
                        }
                        return true;
                    }}
                    onVisibleChange={setAddModalVisible}
                    modalProps={
                        {
                            width: 800,
                            centered: true
                        }
                    }
                >
                    {
                        getParamsForms(params)
                    }
                </BorderModalForm>
            </div>
            :
            <Outlet />
    )
}
export default Model;