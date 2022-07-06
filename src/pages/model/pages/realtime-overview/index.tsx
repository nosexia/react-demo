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
import classnames from 'classnames'
// 边对应的背景颜色
const EdgeColor = {
  [EdgeType.STREET]: "red",
  [EdgeType.RESIDENT]: "green",
  [EdgeType.WORKSPACE]: "blue",
  [EdgeType.CROSS]: "yellow"
};
const staticData = {
  scriptId: 1,
  simulationStatus: 1,
  timeStamp: 1657075334,
  info: [{
      ALT: 0,
      FUEL: 80,
      HIGHLIGHT: 1,
      HP: 100,
      LAT: "48°48'",
      LNG: "45°45'",
      NAME: "FW_AI_0",
      PITCH: 0,
      PX: 1335,
      PY: 683,
      PZ: 797,
      ROLL: 0,
      YAW: 100,
      type: "FW_AI"         
  },{
      ALT: 0,
      FUEL: -1,
      HIGHLIGHT: false,
      HP: -1,
      LAT: 0,
      LNG: 0,
      NAME: "FW_AI_1",
      PITCH: 0,
      PX: 1694,
      PY: 699,
      PZ: 3477,
      ROLL: 0,
      YAW: 0,
      type: "FW_AI"
  },{
      ALT: 0,
      FUEL: -1,
      HIGHLIGHT: false,
      HP: -1,
      LAT: 0,
      LNG: 0,
      NAME: "FW_AI_2",
      PITCH: 0,
      PX: 947,
      PY: 531,
      PZ: 2266,
      ROLL: 0,
      YAW: 0,
      type: "FW_AI"
  },{
      ALT: 0,
      FUEL: -1,
      HIGHLIGHT: false,
      HP: -1,
      LAT: 0,
      LNG: 0,
      NAME: "UAV_0",
      PITCH: 0,
      PX: 1489,
      PY: 796,
      PZ: 2901,
      ROLL: 0,
      YAW: 0,
      type: "UAV"
  },{
      ALT: 0,
      FUEL: -1,
      HIGHLIGHT: false,
      HP: -1,
      LAT: 0,
      LNG: 0,
      NAME: "UAV_1",
      PITCH: 0,
      PX: 1731,
      PY: 237,
      PZ: 668,
      ROLL: 0,
      YAW: 0,
      type: "UAV"        
  },{
      ALT: 0,
      FUEL: -1,
      HIGHLIGHT: false,
      HP: -1,
      LAT: 0,
      LNG: 0,
      NAME: "UAV_2",
      PITCH: 0,
      PX: 1387,
      PY: 548,
      PZ: 4887,
      ROLL: 0,
      YAW: 0,
      type: "UAV"
  },{
      ALT: 0,
      FUEL: -1,
      HIGHLIGHT: false,
      HP: -1,
      LAT: 0,
      LNG: 0,
      NAME: "UAV_3",
      PITCH: 0,
      PX: 266,
      PY: 638,
      PZ: 586,
      ROLL: 0,
      YAW: 0,
      type: "UAV"
  },{
      ALT: 0,
      DESTROYED: false,
      DIST: 0,
      DISTURB: false,
      FUEL: -1,
      HIGHLIGHT: false,
      HP: -1,
      LAT: 0,
      LNG: 0,
      NAME: "BS_AI_0",
      PITCH: 0,
      PX: 1667,
      PY: 50,
      PZ: 2544,
      ROLL: 0,
      YAW: 0,
      type: "BS_AI"
  },{
      ALT: 0,
      DESTROYED: false,
      DIST: 0,
      DISTURB: false,
      FUEL: -1,
      HIGHLIGHT: false,
      HP: -1,
      LAT: 0,
      LNG: 0,
      NAME: "BS_AI_1",
      PITCH: 0,
      PX: 1419,
      PY: 350,
      PZ: 4740,
      ROLL: 0,
      YAW: 0,
      type: "BS_AI" 
  },{
      ALT: 0,
      HIGHLIGHT: false,
      LAT: 0,
      LNG: 0,
      NAME: "RS_AI_0",
      PITCH: 0,
      PX: 1067,
      PY: 489,
      PZ: 4612,
      ROLL: 0,
      YAW: 0,
      type: "RS_AI"
  },{
      ALT: 0,
      ATK: 0,
      DESTORYED: false,
      FUEL: 0,
      HIGHLIGHT: false,
      HP: 0,
      LAT: 0,
      LNG: 0,
      MP: 0,
      NAME: "TKL_AI_0",
      PITCH: 0,
      PX: 1467,
      PY: 717,
      PZ: 953,
      ROLL: 0,
      YAW: 0,
      type: "TKL_AI"
  },{
      ALT: 0,
      ATK: 0,
      DESTORYED: false,
      FUEL: 0,
      HIGHLIGHT: false,
      HP: 0,
      LAT: 0,
      LNG: 0,
      MP: 0,
      NAME: "TKL_AI_1",
      PITCH: 0,
      PX: 1456,
      PY: 172,
      PZ: 3777,
      ROLL: 0,
      YAW: 0,
      type: "TKL_AI"
  },{
      ALT: 0,
      LAT: 0,
      LNG: 0,
      NAME: "CameraActor_0",
      PITCH: 0,
      PX: 1660,
      PY: 681,
      PZ: 1079,
      ROLL: 0,
      YAW: 0,
      type: "CameraActor"
  },{
      ALT: 0,
      LAT: 0,
      LNG: 0,
      NAME: "CameraActor_1",
      PITCH: 0,
      PX: 475,
      PY: 193,
      PZ: 2395,
      ROLL: 0,
      YAW: 0,
      type: "CameraActor"        
  }]
}

