import { Select } from 'antd';
import React, { FC, useEffect } from 'react';
import styles from './index.module.less';
type IconInputType = {
    onChange?: (value:string) => void;
    value?: string;
    ParamsDefaultValue: string;
    ParamsName: string;
    ParamsType: string;
}
const IconImput: FC<IconInputType> = ({ onChange, value = '', ParamsDefaultValue = '', ParamsName = '', ParamsType = '' }) => {

    function handleChange(e: any) {
        const value = e.target.value;
        onChange?.(value)
    }

    useEffect(() => {
        onChange?.(ParamsDefaultValue)
    }, [])
    return <div className={styles.iconFormWrap}>
        <span className={styles.icon}>{ParamsType}</span>
        <Select options={ParamsDefaultValue}></Select>
    </div>
}

export default IconImput;