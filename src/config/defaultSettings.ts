import { Settings as LayoutSettings } from "@ant-design/pro-layout";
import logo,{ ReactComponent as LogoSvg } from "@/assets/logo/zndd.svg";
const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  // navTheme: "light",
  // primaryColor: "#1890ff",
  // layout: "side",
  // contentWidth: "Fluid",

  logo: logo as unknown as string,
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: "智能复杂体系演示验证系统",
  pwa: false,
  iconfontUrl: "",

  layout: "top",
  contentWidth: "Fixed",
  splitMenus: false,
  primaryColor: "#1890ff",
};


export default Settings;
