import React, { FC } from 'react';
import { Spin, Alert } from 'antd';

const SuspendFallbackLoading: FC = () => {
  return (
    <div style={{width: '100vw', height: '100vh',display:'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Spin tip="玩命加载中...">

      </Spin>
    </div>
  );
};

export default SuspendFallbackLoading;
