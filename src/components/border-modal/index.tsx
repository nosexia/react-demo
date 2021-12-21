import XBModalLine from '@components/xb-modal-line';
import { Modal } from 'antd';
import React, { FC } from 'react';

type IProps = {
    [key: string]: any
}
const BorderModal: FC<IProps> = ({children, ...others}) => {
    return <Modal {...others}>
        {children}
        <XBModalLine />
    </Modal>
}

export default BorderModal;