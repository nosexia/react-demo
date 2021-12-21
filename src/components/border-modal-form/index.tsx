import { ModalForm } from '@ant-design/pro-form';
import XBModalLine from '@components/xb-modal-line';
import React, { FC } from 'react';

type IProps = {
    [key: string]: any
}
const BorderModalForm: FC<IProps> = ({children, ...others}) => {
    return <ModalForm {...others}>
        {children}
        <XBModalLine />
    </ModalForm>
}

export default BorderModalForm;