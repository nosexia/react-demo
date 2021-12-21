import { InputNumber } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
type IconInputType = {
    onChange?: (value: any) => void;
    value?: string;
    ParamsDefaultValue: string;
    ParamsName: string;
    ParamsType: string;
}
const IconFloat: FC<IconInputType> = ({ onChange, ParamsDefaultValue = '', ParamsName = '', ParamsType = '' }) => {

    // const [innerValue, setValue] = useState(ParamsDefaultValue)
    function handleChange(value: any) {
        onChange?.(value)
    }

    useEffect(() => {
        onChange?.(ParamsDefaultValue)
    }, [])


    return <div className={styles.iconFormWrap}>
        <span className={styles.icon}>{ParamsType}</span>
        <InputNumber  onChange={handleChange} defaultValue={ParamsDefaultValue} className={styles.input} />
    </div>
}

export default IconFloat;