import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import styles from "./index.module.less";
import { axios } from '@/api/request';
import { parseParams } from "@utils/utils";

export enum EdgeType {
  RESIDENT = 'resident',
  WORKSPACE = 'workSpace',
  STREET = 'street',
  CROSS = 'cross',
}

const getStaticInfoUrl = "http://101.6.143.8:65515/sim/staticinfo/";

export type StaticInfo = {
  scenarioIdx: number;
  edges: {
      type: EdgeType;
      id: number;
      points: number[][];
  }[];
  backgroundUrl: string;
};

const EdgeColor = {
  [EdgeType.STREET]: 'red',
  [EdgeType.RESIDENT]: 'green',
  [EdgeType.WORKSPACE]: 'blue',
  [EdgeType.CROSS]: 'yellow'
}

const RealtimeOverview = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [staticInfo, setStaticInfo] = useState<StaticInfo>();
  const id = useMemo(() => {
    const params = parseParams(location.search)
    return params.id;
  }, [location]);

  // 获取静态数据
  const getStaticInfo = useCallback(async (idx: string) => {
    if (!idx) return;
    const res: any = await axios.get(`${getStaticInfoUrl}?scenarioIdx=${idx}`);
    if (res && res.code === 200) setStaticInfo(res.data);
  }, []);
  useEffect(() => void getStaticInfo(id), []);
  
  // 更改root的宽高
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.style.height = '100vh';
      root.style.width = '100vw';
    };
  }, []);
  
  // 画背景
  useEffect(() => {
    if (!ref.current || !staticInfo) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const edges = staticInfo.edges;
    for (const edge of edges) {
      const edgePoints = edge.points;
      ctx.beginPath();
      ctx.moveTo(edgePoints[0][1], edgePoints[0][0]);
      for (let i = 1; i < edgePoints.length; i++) {
        ctx.lineTo(edgePoints[i][1], edgePoints[i][0]);
      }
      ctx.closePath();
      ctx.fillStyle = EdgeColor[edge.type];
      ctx.fill();
    }
  }, [ref, staticInfo]);
  if (!staticInfo) return <></>;
  return <canvas className={styles.container} ref={ref} height={1080} width={1920} style={{ backgroundImage: `url('${staticInfo.backgroundUrl}')`}}/>;
}

export default RealtimeOverview;