import React, { FC, useState, useEffect, Suspense, useRef, useMemo } from "react";
import { Button, Checkbox, Form, Input, message, Popover, Space } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LoginParams } from "@/models/login";
import { QrcodeOutlined, UserOutlined,InfoCircleOutlined } from '@ant-design/icons';
// import { loginAsync } from '@/stores/user.store';
// import { useAppDispatch } from '@/stores';
import { Location } from "history";
import { useLogin } from "@/api";

import styles from "./index.module.less";
import bgVideo from './assets/bg-video.mp4';
import loginLeft from './assets/login-left.png';
import loginRight from './assets/login-right.png';

import ParticleImage, {
  ParticleOptions,
  Vector,
  forces,
  ParticleForce
} from "react-particle-image";


import logo from './assets/qh-logo.png';
import sysName from './assets/sys-name.png';
import { parseParams } from "@utils/utils";
import classnames from "classnames";
const initialValues: LoginParams = {
  username: "admin",
  password: "admin",
  // remember: true
};

const particleOptions: ParticleOptions = {
  filter: ({ x, y, image }) => {
    // Get pixel
    const pixel = image.get(x, y);
    // Make a particle for this pixel if blue > 50 (range 0-255)
    return pixel.b > 50;
  },
  color: ({ x, y, image }) => "#61dafb",
  radius: () => Math.random() * 1.5 + 0.5,
  mass: () => 40,
  friction: () => 0.15,
  initialPosition: ({ canvasDimensions }) => {
    return new Vector(canvasDimensions.width / 2, canvasDimensions.height / 2);
  }
};

const motionForce = (x: number, y: number): ParticleForce => {
  return forces.disturbance(x, y, 5);
};

type Key = keyof LoginParams;

const LoginForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const [loginFormShow, setLoginFormShow] = useState(false)
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const location = useLocation() as Location<{ from: string }>;

  // const dispatch = useAppDispatch();

  const onFinished = async (form: LoginParams) => {
    // const formdata = new FormData();
    // Object.keys(form).forEach((key) => {
    //   formdata.append(key,form[key as Key])
    // })
    setLoading(true)
    const result: any = await loginMutation.mutateAsync(form);
    console.log('result', result)
    setLoading(false)

    if (result.code === 200) {
      localStorage.setItem("token", result.token);
      // localStorage.setItem("username", result.username);

      // const from = location.state?.from || { pathname: "/home" };
      let from = { pathname: "/home" };
      let params = parseParams(location.search)
      if (params['redirect']) {
        from = { pathname: location.search.substring(location.search.indexOf('=') + 1) }
      }
      navigate(from);
    } else {
      // message.error(result.msg);
    }
  };


  return (
    <div className={styles.container}>
      <img className={classnames(styles.logo, { [styles.logoLoginShow]: loginFormShow })} src={logo} alt="logo" />
      <img className={classnames(styles.sysName, { [styles.sysNameLoginShow]: loginFormShow })} src={sysName} alt="sysName" />
      <div className={classnames(styles.loginStatus, { [styles.loginStatus_animation]: loginFormShow })}>
        <span onClick={() => setLoginFormShow(!loginFormShow)}
          className={classnames(styles.loginText, styles.loginText_left)}>
          去登录
        </span>
        <img src={loginRight} className={classnames(styles.loginStatusImg)} alt="status" />
      </div>


      <div className={classnames(styles.main, { [styles.mainShow]: loginFormShow })}>
        <div className={classnames(styles.loginStatus_back, { [styles.loginStatus_animation]: !loginFormShow })}>
          <span onClick={() => setLoginFormShow(!loginFormShow)}
            className={classnames(styles.loginText, styles.loginText_right)}>
            {'返回'}
          </span>
          <img src={loginLeft} className={classnames(styles.loginStatusImg)} alt="status" />
        </div>
        <Form<LoginParams> className="xb-form" onFinish={onFinished} initialValues={initialValues}>
          <h1 className={styles.loginTitle}>欢迎登录</h1>
          <span className={styles.label}>用户名:</span>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名！" }]}
          >
            <Input bordered={false} className={styles.input} size="large" placeholder="用户名" />
          </Form.Item>
          <span className={styles.label}>密码:</span>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input bordered={false} className={styles.input} type="password" size="large" placeholder="密码" />
          </Form.Item>
          <div className={classnames('login__popover--wrap',styles.butterfly)}>
            {/* <Space size={16}>
              <UserOutlined />
              <span >新用户注册</span>
            </Space>
            <Space size={16}>
              <QrcodeOutlined />
              <span >二维码登录</span>
            </Space> */}

            {/* <Space size={5}>
              <Checkbox ></Checkbox>
              <span >记住密码</span>
            </Space>
            <Space size={16}>
              <Popover  content={<div style={{fontSize: 10}}>
                <Space size={10}>
                <InfoCircleOutlined />
                <span >请联系管理员重置登录密码</span>
                </Space><br/>
               
                <span style={{display:'inline-block',paddingLeft:22}}>电话：400-888-888</span>
              </div>}>
              <span >忘记密码？</span>
              </Popover>
            </Space> */}
          </div>
          <Button
            loading={loading}
            size="large"
            shape="round"
            className={styles.mainLoginBtn}
            htmlType="submit"
            type="primary"
          >
            登录
          </Button>
        </Form>
      </div>

      <video src={bgVideo} muted loop autoPlay></video>
    </div>
  );
};

export default LoginForm;
