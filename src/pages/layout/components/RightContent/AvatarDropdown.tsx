import React, { useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import { Avatar, Menu, Modal, Spin } from "antd";

import HeaderDropdown from "../HeaderDropdown";
import classes from "./index.module.less";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const [user, setUser] = useRecoilState(userState);
  const { username, avatar } = user;

  const navigate = useNavigate();
  const location = useLocation();

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    // Note: There may be security issues, please note

    if (location.pathname !== "/login") {
      localStorage.removeItem('token')
      navigate("/login", {
        replace: true,
      });
    }
  };

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === "logout" && user) {
        setUser({ ...user, logged: false });
        loginOut();
        return;
      }

      if (key === "about" && user) {
        Modal.info({
          title: '智能复杂体系演示验证系统',
          mask: false,
          content: (
            <div>
              <p>版本号：V1.0.0</p>
            </div>
          ),
        });
        return;
      }
    },
    [user, setUser]
  );

  const loading = (
    <span className={`account`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!user) {
    return loading;
  }

  if (!username) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={"menu"} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}
      <Menu.Item key="about">
        <QuestionCircleOutlined />
        关于
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${classes.action} ${classes.account}`}>
        <Avatar
          size="small"
          className={classes.avatar}
          src={avatar}
          alt="avatar"
        />
        <span className={`${classes.name} `}>{username}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
