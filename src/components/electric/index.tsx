import React, {FC} from 'react'
import styles from "./index.module.less";

type Props = {
    liveValue: string,
    oilValue: string
}
const Electrc:FC<Props> = (props) => {
    return (
        <div className={styles.liveWrapper}>
            <i className={styles.liveBg}></i>
            <div className={styles.jianchuanContent}>
            <div><p>北纬25°03'，东经121°31'</p></div>
            <div className={styles.aliveContent}>
                <div><p>生命值</p></div>
                <div className={styles.bg}>
                <i style={{width: props.liveValue}}></i>
                </div>
            </div>
            <div className={styles.aliveContent}>
                <div><p>油    量</p></div>
                <div className={styles.bg}>
                <i  style={{width: props.oilValue}} className={styles.youliang}></i>
                </div>
            </div>
            </div>
      </div>
    )
}

export default Electrc