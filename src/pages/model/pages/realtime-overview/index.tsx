import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback
} from "react";
import styles from "./index.module.less";
import s2 from '@/components/electric/index.module.less'
import { axios } from "@/api/request";
import { parseParams } from "@utils/utils";
import { EdgeType, StaticInfo } from "./type";
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

const dynamic =  {
  scriptId: 1,
  simulationStatus: 1,
  timeStamp: 1657075334,
  info: [{
      ALT: 0,
      FUEL: -1,
      HIGHLIGHT: false,
      HP: -1,
      LAT: 0,
      LNG: "45°45'",
      NAME: "FW_AI_0",
      PITCH: 0,
      PX: 1335,
      PY: 683,
      PZ: 797,
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

  // 
  const [staticInfo, setStaticInfo] = useState<StaticInfo>();
  const [dynamicInfo, setDynamicInfo] = useState<any[]>();
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
      );
      setDynamicInfo(res.info);
    }


    client.on("message", (topic, message) => {
      console.log('topic', topic)
      if(topic === `SimEng_dynamicInfo_${taskId}`) {
        handleSimEngDynamicInfo(message)
      }
    });
  }, []);

  // 红方智能体连接
  const renderConnectLine = () => {
    // 渲染之前将元素删除
    
    const redAgentList = dynamicInfo.filter(item => ['FW_AI', 'UAV'].includes(item.type)).map(item => ({
      PX: item.PX,
      PY: item.PY
    }))
    console.log('redAgentList', redAgentList)
    let redAgentListMap = []
    
    for(let i = 0; i < redAgentList.length; i++) {
        for(let j = i+1; j < redAgentList.length; j++) {
        const PXScale = Math.abs(redAgentList[i].PX - redAgentList[j].PX)
        const PYScale = Math.abs(redAgentList[i].PY - redAgentList[j].PY)
        const PX1 = redAgentList[i].PX
        const PX2 = redAgentList[j].PX

        const PY1 = redAgentList[i].PY
        const PY2 = redAgentList[j].PY
        // 角度是否需要反转
        const xConvertDeg = PX1 > PX2 ? 180 : 0
        let angle = 0
        // 判断第一个点和点二个的位置关系，point2在point1的右上角
        if(PY2 < PY1 && PX2 > PX1) {
          angle = 360 - Math.atan(PYScale/PXScale)*180/Math.PI
        }

        // 判断第一个点和点二个的位置关系，point2在point1的右下角
        if(PY2 > PY1 && PX2 > PX1) {
          angle = Math.atan(PYScale/PXScale)*180/Math.PI
        }

        // 判断第一个点和点二个的位置关系，point2在point1的左下角
        if(PY2 > PY1 && PX2 < PX1) {
          angle = 90 + Math.atan(PXScale/PYScale)*180/Math.PI
        }

        // 判断第一个点和点二个的位置关系，point2在point1的左上角
        if(PY2 < PY1 && PX2 < PX1) {
          angle = 180 + Math.atan(PYScale/ PXScale)*180/Math.PI
        }
        redAgentListMap.push({
            PX1,
            PX2,
            PXScale,
    
            PY1,
            PY2,
            PYScale,
    
            // 角度
            angle,
            // 斜边的长度
            PXY: Math.sqrt(PXScale*PXScale + PYScale*PYScale)
        })
      }
    }
    
    console.log('redAgentListMap', redAgentListMap)
    redAgentListMap = redAgentListMap.filter(item => Number(item.PXY) > 500)
    const body = document.querySelector('body')
    const redAgentlineList = document.querySelectorAll('.redAgentline')
    for(let i = 0; i < redAgentlineList.length; i++) {
      body.removeChild(redAgentlineList[i])
    }
    
    redAgentListMap.forEach(item => {
        const div = document.createElement('div')
        div.style.width = item.PXY + 'px'
        div.style.position = 'absolute'
        div.style.left = item.PX1 + 'px'
        div.style.top = item.PY1 + 'px'
        div.style.border = '5px dashed white'
        div.style.transform = `rotate(${item.angle}deg)`
        div.style.transformOrigin= 'top left'
        div.setAttribute('class', 'redAgentline')
        body.appendChild(div)
    })
  }
  useEffect(() => {
    if(!dynamicInfo) { return }
    renderConnectLine()
    const wurenjiGroupInfo = dynamicInfo.filter(item => item.type === 'FW_AI')
  
    const sixuanyiGroupInfo = dynamicInfo.filter(item => item.type === 'UAV')
  
    const zhanliejianGroupInfo = dynamicInfo.filter(item => item.type === 'BS_AI')
  
    const tankeGroupInfo = dynamicInfo.filter(item => item.type === 'TKL_AI')
    // 固定翼无人机的左边定位列表
    const handleLeftWurenjiGroup = () => {
      const leftListMap = wurenjiGroupInfo.map(item => Number(item.PX))
      setLeftList(leftListMap)
    }


    // 固定翼无人机的顶部定位列表
    const handleTopWurenjiGroup = () => {
      const topListMap = wurenjiGroupInfo.map(item => Number(item.PY))
      setTopList(topListMap)
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


    // 四旋翼无人机经度
    const handleLNGSixuanyiGroup = () => {
      const LNGListMap = sixuanyiGroupInfo.map(item => String(item.LNG))
      setSixuanyiLNGList(LNGListMap)
    }

    // 四旋翼无人机的纬度
    const handleLATSixuanyiGroup = () => {
      const LATListMap = sixuanyiGroupInfo.map(item => String(item.LAT))
      setSixuanyiLATList(LATListMap)
    }

    // 四旋翼无人机的左边定位列表
    const handleLeftSixuanyiGroup = () => {
      const leftListMap = sixuanyiGroupInfo.map(item => Number(item.PX))
      setSixuanyiLeftList(leftListMap)
    }

    // 四旋翼无人机的顶部定位列表
    const handleTopSixuanyiGroup = () => {
      const topListMap = sixuanyiGroupInfo.map(item => Number(item.PY))
      setSixuanyiTopList(topListMap)
    }

    // 设置四旋翼无人机的生命值
    const handleHPSixuanyiGroup = () => {
      const HPListMap = sixuanyiGroupInfo.map(item => String(Number(item.HP)*1.04))
      setSixuanyiHPList(HPListMap)
    }


    // 设置四旋翼无人机的油量
    const handleFUELSixuanyiGroup = () => {
      const FUELListMap = sixuanyiGroupInfo.map(item => String(Number(item.FUEL)*1.04))
      setSixuanyiFUELList(FUELListMap)
    }

    // 获取固定翼无人机是否正在执行任务
    const handleHighLightSixuanyiGroup = () => {
      const highLightListMap = sixuanyiGroupInfo.map(item => Number(item.HIGHLIGHT))
      setSixuanyiHighLightList(highLightListMap)
    }

    // 设置战列舰的左边定位列表
    const handleLeftZhanliejianGroup = () => {
      const leftListMap = zhanliejianGroupInfo.map(item => Number(item.PX))
      setZhanliejianLeftList(leftListMap)
    }

    // 设置战列舰的顶部定位列表
    const handleTopZhanliejianGroup = () => {
      const topListMap = zhanliejianGroupInfo.map(item => Number(item.PY))
      setZhanliejianTopList(topListMap)
    }

    // 战列舰无人机经度
    const handleLNGZhanliejianGroup = () => {
      const LNGListMap = zhanliejianGroupInfo.map(item => String(item.LNG))
      setZhanliejianLNGList(LNGListMap)
    }

    // 战列舰无人机的纬度
    const handleLATZhanliejianGroup = () => {
      const LATListMap = zhanliejianGroupInfo.map(item => String(item.LAT))
      setZhanliejianLATList(LATListMap)
    }

    // 设置战列舰的生命值
    const handleHPZhanliejianGroup = () => {
      const HPListMap = zhanliejianGroupInfo.map(item => String(Number(item.HP)*1.04))
      setZhanliejianHPList(HPListMap)
    }

      // 设置战列舰的油量
    const handleFUELZhanliejianGroup = () => {
      const FUELListMap = zhanliejianGroupInfo.map(item => String(Number(item.FUEL)*1.04))
      setZhanliejianFUELList(FUELListMap)
    }


    // 战列舰是否正在执行任务
    const handleHighLightZhanliejianGroup = () => {
      const highLightListMap = zhanliejianGroupInfo.map(item => Number(item.HIGHLIGHT))
      setZhanliejianiHighLightList(highLightListMap)
    }


    // 坦克经度
    const handleLNGTankeGroup = () => {
      const LNGListMap = tankeGroupInfo.map(item => String(item.LNG))
      setTankeLNGList(LNGListMap)
    }

    // 坦克的纬度
    const handleLATTankeGroup = () => {
      const LATListMap = tankeGroupInfo.map(item => String(item.LAT))
      setTankeLATList(LATListMap)
    }

    // 坦克的左边定位列表
    const handleLeftTankeGroup = () => {
      const leftListMap = tankeGroupInfo.map(item => Number(item.PX))
      setTankeLeftList(leftListMap)
    }

    // 坦克的顶部定位列表
    const handleTopTankeGroup = () => {
      const topListMap = tankeGroupInfo.map(item => Number(item.PY))
      setTankeTopList(topListMap)
    }

    // 设置坦克的生命值
    const handleHPTankeGroup = () => {
      const HPListMap = tankeGroupInfo.map(item => String(Number(item.HP)*1.04))
      setTankeHPList(HPListMap)
    }


    // 设置坦克的油量
    const handleFUELTankeGroup = () => {
      const FUELListMap = tankeGroupInfo.map(item => String(Number(item.FUEL)*1.04))
      setTankeFUELList(FUELListMap)
    }

    // 获取坦克是否正在执行任务
    const handleHighLightTankeGroup = () => {
      const highLightListMap = tankeGroupInfo.map(item => Number(item.HIGHLIGHT))
      setTankeHighLightList(highLightListMap)
    }


    // 当res变化时候
      handleLeftWurenjiGroup()
      handleTopWurenjiGroup()
      handleLNGWurenjiGroup()
      handleLATWurenjiGroup()
      handleHPWurenjiGroup()
      handleFUELWurenjiGroup()
      handleYAWWurenjiGroup()
      handleHighLightWurenjiGroup()


      /** 四炫翼无人机的操作 */
      handleLNGSixuanyiGroup()
      handleLeftSixuanyiGroup()
      handleTopSixuanyiGroup()
      handleLATSixuanyiGroup()
      handleHPSixuanyiGroup()
      handleFUELSixuanyiGroup()
      handleHighLightSixuanyiGroup()

      /** 战列舰 */
      handleLeftZhanliejianGroup()
      handleTopZhanliejianGroup()
      handleLNGZhanliejianGroup()
      handleLATZhanliejianGroup()
      handleHPZhanliejianGroup()
      handleFUELZhanliejianGroup()
      handleHighLightZhanliejianGroup()

      /** 坦克的操作 */
      handleLNGTankeGroup()
      handleLeftTankeGroup()
      handleTopTankeGroup()
      handleLATTankeGroup()
      handleHPTankeGroup()
      handleFUELTankeGroup()
      handleHighLightTankeGroup()
  }, [dynamicInfo])

  useEffect(() => {
    if (!id) return;
    getStaticInfo(id);
    getDynamicInfo(id);
  }, [id, getStaticInfo, getDynamicInfo]);

  /**  固定翼无人机相关信息 */
  // 所以无人机组的经度列表
  const [leftList, setLeftList] = useState<number[]>(new Array(3).fill(0))
  const [topList, setTopList] = useState<number[]>(new Array(3).fill(0))
  const [LNGList, setLNGList] = useState<string[]>(new Array(3).fill("0°'"))
  const [LATList, setLATList] = useState<string[]>(new Array(3).fill("0°'"))
  const [HPList, setHPList] = useState<string[]>(new Array(3).fill('0'))
  const [FUELList, setFUELList] = useState<string[]>(new Array(3).fill('0'))
  const [YAWList, setYAWList] = useState<string[]>(new Array(3).fill('0'))
  const [highLightList, setHighLightList] = useState<number[]>(new Array(3).fill(0))

  /**  小型4旋翼无人机10架 */
  const [sixuanyiLeftList, setSixuanyiLeftList] = useState<number[]>(new Array(10).fill(0))
  const [sixuanyiTopList, setSixuanyiTopList] = useState<number[]>(new Array(10).fill(0))
  const [sixuanyiLNGList, setSixuanyiLNGList] = useState<string[]>(new Array(10).fill("0°'"))
  const [sixuanyiLATList, setSixuanyiLATList] = useState<string[]>(new Array(10).fill("0°'"))
  const [sixuanyiHPList, setSixuanyiHPList] = useState<string[]>(new Array(10).fill('0'))
  const [sixuanyiFUELList, setSixuanyiFUELList] = useState<string[]>(new Array(10).fill('0'))
  const [sixuanyiHighLightList, setSixuanyiHighLightList] = useState<number[]>(new Array(10).fill(0))

  /**  战列舰相关 */
  const [zhanliejianLeftList, setZhanliejianLeftList] = useState<number[]>(new Array(7).fill(0))
  const [zhanliejianTopList, setZhanliejianTopList] = useState<number[]>(new Array(7).fill(0))
  const [zhanliejianLNGList, setZhanliejianLNGList] = useState<string[]>(new Array(7).fill("0°'"))
  const [zhanliejianLATList, setZhanliejianLATList] = useState<string[]>(new Array(7).fill("0°'"))
  const [zhanliejianHPList, setZhanliejianHPList] = useState<string[]>(new Array(7).fill('0'))
  const [zhanliejianFUELList, setZhanliejianFUELList] = useState<string[]>(new Array(7).fill('0'))
  const [zhanliejianiHighLightList, setZhanliejianiHighLightList] = useState<number[]>(new Array(7).fill(0))


  /**  坦克两架 */
  const [tankeLeftList, setTankeLeftList] = useState<number[]>(new Array(2).fill(0))
  const [tankeTopList, setTankeTopList] = useState<number[]>(new Array(2).fill(0))
  const [tankeLNGList, setTankeLNGList] = useState<string[]>(new Array(2).fill("0°'"))
  const [tankeLATList, setTankeLATList] = useState<string[]>(new Array(2).fill("0°'"))
  const [tankeHPList, setTankeHPList] = useState<string[]>(new Array(2).fill('0'))
  const [tankeFUELList, setTankeFUELList] = useState<string[]>(new Array(2).fill('0'))
  const [tankeHighLightList, setTankeHighLightList] = useState<number[]>(new Array(2).fill(0))
  

  // 更改root的宽高
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.height = "100vh";
      root.style.width = "100vw";
    }

  }, []);

  if (!staticInfo) return <></>;
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url('${staticInfo.backgroundUrl}')` }}
    >
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
      {
        [0, 1].map(i => (
          <div 
            key={i}
            className={styles.tankeGroup}
            style={{
              position: 'absolute', 
              top: `${tankeTopList[i]}px`, 
              left: `${tankeLeftList[i]}px`
            }}
          >
          <div className={
            classnames(styles.tankeIcon, {
              [styles.highLight]: tankeHighLightList[i]
            })
            }>坦克</div>
          <Electric 
            oilValue={`${tankeFUELList[i]}px`} 
            liveValue={`${tankeHPList[i]}px`} 
            styles={{marginLeft: '0'}} 
            LNG={tankeLNGList[i]}
            LAT={tankeLATList[i]}
          />
        </div>
        ))
      }

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
      {
        [0, 1, 2].map((i) => (
          <div 
            className={styles.wurenjiGroup}
            key={i}
            style={{
              position: 'absolute', top: `${topList[i]}px`, left: `${leftList[i]}px`}}>
            <div className={classnames(styles.wurenjiIcon,{
              [styles.highLight]: highLightList[i]
            })} style={{transform: `rotate(${YAWList[i]}deg)`}}>
              固定翼无人机
            </div>
            <Electric 
              liveValue={HPList[i] + "px"} 
              oilValue={FUELList[i] + "px"} 
              LNG={LNGList[i]}
              LAT={LATList[i]}
            />
          </div>
        ))
      }
      {
        [0, 1, 2, 3, 4, 5, 6].map(i => (
          <div 
            style={{
              position: 'absolute', 
              top: `${zhanliejianTopList[i]}px`, 
              left: `${zhanliejianLeftList[i]}px`
            }}
            className={styles.jianlietingGroup}
            key={i}
          >
            <div className={
              classnames(styles.jianlietingIcon, {
                [styles.highLight]: zhanliejianiHighLightList[i]
              })
              }>ZLJ</div>
            <Electric
              oilValue={`${zhanliejianFUELList[i]}px`} 
              liveValue={`${zhanliejianHPList[i]}px`} 
              LNG={zhanliejianLNGList[i]}
              LAT={zhanliejianLATList[i]}
            />
          </div>
        ))
      }

      {
        [0,1,2,3,4,5,6,7,8,9].map((i) => {
          return (
            <div 
            key={i}
            className={styles.sixuanyi}
            style={{
                position: 'absolute', 
                top: `${sixuanyiTopList[i]}px`, 
                left: `${sixuanyiLeftList[i]}px`
            }}>
              <div className={styles.sixuanyiContent}>
                <div className={
                  classnames(styles.sixuanyiIcon, {
                    [styles.highLight]: sixuanyiHighLightList[i]
                  })
                  }>小型4旋翼无人机1</div>
                <Electric 
                  oilValue={`${sixuanyiFUELList[i]}px`} 
                  liveValue={`${sixuanyiHPList[i]}px`} 
                  styles={{marginLeft: '0'}} 
                  LNG={sixuanyiLNGList[i]}
                  LAT={sixuanyiLATList[i]}
                />
              </div>
            </div>
          )
        })
      }

      <div
       className={styles.tataiGroup}
      
      >
        <div className={styles.tataiIcon}>塔台</div>
        <div className={s2.liveWrapper}>
            <i className={s2.liveBg}></i>
            <div className={s2.jianchuanContent}>
                <div><p>北纬xx，东经xx</p></div>
            </div>
        </div>
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
