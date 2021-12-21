import React, { FC } from 'react';
import styles from './index.module.less';
import dot from './assets/dot.png';

const Header: FC = (props) => {
    return <div className={styles.header}>
        <img className={styles.dot} src={dot} alt="dot" />
        {props.children}
    </div>
}

export default Header;