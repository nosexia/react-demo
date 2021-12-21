import { Input } from 'antd';
import React, { FC, useEffect } from 'react';
import styles from './index.module.less';
type IconInputType = {
    onChange?: (value: any) => void;
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

    function parseTypeValue(type: string, value: string) {
        switch (type) {
            case 'bool':
                // if(value === 'true'){
                //     return true;
                // }
                if (value.toString() === 'false') {
                    return false;
                }

                return true;
            case 'int':
                var parseValue = Number.parseInt(value);
                if (isNaN(parseValue)) {
                    return value;
                }

                return parseValue;
            case 'float':
                var parseValue = Number.parseFloat(value);
                if (isNaN(parseValue)) {
                    return value;
                }

                return parseValue;
            default:
                return value;
        }
    }
    return <div className={styles.iconFormWrap}>
        <span className={styles.icon}>{ParamsType}</span>
        <Input onChange={handleChange} defaultValue={ParamsDefaultValue} className={styles.input} placeholder="请输入" />
    </div>
}

export default IconImput;