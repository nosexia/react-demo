import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback
} from "react";
import styles from "./index.module.less";
import { axios } from "@/api/request";
import { parseParams } from "@utils/utils";
import { DynamicInfo, EdgeType, StaticInfo } from "./type";
import mqtt from "mqtt/dist/mqtt";
import pako from "pako";
import Electric from "@/components/electric";
// 边对应的背景颜色
const EdgeColor = {
  [EdgeType.STREET]: "red",
  [EdgeType.RESIDENT]: "green",
  [EdgeType.WORKSPACE]: "blue",
  [EdgeType.CROSS]: "yellow"
};

// 请求静态数据的url
const getStaticInfoUrl = "http://101.6.143.8:65515/sim/staticinfo/";

// mqtt的相关信息
const mqttUrl = "ws://39.107.153.245:36002/mqtt";
const mqttOptions = {
  username: "mnfz",
  password: "mnfz000"
};

const RealtimeOverview = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [staticInfo, setStaticInfo] = useState<StaticInfo>();
  const [dynamicInfo, setDynamicInfo] = useState<DynamicInfo>();
  const id = useMemo(() => {
    const params = parseParams(location.search);
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
    client.on("connect", () => {
      console.log('connect')
      client.subscribe(
        "ryh_test_" + id,
        err => err && console.log("subscribe error:", err)
      );
    });

    client.on("message", (topic, message) => {
      const res = JSON.parse(
        pako.inflate(message, { to: "string" })
      ) as DynamicInfo;
      console.log('res', res)
      setDynamicInfo(res);
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    getStaticInfo(id);
    getDynamicInfo(id);
  }, [id, getStaticInfo, getDynamicInfo]);

  // 更改root的宽高
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.height = "100vh";
      root.style.width = "100vw";
    }
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

  // // 画动态物体
  // useEffect(() => {
  //   if (!ref.current || !dynamicInfo) return;
  //   const ctx = ref.current.getContext('2d');
  //   if (!ctx) return;
  //   ctx.clearRect(0, 0, 1920, 1080);
  //   ctx.fillStyle = 'red';
  //   for (const item of dynamicInfo.veh) {
  //     ctx.beginPath();
  //     ctx.rect(item.pos[1] - 10, item.pos[0] - 10, 20, 20);
  //     ctx.fill();
  //   }
  // }, [ref, dynamicInfo]);
  if (!staticInfo) return <></>;
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url('${staticInfo.backgroundUrl}')` }}
    >
      {/* <canvas className={styles.canvas} ref={ref} height={1080} width={1920} />; */}
      {dynamicInfo?.veh.map(item => (
        <div
          key={`${item.type}_${item.id}`}
          className={styles.veh}
          style={{
            top: `${(item.pos[0] * 100) / 1080}vh`,
            left: `${(item.pos[1] * 100) / 1920}vw`
          }}
        />
      ))}
      <div className={styles.sixuanyi} className={styles.sixuanyi} style={{position: 'absolute', top: '400px', left: '1400px'}}>
        <div className={styles.sixuanyiContent}>
          <img src={require('@/assets/images/sixuanyiIcon.png')} />
          <Electric oilValue={'40px'} liveValue={'50px'} styles={{marginLeft: '0'}} />
        </div>
      </div>


      <div className={styles.sixuanyi} style={{position: 'absolute', top: '200px', left: '1200px'}}>
        <div className={styles.sixuanyiContent}>
          <img src={require('@/assets/images/sixuanyiIcon.png')} />
          <Electric oilValue={'40px'} liveValue={'50px'} styles={{marginLeft: '0'}} />
        </div>
      </div>
      <div className={styles.legendWrapper}>
        <div className={styles.leftLegend}>
          <div className={styles.leftLegendLabel}>
            <p>无人车</p>
            <p>小型四旋翼</p>
            <p>固定翼无人机</p>
            <p>坦克</p>
            <p>舰船</p>
            <p>战列舰</p>
            <p>伪装战列舰</p>
          </div>

          <div className={styles.leftLegendIcon}>
            <p className={styles.wurencheIcon}></p>
            <p className={styles.sixuanyiIcon}></p>
            <p className={styles.gudingyiIcon}></p>
            <p className={styles.tankeIcon}></p>
            <p className={styles.jianchuanIcon}></p>
            <p className={styles.zhanliejianIcon}></p>
            <p className={styles.weizhuangzhanliejianIcon}></p>
          </div>
        </div>

        <div className={styles.rightLegend}>
          <div className={styles.dawuIcon}>
            <p>大雾天气</p>
          </div>

          <div className={styles.fengxiangIcon}>
            <p>东南风 六级</p>
          </div>
        </div>
      </div>

      <div className={styles.statusWrapper}>
        <p>战斗进度</p>
        <p>空中侦察</p>
      </div>

      <div className={styles.relativeInfoWrapper}>
        <div className={styles.relativeInfoTop}>
          <div className={styles.relativeInfoBottom}>
            <div className={styles.relativeInfoContent}>
              <h5>场景相关信息</h5>
              <div className={styles.relativeDetail}>
                <p><span>敌方坦克数量</span>2</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.specialInfoWrapper}>
        <p>特殊信息</p>
        <p>发现目标建筑 发现武装力量</p>
      </div>

      <p className={styles.dateWrapper}>2022-06-13 00:06:50:55</p>

      <div className={styles.jianchuanGroup}>
        <div className={styles.jianchuanWrapper}>
          <p className={styles.jianchuanTop}></p>
          <div className={styles.jianchuanCenterWrapper}>
            <p className={styles.jianchuanCenterShuiwen}></p>
            <p className={styles.jianchuanCenter}></p>
          </div>
          <p className={styles.jianchuanBottom}></p>
        </div>
        <Electric
          liveValue={"20px"}
          oilValue={"30px"}
          styles={{ marginTop: "23px" }}
        />
      </div>

      <div className={styles.wurenjiGroup}>
        <div className={styles.wurenjiIcon}></div>
        <Electric liveValue={"20px"} oilValue={"30px"} />
      </div>

      <div className={styles.jianlietingGroup}>
        <div className={styles.jianlietingIcon}></div>
        <Electric liveValue={"20px"} oilValue={"30px"} />
      </div>

      <div className={styles.weizhuangjianlietingGroup}>
        <div className={styles.weizhuangjianlietingIcon}></div>
        <Electric liveValue={"20px"} oilValue={"30px"} />
      </div>
    </div>
  );
};

export default RealtimeOverview;
