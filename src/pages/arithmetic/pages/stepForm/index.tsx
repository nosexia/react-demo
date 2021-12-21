import React, { useRef, FC, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import classnames from 'classnames';
import ProForm, {
    StepsForm,
    ProFormSelect,
    ProFormText,
    ProFormRadio,
} from '@ant-design/pro-form';
import { message, Form } from 'antd';
import styles from '../../index.module.less';

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
const Export: FC = (props) => {
    const formRef = useRef<ProFormInstance>();
    const [current, setCurrent] = useState(0);
    return (
        <div className={styles.exportWrap}>
            <StepsForm<{
                name: string;
            }>

                current={current}
                onCurrentChange={(step) => { setCurrent(step) }}
                formRef={formRef}
                onFinish={async () => {
                    await waitTime(1000);
                    message.success('提交成功');
                }}
                formProps={{
                    validateMessages: {
                        required: '此项为必填项',
                    },
                }}
            >
                <StepsForm.StepForm<{
                    checkbox: string;
                }>
                    name="data"
                    title="设置参数"
                    stepProps={{
                        title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current >= 0 })}>选择字段</span>
                    }}
                    onFinish={async () => {
                        console.log(formRef.current?.getFieldsValue());
                        return true;
                    }}
                >
                    <ProCard
                        title="上传数据"
                        style={{ maxWidth: 1400, marginTop: 24, marginBottom: 30 }}
                    >
                        <ProFormRadio.Group
                            name="radio-vertical"
                            layout="vertical"
                            options={[
                                {
                                    label: '智慧城市数据数据集',
                                    value: '智慧城市数据数据集',
                                },
                                {
                                    label: 'AI城市挑战赛数据集',
                                    value: 'AI城市挑战赛数据集',
                                },
                            ]}
                        />
                    </ProCard>
                </StepsForm.StepForm>
                <StepsForm.StepForm
                    name="field"
                    stepProps={{
                        title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current >= 1 })}>配置参数</span>
                    }}
                >
                    <ProCard
                        title="选择字段"
                        style={{ maxWidth: 1400, marginTop: 24, marginBottom: 30 }}
                    >
                        <ProFormSelect
                            name="resource"
                            label="源"
                            request={async () => [
                                { label: '智慧城市', value: '1' },
                                { label: '智慧园区', value: '2' },
                                { label: '智慧交通', value: '3' },
                                { label: '装备保障', value: '4' },
                            ]}
                            placeholder="请选择数据源！"
                            rules={[{ required: true, message: '数据源为必填项！' }]}
                        />
                        <ProFormRadio.Group
                            name="radio-vertical"
                            layout="vertical"
                            options={[
                                {
                                    label: 'id',
                                    value: 'id',
                                },
                                {
                                    label: 'key',
                                    value: 'key'
                                },
                                {
                                    label: 'value',
                                    value: 'value',
                                },
                            ]}
                        />
                    </ProCard>
                </StepsForm.StepForm>

                <StepsForm.StepForm
                    name="success"
                    stepProps={{
                        title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current >= 2 })}>导出完成</span>
                    }}
                >
                    <ProCard
                        title="KMEANS算法参数配置"
                        style={{ maxWidth: 1400, marginTop: 24, marginBottom: 30 }}
                    >
                        <ProFormText width="md" name="company" label="n_Cluster" placeholder="请输入n_Cluster" />
                        <ProFormText width="md" name="company" label="n_init" placeholder="请输入n_init" />
                        <ProFormText width="md" name="company" label="Max_iter" placeholder="请输入Max_iter" />
                        <ProFormText width="md" name="company" label="init" placeholder="请输入init" />
                        <ProFormText width="md" name="company" label="Algo" placeholder="请输入Algo" />
                    </ProCard>
                </StepsForm.StepForm>
            </StepsForm>
        </div>
    )
}

export default Export;