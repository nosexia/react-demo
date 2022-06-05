import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import styles from "./index.module.less";
import { axios } from '@/api/request';
import { parseParams } from "@utils/utils";
import { DynamicInfo, EdgeType, StaticInfo } from "./type";
import mqtt from 'mqtt/dist/mqtt';
import pako from 'pako';

// 边对应的背景颜色
const EdgeColor = {
  [EdgeType.STREET]: 'red',
  [EdgeType.RESIDENT]: 'green',
  [EdgeType.WORKSPACE]: 'blue',
  [EdgeType.CROSS]: 'yellow'
}

// 请求静态数据的url
const getStaticInfoUrl = "http://101.6.143.8:65515/sim/staticinfo/";

// mqtt的相关信息
const mqttUrl = 'ws://39.107.153.245:36002/mqtt';
const mqttOptions = {
  username: "mnfz",
  password: "mnfz000"
}

const RealtimeOverview = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [staticInfo, setStaticInfo] = useState<StaticInfo>();
  const [dynamicInfo, setDynamicInfo] = useState<DynamicInfo>();
  const id = useMemo(() => {
    const params = parseParams(location.search)
    return params.id;
  }, [location]);

  // 获取静态数据
  const getStaticInfo = useCallback(async (idx: string) => {
    const res: any = await axios.get(`${getStaticInfoUrl}?scenarioIdx=${idx}`);
    if (res && res.code === 200) setStaticInfo(res.data);
  }, []);

  // 获取动态数据
  const getDynamicInfo = useCallback(async (id: string) => {
    const client = mqtt.connect(mqttUrl, mqttOptions);
    client.on('connect', () => {
        client.subscribe('ryh_test_' + id, (err) => err && console.log('subscribe error:', err ));
    })

    client.on('message', (topic, message) => {
        const res = JSON.parse(pako.inflate(message, { to: 'string' })) as DynamicInfo;
        setDynamicInfo(res);
    })
  }, []);

  useEffect(() => {
    if (!id) return;
    getStaticInfo(id);
    getDynamicInfo(id);
  }, [id, getStaticInfo, getDynamicInfo]);

  // 更改root的宽高
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.style.height = '100vh';
      root.style.width = '100vw';
    };
  }, []);

  // // 画背景
  // useEffect(() => {
  //   if (!ref.current || !staticInfo) return;
  //   const ctx = ref.current.getContext('2d');
  //   if (!ctx) return;
  //   const edges = staticInfo.edges;
  //   for (const edge of edges) {
  //     const edgePoints = edge.points;
  //     ctx.beginPath();
  //     ctx.moveTo(edgePoints[0][1], edgePoints[0][0]);
  //     for (let i = 1; i < edgePoints.length; i++) {
  //       ctx.lineTo(edgePoints[i][1], edgePoints[i][0]);
  //     }
  //     ctx.closePath();
  //     ctx.fillStyle = EdgeColor[edge.type];
  //     ctx.fill();
  //   }
  // }, [ref, staticInfo]);

  // 画动态物体
  useEffect(() => {
    if (!ref.current || !dynamicInfo) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.fillStyle = 'red';
    for (const item of dynamicInfo.veh) {
      ctx.beginPath();
      ctx.rect(item.pos[1] - 10, item.pos[0] - 10, 20, 20);
      ctx.fill();
    }
  }, [ref, dynamicInfo]);
  if (!staticInfo) return <></>;
  return <canvas className={styles.container} ref={ref} height={1080} width={1920} style={{ backgroundImage: `url('${staticInfo.backgroundUrl}')` }} />;
}

export default RealtimeOverview;