import React, { useRef, useEffect, FC } from 'react'
import { Button, Card, Col, Row } from 'antd';
import titleSvg, { ReactComponent as TitleSVG } from './assets/svg-icons/svg-title.svg';
import styles from "./index.module.less";
import { Link, useNavigate } from 'react-router-dom';
import { useGetCardList } from '@/api/home';
import BorderBox from '@components/border-box';
import img1 from './assets/img1.png'
import img2 from './assets/img2.png'
const { Meta } = Card;

// import ParticlesBg from 'particles-bg'

const BG = [
    "color",
    "ball",
    "lines",
    "thick",
    "circle",
    "cobweb",
    "polygon",
    "square",
    "tadpole",
    "fountain",
    "random",
    "custom",
]

// const getBgRamda = () => BG[Math.ceil(Math.random()*12)]

const Home: FC = () => {
    // let { error, data } = useGetCardList();
    const navigator = useNavigate();

    //如果数据存在渲染数据
    //如果数据为空渲染空页面
    //如果请求错误，渲染错误页面
    useEffect(() => {

    }, [])

    // console.log(data)
    return (
        <>
            {/* <ParticlesBg type={getBgRamda() as any} bg={{
                position: "absolute",
                zIndex: 1,
            }} /> */}
            <div className={styles.contentWrap}>

                <BorderBox style={{ width: 490, height: 380, marginRight: 50 }}>
                    <div className={styles.cardContentText}>
                        <div className={styles.cardContentHeader}>
                            <span>智慧园区复杂体系</span>
                            <Button type="primary" onClick={() => navigator(`/sample?name=智慧园区复杂体系`)}>了解详情</Button>
                        </div>
                        <div className={styles.cardContentP}>
                            随着信息技术和传感器网络的发展，无处不在的传感器为智慧园区提供了基础。
                            在智慧园区复杂体系中，以安全生产、环境保护、交通运转为目标，
                            从智能复杂体系的角度出发，整合园区内安防系统、物流系统、环保系统、地理信息系统产生的数据，
                            实现园区的实时危险态势感知、空气质量预测、交通流量预测，提供智慧园区解决方案。
                        </div>
                    </div>
                    <img className={styles.cardContentImg} src={img2} alt="img" />
                </BorderBox>
                <BorderBox style={{ width: 490, height: 380 }}>
                    <div className={styles.cardContentText}>
                        <div className={styles.cardContentHeader}>
                            <span>智慧城市复杂体系</span>
                            <Button type="primary" onClick={() => navigator(`/sample?name=智慧城市复杂体系`)}>了解详情</Button>
                        </div>
                        <div className={styles.cardContentP}>
                            城市中的自然灾害、事故灾难等突发事件，往往会造成巨大的损失和伤害。
                            大数据、人工智能、机器学习等新技术，在事前预防、事发应对、
                            事中处置和善后恢复等方面可以发挥重要作用。站在智慧城市复杂体系的视角，
                            实现物理系统、社会系统和信息系统的智能组合与协同运转，提供多维度、快速化、智能化的智慧应急。
                        </div>
                    </div>
                    <img className={styles.cardContentImg} src={img1} alt="img" />
                </BorderBox>
                {/* {
                    Array.isArray(data) && data.map((list: any) =>
                        <div key={list.title} className={styles.rowWrap}>
                            <div className={styles.rowTitle}>
                                <span>{list.title}<span>数据{list.count}项</span></span>
                                <span className={styles.href} onClick={() => navigator(list.href)}>全部</span>
                            </div>
                            <Row wrap style={{ flex: 1 }} gutter={10}>
                                {
                                    list.content.map((item: any) =>
                                        <Col key={item.title} xxl={6} xl={6} lg={12} md={12} sm={12} xs={24}>
                                            <Card
                                                onClick={() => navigator(`${list.href}/${item.id}`)}
                                                key={item.title}
                                                hoverable
                                            >
                                                <img style={{ width: 100, height: 100 }} src={titleSvg as unknown as string} />
                                                <span className={styles.title}>{item.title}</span>
                                            </Card>
                                        </Col>
                                    )
                                }
                            </Row>
                        </div>
                    )
                } */}
            </div>
        </>

    )
}

export default Home;