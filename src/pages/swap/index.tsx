import React, {useState} from 'react'
import {useMount, useUnmount} from 'react-use'
import s from './index.scss'
let timer = null
const Home  = () => {
    const [day, setDay] = useState<string>('000')
    const [hour, setHour] = useState<string>('00')
    const [minute, setMinute] = useState<string>('00')
    const [second, setSecond] = useState<string>('00')
    const addZero = (i) => {
        return i < 10 ? "0" + i: i + "";
    }

    const addZero1 = (i) => {
        if(i < 10) {
            return `00${i}`
        } else if(i < 100) {
            return `0${i}`
        }
        return i
    }

    function countDown() {
        let nowtime = new Date();
        let endtime = new Date("2022/08/31,22:11:59");
        let lefttime = parseInt(String((endtime.getTime() - nowtime.getTime()) / 1000));
        if(lefttime < 0) {
            clearTimeout(timer)
            timer = null
            return
        }
        let d = parseInt(String(lefttime / (24*60*60)))
        let h = parseInt(String(lefttime / (60 * 60) % 24));
        let m = parseInt(String(lefttime / 60 % 60));
        let s = parseInt(String(lefttime % 60));
        const day = addZero1(d)
        const hour = addZero(h);
        const minute = addZero(m);
        const second = addZero(s);
        setDay(day)
        setHour(hour)
        setMinute(minute)
        setSecond(second)
        timer = setTimeout(countDown, 1000);
      }

      // 定时器开始计算时间
      useMount(countDown)

      useUnmount(() => {
        clearTimeout(timer)
        timer = null 
      })

    return <div className={s.homeWrapperOuter}>
        <div className={s.wrapperInnerLeft}>
            <p className={s.titleMessage}>We are</p>
            <p className={s.titleMessage}>Coming</p> 
            <p className={s.titleMessage}>Soon.</p>
        </div>
        <div className={s.wrapperInnerRight}>
            <div className={s.wrapperCountDown}>
                <ul>
                    <li>
                        <h5 className={s.subTitle}>DAYS</h5>
                        <p className={s.subMessage}>{day}</p>
                    </li>
                    <li>
                        <h5 className={s.subTitle}>HRS</h5>
                        <p className={s.subMessage}>{hour}</p>
                    </li>

                    <li>
                        <h5 className={s.subTitle}>MINS</h5>
                        <p className={s.subMessage}>{minute}</p>
                    </li>

                    <li>
                        <h5 className={s.subTitle}>SECS</h5>
                        <p className={s.subMessage}>{second}</p>
                    </li>
                </ul>
            </div>

            <div className={s.wrapperNotifiedMessage}>
                <div className={s.innerNotifiedMessage}>
                    <div className={s.notifiedMessageLeft}>
                        <h4>
                        Get notified when we launch
                        </h4>
                        <input className={s.wrapperEmail} placeholder="Enter your email" />
                    </div>
                    <input type="button" className={s.wrapperSubmit}/>
                </div>
            </div>
        </div>
    </div>
}

export default Home