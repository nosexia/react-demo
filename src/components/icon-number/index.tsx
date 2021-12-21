import { InputNumber } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
type IconInputType = {
    onChange?: (value: any) => void;
    value?: string;
    ParamsDefaultValue: number;
    ParamsName: string;
    ParamsType: string;
}
const IconNumber: FC<IconInputType> = ({ onChange, ParamsDefaultValue, ParamsName = '', ParamsType = '' }) => {

    // const [innerValue, setValue] = useState(ParamsDefaultValue)
    function handleChange(value: any) {
        onChange?.(value)
    }

    useEffect(() => {
        onChange?.(ParamsDefaultValue)
    }, [])
    const limitDecimals = (value: undefined | number | string): number => {
        if (value === undefined) {
            return 0;
        }
        let result = Number.parseInt(value, 10);

        if (isNaN(result)) {
            return 0;
        } else {
            return result;
        }
    };

    return <div className={styles.iconFormWrap}>
        <span className={styles.icon}>{ParamsType}</span>
        <InputNumber
            formatter={limitDecimals}
            parser={limitDecimals}
            onChange={handleChange}
            defaultValue={ParamsDefaultValue}
            className={styles.input} />
    </div>
}

export default IconNumber;