import React, { FC, useEffect, Suspense, useCallback, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { MenuList, MenuChild } from "@/models/menu.interface";
import { useGuide } from "../guide/useGuide";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useGetCurrentMenus, useGetCurrentUser } from "@/api";
import { userState } from "@/stores/user";
import { useRecoilState } from "recoil";

import type { MenuDataItem } from "@ant-design/pro-layout";
import ProLayout from "@ant-design/pro-layout";
import { HomeOutlined, DatabaseOutlined, FileMarkdownOutlined, OneToOneOutlined, AlignCenterOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useLocale } from "@/locales";
import { createBrowserHistory } from "history";
import RightContent from "./components/RightContent";
import styles from "./index.module.less";
import Footer from "./components/Footer";
import bgImage from '@/pages/data/assets/images/bg.jpg';
import Header from "./components/Header";
import HeaderTitle from "./components/HeaderTitle";
import HeaderMenu from "./components/HeaderMenu";
import HeaderRight from "./components/HeaderRight";
const history = createBrowserHistory();
import avator from '@/assets/header/avator.png'
import bgVideo from '../login/assets/bg-video.mp4';
const IconMap: { [key: string]: React.ReactNode } = {
  home: <HomeOutlined />,
  data: <DatabaseOutlined />,
  model: <FileMarkdownOutlined />,
  arithmetic: <OneToOneOutlined />,
  sample: <AlignCenterOutlined />,
};

const menuList = [
  {
    path: '/home',
    name: '主页',
    icon: 'home',
  },
  {
    path: '/model',
    name: '模型',
    icon: 'model',
  },
  {
    path: '/data',
    name: '数据',
    icon: 'data',
  },
  {
    path: '/arithmetic',
    name: '算法',
    icon: 'arithmetic',
  },
  // {
  //   path: '/sample',
  //   name: '案例',
  //   icon: 'sample',
  // },
]


const LayoutPage: FC = ({ children }) => {
  //获取用户menu，现逻辑不是通过服务器配置，先使用写死的
  // const { data: menuList, status } = useGetCurrentMenus();

  const [user, setUser] = useRecoilState(userState);
  const [pathname, setPathname] = useState("/welcome");
  const { device, collapsed, newUser, settings } = user;
  const isMobile = device === "MOBILE";
  const { driverStart } = useGuide();
  const location = useLocation();
  const navigate = useNavigate();
  // const { formatMessage } = useLocale();

  // const [user, setUser] = useRecoilState(userState);
  const { locale } = user;
  const { data: currentUser, error } = useGetCurrentUser(navigate);
  useEffect(() => {
    if (currentUser) {
      const userData: any = (currentUser as any)?.user;
      const newUser = {
        ...user,
        username: userData?.userName || "",
        role: userData?.roles,
        logged: true,
        avatar: userData?.avatar === '' ? avator : userData?.avatar
      }
      setUser(newUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (location.pathname === "/") {
      // navigate("/home");
      navigate("/login");
    }
  }, [navigate, location]);

  const toggle = () => {
    setUser({ ...user, collapsed: !collapsed });
  };

  const initMenuListAll = (menu: MenuList) => {
    const MenuListAll: MenuChild[] = [];
    menu.forEach((m) => {
      if (!m?.children?.length) {
        MenuListAll.push(m);
      } else {
        m?.children.forEach((mu) => {
          MenuListAll.push(mu);
        });
      }
    });
    return MenuListAll;
  };

  //用户信息
  // useEffect(() => {
  //   newUser && driverStart();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [newUser]);

  const loopMenuItem = (menus?: MenuDataItem[]): MenuDataItem[] => {
    if (!menus || !Array.isArray(menus)) return [];

    const m = menus.map(({ icon, children, ...item }) => ({
      ...item,
      icon: icon && IconMap[icon as string],
      children: children && loopMenuItem(children),
    }));

    return m;
  };
  if (status === 'error') return <h1>error</h1>;

  return (
    <ProLayout
      contentStyle={{
        margin: '0px',
        // backgroundImage: `url(${bgImage})`,
        // backgroundSize: '100% 100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
      fixSiderbar
      headerRender={() => <Header>
        <HeaderTitle />
        <HeaderMenu />
        {/* <HeaderRight/> */}
        <RightContent />
      </Header>}
      menuRender={() => "123123123123"}
      collapsed={collapsed}
      location={{
        pathname: location.pathname,
      }}
      {...settings}
      onCollapse={toggle}
      // formatMessage={formatMessage}
      onMenuHeaderClick={() => navigate("/home")}
      menuHeaderRender={undefined}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom;
        }

        return <Link style={{ marginRight: 1 }} to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: "/home",
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join("/")}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      menuDataRender={() => loopMenuItem(menuList as any)}
      // menuDataRender={() => m}
      rightContentRender={() => <RightContent />}
      // footerRender={() => <Footer />}
      collapsedButtonRender={() => {
        return (
          <div
            onClick={() => toggle}
            style={{
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            <span id="sidebar-trigger">
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
          </div>
        );
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        position: 'relative',
        zIndex:2
      }}>
        <Outlet />
      </div>

      <video className={styles.video} src={bgVideo} muted loop autoPlay></video>

    </ProLayout >
  );
};

export default LayoutPage;
