import { Switch } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
type IconInputType = {
    onChange?: (value: any) => void;
    value?: string;
    ParamsDefaultValue: boolean;
    ParamsName: string;
    ParamsType: string;
}
const IconBool: FC<IconInputType> = ({ onChange, value = '', ParamsDefaultValue = true, ParamsName = '', ParamsType = '' }) => {

    // const [innerValue, setValue] = useState(ParamsDefaultValue)
    function handleChange(value: any) {
        onChange?.(value)
    }

    useEffect(() => {
        onChange?.(ParamsDefaultValue)
    }, [])


    return <div className={styles.iconFormWrap}>
        <span className={styles.icon}>{ParamsType}</span>
        <div className={styles.wrap}>
            <Switch defaultChecked={ParamsDefaultValue} onChange={handleChange} />
        </div>
    </div>
}

export default IconBool;