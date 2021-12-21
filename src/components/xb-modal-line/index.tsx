import { Modal } from 'antd';
import classnames from 'classnames';
import React, { FC } from 'react';
import styles from './index.module.less';

const XBModalLine: FC = () => {
    return <>
        <div className={styles.borderInnerLine}></div>
        <div className={styles.borderOuterLine}>
            <span className={classnames(styles.arrow, styles.leftTop)}></span>
            <span className={classnames(styles.arrow, styles.leftBottom)}></span>
            <span className={classnames(styles.arrow, styles.rightTop)}></span>
            <span className={classnames(styles.arrow, styles.rightBottom)}></span>
        </div>
    </>
}

export default XBModalLine;