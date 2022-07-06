import React, {FC} from 'react'
import styles from "./index.module.less";

type Props = {
    liveValue: string,
    oilValue: string,
    LNG: string,
    LAT: string,
    styles?: Record<string,any>
}
const Electrc:FC<Props> = (props) => {
    const {liveValue, oilValue, LNG, LAT, styles:aliasStyles} = props
    return (
        <div className={styles.liveWrapper} style={aliasStyles}>
            <i className={styles.liveBg}></i>
            <div className={styles.jianchuanContent}>
            <div><p>北纬{LAT}，东经{LNG}</p></div>
            <div className={styles.aliveContent}>
                <div><p>生命值</p></div>
                <div className={styles.bg}>
                <i style={{width: liveValue}}></i>
                </div>
            </div>
            <div className={styles.aliveContent}>
                <div><p>油    量</p></div>
                <div className={styles.bg}>
                <i  style={{width: oilValue}} className={styles.youliang}></i>
                </div>
            </div>
            </div>
      </div>
    )
}

export default Electrc