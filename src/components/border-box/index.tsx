import classnames from 'classnames';
import React, { FC } from 'react';
import styles from './index.module.less';
type IBorderBox = {
    [key: string]: any
}
const BorderBox: FC<IBorderBox> = ({ children, ...other }) => {
    return <div {...other} className={styles.borderBox}>
        <div className={styles.borderBoxContent}>
            {children}
        </div>

        <span className={classnames(styles.arrow, styles.leftTop)}></span>
        <span className={classnames(styles.arrow, styles.leftBottom)}></span>
        <span className={classnames(styles.arrow, styles.rightTop)}></span>
        <span className={classnames(styles.arrow, styles.rightBottom)}></span>
    </div>
}

export default BorderBox;