import { Card } from 'antd';
import React, { FC } from 'react';
import styles from './index.module.less';
import {
    LineChartOutlined
} from '@ant-design/icons';
import classnames from 'classnames';
const OpacityCart: FC = (props) => {
    return <div
        onClick={() => { }}
        className={styles['card']}
    >
        <span className={classnames(styles.arrow, styles.leftTop)}></span>
        <span className={classnames(styles.arrow, styles.leftBottom)}></span>
        <span className={classnames(styles.arrow, styles.rightTop)}></span>
        <span className={classnames(styles.arrow, styles.rightBottom)}></span>
        <div className={styles.content}>
            {
                props.children
            }
        </div>
    </div>
}

export default OpacityCart;