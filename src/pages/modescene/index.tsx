import React, { useState } from 'react';
import ProForm, {
    StepsForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
    ProFormRadio
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Button, message } from 'antd';
import classnames from 'classnames';
import FileTypeSelect from '@pages/modescene/components/fileTypeSelect';
import styles from './index.module.less';

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export default () => {
    const [current, setCurrent] = useState(0);
    return (
        <div className={styles.bg}>
            <ProCard ghost={true}>
                <StepsForm<{
                    name: string;
                }>
                    current={current}
                    onCurrentChange={(step) => { setCurrent(step) }}
                    onFinish={async (values) => {
                        console.log(values);
                        await waitTime(1000);
                        message.success('提交成功');
                    }}
                    formProps={{
                        validateMessages: {
                            required: '此项为必填项',
                        },
                    }}
                    submitter={{
                        render: (props) => {
                            if (props.step === 0) {
                                return (
                                    <Button type="primary" onClick={() => props.onSubmit?.()}>
                                        下一步
                                    </Button>
                                )
                            }

                            if (props.step === 1) {
                                return [
                                    <Button key="pre" onClick={() => props.onPre?.()}>
                                        上一步
                                    </Button>,
                                    <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                                        下一步
                                    </Button>,
                                ];
                            }

                            if (props.step === 2) {
                                return [
                                    <Button key="pre" onClick={() => props.onPre?.()}>
                                        上一步
                                    </Button>,
                                    <Button type="primary" key="goToFour" onClick={() => props.onSubmit?.()}>
                                        下一步
                                    </Button>,
                                ];
                            }

                            return [
                                <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                                    上一步
                                </Button>,
                                <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                                    提交
                                </Button>,
                            ];
                        },
                    }}
                >

                    <StepsForm.StepForm<{
                        name: string;
                    }>
                        name="base"
                        stepProps={{
                            title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current >= 0 })}>选择场景</span>
                        }}
                        onFinish={async ({ name }) => {
                            console.log(name);
                            await waitTime(500);
                            return true;
                        }}
                    >
                        <ProCard
                            title="选择场景"
                            style={{ maxWidth: 1400, marginTop: 24, marginBottom: 30 }}
                        >
                            <FileTypeSelect />
                        </ProCard>
                    </StepsForm.StepForm>

                    <StepsForm.StepForm<{
                        checkbox: string;
                    }>
                        name="checkbox"
                        stepProps={{
                            title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current >= 1 })}>配置初始参数</span>
                        }}
                    >
                        <ProCard
                            title="智慧园区模型配置"
                            style={{ maxWidth: 1400, marginTop: 24, marginBottom: 30 }}
                        >
                            <ProFormTextArea name="remark" width="lg" />
                        </ProCard>
                    </StepsForm.StepForm>

                    <StepsForm.StepForm
                        name="time"
                        stepProps={{
                            title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current >= 2 })}>智能体算法选择</span>
                        }}
                    >
                        <ProCard
                            title="车辆算法选择"
                            style={{ maxWidth: 1400, marginTop: 24, marginBottom: 30 }}
                        >
                            <ProFormRadio.Group
                                name="radio-vertical"
                                layout="vertical"
                                options={[
                                    {
                                        label: '随机工作',
                                        value: '随机工作',
                                    },
                                    {
                                        label: '算法A',
                                        value: 'a',
                                    },
                                    {
                                        label: '算法B',
                                        value: 'b',
                                    },
                                ]}
                            />
                        </ProCard>

                    </StepsForm.StepForm>

                    <StepsForm.StepForm
                        name="attribute"
                        stepProps={{
                            title: <span className={classnames(styles.stepTitle, { [styles.stepTitleActive]: current >= 3 })}>配置算法参数</span>
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
            </ProCard>
        </div>
    );
};