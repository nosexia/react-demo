import { parseParams } from '@utils/utils';
import { Button, Tabs } from 'antd';
import React, { FC, useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.less";
import headerbg from './assets/headerbg.png';
import { LeftCircleOutlined,CaretRightOutlined } from '@ant-design/icons';
import cardHeader from './assets/cardHeader.png';
import BorderBox from '@components/border-box';
import classnames from 'classnames';
import yqSceneMap from './assets/yq-scene-map.png';
import csSceneMap from './assets/cs-scene-map.png'
const { TabPane } = Tabs;

const staticText: any = {
    "智慧园区复杂体系": {
        title: "智慧园区复杂体系",
        titleEn: "SMART PARK",
        modalScene: '<p>工业园区是天然的多系统场景，无处不在的传感器使其每时每刻都在产生海量的数据，为智慧园区提供了基础。因此，工业园区是智能复杂体系重要的实践领域。智慧园区场景建模聚焦于3个体系能力，包括园区危险态势感知能力、细粒度空气质量预测能力和交通流量预测能力。</p>'
            + '<p>空气质量预测串联了环保、交通、气象和地理信息等系统。场景模拟使用了体系多源异构数据融合的方法，利用有限的空气质量监测站和其他各系统的数据，利用半监督协同训练的方法完成细粒度的空气质量预测。</p>'
            + '<p>园区场景中，生产、储存和运输的危险品种类繁杂，数量众多。近年来发生的多起严重的园区爆炸事故造成了巨大的损失。场景模拟整合了安防、交通、地理信息等系统产生的数据，使用多系统交互的危险识别方法，实现园区的危险态势感知。</p>'
            + ' <p>智能交通是园区的重要构成，园区内人员、车辆、道路等组成复杂、数量较多，园区交通面临较大考验。场景模拟对交通要素进行了分类设计，并按照园区的实际工作时间对速度、密度进行模拟，使用神经网络等算法，对交通流量进行了实时预测。</p>',
        sceneData: `<p>1.	工厂相关数据：主要为工厂分布情况、当前工人数量、输入材料数量以及当前产品堆积量。数据特点：“工厂工人数量”、“输入材料数量”以及“当前产品堆积量”值有上限且最小为0。</p>
        <p>2.	居民区相关数据：主要为居民楼位置分布以及当前人员数量。数据特点：起点终点随机，非周期性，“当前人员数量”值有上限且最小为0。</p>
        <p>3.	人员相关数据：主要为位置信息、区域交通密度、速度。数据特点：起点终点随机，非周期性，“区域交通密度”、“速度”值有上限且最小为0。</p>
        <p>4.	车辆轨迹数据：主要为位置信息、区域交通密度、速度、载货量、出入口坐标。数据特点：起点终点随机，非周期性，“区域交通密度”、“速度”、“载货量”值有上限且最小为0。</p>
        <p>5.	道路场景地图：主要为道路长度、区域面积。数据特点：固定值</p>
        <p>6.	气象学数据：主要为风速、强度、风向。数据特点：非周期性。</p>
        <p>7.	空气质量监测站：主要为传感器数据，监测大气污染物。数据特点：非周期性，超过阈值会出现异常值。</p>
        <p>8.	危险品数据：主要为传感器数据，监测工厂生产产生的污染物。数据特点：非周期性，超过阈值会出现异常值。</p>
        `,
        sceneArithmetic: `
        <p>1.	空气质量检测算法：
        Co-Training框架，基于多层感知器MLP算法与CRF算法分别构建SC模型和TC模型。
        Tri-training框架，基于多层感知器MLP算法构建三个分类器，最终由三个分类器投票决定预测结果。</p>
        <p>2.	危险区域识别算法：
        根据危险品传感器实测数据，结合其地理位置计算传感器权重；根据危险品运输车轨迹计算其权重；两种权重分别代表贮藏危险品和移动危险品影响因子。在危险区域识别层，结合传感器权重和危险品运输车权重，利用马氏距离计算度量两个权重大小，从而判断出某一时间段内的潜在危险区域。 </p>
        <p>3.	智慧交通预测算法：
        基于单隐含层构建BP神经网络模型，预测交通拥堵情况；基于LSTM模型，预测出人流量变化；基于SVR算法、ARIMA算法、ASTGCN算法预测车流量。</p>
        `,
        description: `
        随着信息技术和传感器网络的发展，无处不在的传感器为智慧园区提供了基础。
        在智慧园区复杂体系中，以安全生产、环境保护、交通运转为目标，
        从智能复杂体系的角度出发，整合园区内安防系统、物流系统、环保系统、地理信息系统产生的数据，
        实现园区的实时危险态势感知、空气质量预测、交通流量预测，提供智慧园区解决方案。
        `,
        sceneMap: yqSceneMap
    },
    "智慧城市复杂体系": {
        title: "智慧城市复杂体系",
        titleEn: "SMART CITY",
        modalScene: `<p>在城市发展中，城市安全与应急管理是极为重要的一环。全面提高应急能力，构建全方位、立体化的公共安全体系，实现更高水平的平安城市，是城市与社会发展的重大需求。随着人工智能技术的进步，智慧城市下的灾害事故应急也向智慧化不断迈进，物联网、5G、大数据、AI等技术给智慧应急带来了新的机遇。</p>
        <p>智慧应急场景建模设定发生在智慧城市中，范围为5km*5km，模拟了不同时段，不同气象和交通状况下，多种烈度的恐怖袭击事件，并对恐怖袭击发生后的区域失明、信息滞后、智能体混乱、建筑物与道路被破坏等情况进行了仿真模拟。</p>
        <p>模拟场景中，恐袭发生时，恐怖分子将携带不同攻击力的武器对城市的智能体和设施进行破坏，交通系统被破坏，智能体面临不同程度的失效，传感器和网络的态势感知能力降低。同时，城市内的安防、医疗、救援等系统得到调度，完成对恐袭的反击、对人员的救护、对车辆、建筑、道路及其他设施的维修。
        在此场景和过程中，利用人工智能技术，解决复杂气象、交通、透明度模糊的态势感知等条件下的实时应急疏散方案制定和对恐袭的反击行动规划调度方案制定，完成算法的开发与验证工作。</p>
        `,
        sceneData: `暂无`,
        sceneArithmetic: `<p>1.	辅助针对复杂气象/交通条件，半透明/不透明场景态势感知条件下的实时应急疏散方案制定算法。随着经济的快速发展，复杂性多功能性的建筑物越来越多，尤其是大型商场等超规格的建筑物，由于具有人员众多、楼宇林立、道路密布等特点，当发生危险时，常常会使逃生人群在惊慌中迷茫，因此实时指导人员应急疏散显得尤为重要。本算法可以根据当前感知到的态势，实时制定疏散方案，指导人员快速且正确地疏散逃生。</p>
        <p>2.	辅助针对复杂气象/交通条件，半透明/不透明场景态势感知条件下，针对暴恐行动的反击规划调度算法。暴恐行动往往发生突然，在其影响下的场景态势复杂多变，我方的后勤保障行动将难以预先准备，因此需要结合当前需求的快速变化即时做出反应，及时满足保障需求。本算法可以根据当前态势，灵活智能地调度全域后勤保障资源，以分散的后勤保障力量满足各“点战场”的保障需求。</p>
        `,
        description: `  城市中的自然灾害、事故灾难等突发事件，往往会造成巨大的损失和伤害。
        大数据、人工智能、机器学习等新技术，在事前预防、事发应对、
        事中处置和善后恢复等方面可以发挥重要作用。站在智慧城市复杂体系的视角，
        实现物理系统、社会系统和信息系统的智能组合与协同运转，提供多维度、快速化、智能化的智慧应急。`,
        sceneMap: csSceneMap
    }
}
const Sample: FC = () => {
    const location = useLocation();
    const navigator = useNavigate();
    const name = useMemo(() => {
        let params = parseParams(location.search)
        return decodeURI(params.name)
    }, [location]);

    const navigate = useNavigate();


    function handleJump(url: string) {
        navigate(url)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.titleEn}>{staticText[name].titleEn}</span>
                <span className={styles.title}>{name}</span>
                <p className={styles.contextText}>{staticText[name].description}</p>
                <Button onClick={() => navigator('/home')} icon={<LeftCircleOutlined />} style={{ width: 100 }} type="primary">返回</Button>
            </div>
            <div className={classnames(styles.contentWrap, 'tabs-wrap')}>

                <Tabs defaultActiveKey="1" centered>
                    <TabPane tab="场景模型" key="1">
                        <BorderBox>
                            <img className={styles.cardHeaderImg} src={cardHeader} alt="header" />
                            <div className={styles.context}>
                                <span className={styles.cardTitle}>场景模型详情介绍
                                    <Button type="primary" className={styles.jumpBtn} onClick={() => handleJump(`/model?id=${name==="智慧园区复杂体系"  ? 1 : 2}`)} >点击进入<CaretRightOutlined style={{color:'#7ed0f5;'}}/></Button>
                                </span>
                                <p dangerouslySetInnerHTML={{ __html: staticText[name].modalScene }}></p>
                            </div>
                        </BorderBox>
                    </TabPane>
                    <TabPane tab="场景数据" key="2">
                        <BorderBox>
                            <img className={styles.cardHeaderImg} src={cardHeader} alt="header" />
                            <div className={styles.context}>
                                <span className={styles.cardTitle}>场景数据详情介绍
                                    <Button type="primary"  className={styles.jumpBtn} onClick={() => handleJump(`/data/list`)} >点击进入<CaretRightOutlined style={{color:'#7ed0f5;'}}/></Button>
                                </span>
                                <p dangerouslySetInnerHTML={{ __html: staticText[name].sceneData }}></p>
                            </div>
                        </BorderBox>
                    </TabPane>
                    <TabPane tab="场景算法" key="3">
                        <BorderBox>
                            <img className={styles.cardHeaderImg} src={cardHeader} alt="header" />
                            <div className={styles.context}>
                                <span className={styles.cardTitle}>场景算法详情介绍
                                <Button type="primary" className={styles.jumpBtn} onClick={() => handleJump(`/arithmetic/list`)} >点击进入<CaretRightOutlined style={{color:'#7ed0f5;'}}/></Button>
                                </span>
                                <p dangerouslySetInnerHTML={{ __html: staticText[name].sceneArithmetic }}></p>
                            </div>
                        </BorderBox>
                    </TabPane>
                    <TabPane tab="场景地图" key="4">
                        <BorderBox>
                            <img className={styles.cardHeaderImg} src={cardHeader} alt="header" />
                            <div className={styles.context}>
                                <span className={styles.cardTitle}>场景地图详情介绍</span>
                                <img src={staticText[name].sceneMap} alt="map" style={{ width: '100%' }} />
                            </div>
                        </BorderBox>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}
export default Sample;