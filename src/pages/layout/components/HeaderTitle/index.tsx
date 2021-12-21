import React, { FC } from 'react';
import styles from './index.module.less'
import headerTitleBg from './assets/header-title-bg.png';
import icon from './assets/icon.png';
import { useNavigate } from 'react-router-dom';
const HeaderTitle: FC = () => {
    const navigate = useNavigate();
    return <div onClick={() => navigate('/home')} className={styles.headerTitleWrap}>
         <img className={styles.icon} src={icon} alt="icon" />
        <span className={styles.title}>智能复杂体系演示验证系统</span>
        <img className={styles.bgImg} src={headerTitleBg} alt="bg" />
       
    </div>
}

export default HeaderTitle;