const wurenjiGroupInfo = staticData.info.filter(item => item.type === 'FW_AI')


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
  const [id, taskId] = useMemo(() => {
    const params = parseParams(location.search);
    return [params.id, params.taskId];
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
      // client.subscribe(
      //   "ryh_test_" + id,
      //   err => err && console.log("subscribe error:", err)
      // );
      client.subscribe('SimEng_dynamicInfo_' + taskId, err => {
        console.log('error', err)
      })
    });

    const handleSimEngDynamicInfo =(message) => {
      const res = JSON.parse(
        pako.inflate(message, { to: "string" })
      ) as DynamicInfo;
      console.log('res', res)
      setDynamicInfo(res);
    }


    client.on("message", (topic, message) => {
      console.log('topic', topic)
      if(topic === `SimEng_dynamicInfo_${taskId}`) {
        handleSimEngDynamicInfo(message)
      }
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    getStaticInfo(id);
    getDynamicInfo(id);
  }, [id, getStaticInfo, getDynamicInfo]);

  // 所以无人机组的经度列表
  const [LNGList, setLNGList] = useState<string[]>(["0°'", "0°'", "0°'"])
  const [LATList, setLATList] = useState<string[]>(["0°'", "0°'", "0°'"])
  const [HPList, setHPList] = useState<string[]>(['0', '0', '0'])
  const [FUELList, setFUELList] = useState<string[]>(['0', '0', '0'])
  const [YAWList, setYAWList] = useState<string[]>(['0', '0', '0'])
  const [highLightList, setHighLightList] = useState<number[]>([0, 0, 0])
  // 获取无人机的位置
  const handlePositionWurenjiGroup = () => {
    const wurenjiGroup = document.querySelectorAll('[data-name="wurenjiGroup"]')
    wurenjiGroup.forEach((node, index) => {
      node.style.left = wurenjiGroupInfo[index].PX + 'px'
      node.style.top = wurenjiGroupInfo[index].PY + 'px'
      node.style.position = 'absolute'
    })
  }

  // 设置固定翼无人机的经度
  const handleLNGWurenjiGroup = () => {
    const LNGListMap = wurenjiGroupInfo.map(item => String(item.LNG))
    setLNGList(LNGListMap)
  }

  // 设置固定翼无人机的纬度
  const handleLATWurenjiGroup = () => {
    const LATListMap = wurenjiGroupInfo.map(item => String(item.LAT))
    setLATList(LATListMap)
  }

  // 设置固定翼无人机的生命值
  const handleHPWurenjiGroup = () => {
    const HPListMap = wurenjiGroupInfo.map(item => String(Number(item.HP)*1.04))
    setHPList(HPListMap)
  }

  // 设置固定翼无人机的油量
  const handleFUELWurenjiGroup = () => {
    const FUELListMap = wurenjiGroupInfo.map(item => String(Number(item.FUEL)*1.04))
    setFUELList(FUELListMap)
  }

  // 设置固定翼无人机的机头方向
  const handleYAWWurenjiGroup = () => {
    const YAWListMap = wurenjiGroupInfo.map(item => String(item.YAW))
    setYAWList(YAWListMap)
  }

  // 固定翼无人机是否正在执行任务
  const handleHighLightWurenjiGroup = () => {
    const highLightListMap = wurenjiGroupInfo.map(item => Number(item.HIGHLIGHT))
    setHighLightList(highLightListMap)
  }

  // 更改root的宽高
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.height = "100vh";
      root.style.width = "100vw";
    }
    
    // 当res变化时候
    setTimeout(() => {
      handlePositionWurenjiGroup()
      handleLNGWurenjiGroup()
      handleLATWurenjiGroup()
      handleHPWurenjiGroup()
      handleFUELWurenjiGroup()
      handleYAWWurenjiGroup()
      handleHighLightWurenjiGroup()
    }, 1000)

  }, []);

  if (!staticInfo) return <></>;
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url('${staticInfo.backgroundUrl}')` }}
    >
      {/* <canvas className={styles.canvas} ref={ref} height={1080} width={1920} />; */}
      {dynamicInfo?.veh?.map(item => (
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
          LNG={'0'}
          LAT={'0'}
          styles={{ marginTop: "23px" }}
        />
      </div>
      <div className={styles.wurenjiGroup} data-name="wurenjiGroup">
        <div className={classnames(styles.wurenjiIcon,{
          [styles.highLight]: highLightList[0]
        })} style={{transform: `rotate(${YAWList[0]}deg)`}}>固定翼无人机</div>
        <Electric 
          liveValue={HPList[0] + "px"} 
          oilValue={FUELList[0] + "px"} 
          LNG={LNGList[0]}
          LAT={LATList[0]}
        />
      </div>

      <div className={styles.wurenjiGroup} data-name="wurenjiGroup">
        <div className={classnames(styles.wurenjiIcon,{
          [styles.highLight]: highLightList[1]
        })}  style={{transform: `rotate(${YAWList[1]}deg)`}}>固定翼无人机</div>
        <Electric 
          liveValue={HPList[1] + "px"} 
          oilValue={FUELList[1] + "px"}
          LNG={LNGList[1]}
          LAT={LATList[1]}
        />
      </div>


      <div className={styles.wurenjiGroup} data-name="wurenjiGroup">
        <div className={classnames(styles.wurenjiIcon,{
          [styles.highLight]: highLightList[2]
        })}  style={{transform: `rotate(${YAWList[2]}deg)`}}>固定翼无人机</div>
        <Electric 
          liveValue={HPList[2] + "px"} 
          oilValue={FUELList[2] + "px"} 
          LNG={LNGList[2]}
          LAT={LATList[2]}
        />
      </div>

      <div className={styles.jianlietingGroup}>
        <div className={styles.jianlietingIcon}></div>
        <Electric 
          liveValue={"20px"} 
          oilValue={"30px"}
          LNG={'0'}
          LAT={'0'} />
      </div>

      <div className={styles.weizhuangjianlietingGroup}>
        <div className={styles.weizhuangjianlietingIcon}></div>
        <Electric 
          liveValue={"20px"} 
          oilValue={"30px"}           
          LNG={'0'}
          LAT={'0'} 
        />
      </div>
    </div>
  );
};

export default RealtimeOverview;
