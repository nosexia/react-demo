import React, { FC } from "react";

// import LoginPage from "@/pages/login";
import LayoutPage from "@/pages/layout";
import WrapperRouteComponent from "./config";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";

//TODO: lazy加载组件，prolayout的菜单无法自动选中菜单项，原因不明
// const NotFound = lazy(() => import('@/pages/404'));
// const AccountPage = lazy(() => import('@/pages/account'));
// const Project = lazy(() => import('@/pages/project'));

import Home from "@/pages/home";
import NotFound from "@/pages/404";
//模型
import Model from "@/pages/model";
import ModelScene from "@/pages/modescene";
import ModelList from "@/pages/model/pages/list";
//案例
import Sample from "@/pages/sample";
//算法
import ArithmeticPage from '@/pages/arithmetic'
import ArithmeticList from "@/pages/arithmetic/pages/list";
import ArithmeticDetail from '@pages/arithmetic/pages/detail';
import ArithmeticStepForm from '@/pages/arithmetic/pages/stepForm'
//数据
import DataList from '@/pages/data/pages/list'
import DataPage from '@/pages/data'
import DataDetail from '@/pages/data/pages/detail'
import Export from '@/pages/data/pages/export'
import Browsing from '@pages/data/pages/browsing'
import Import from '@pages/data/pages/import';
import EditDetail from '@pages/data/pages/detail-edit';

//图表
import AreaChart from '@pages/data/pages/browsing/pages/area-chart';
import BarGraph from '@pages/data/pages/browsing/pages/bar-graph';
import DataAggregation from '@pages/data/pages/browsing/pages/data-aggregation';
import Histogram from '@pages/data/pages/browsing/pages/histogram';
import LineChart from '@pages/data/pages/browsing/pages/line-chart';
import LineCharts from '@pages/data/pages/browsing/pages/line-charts';
import PieChart from '@pages/data/pages/browsing/pages/pie';
import ScatterPlot from '@pages/data/pages/browsing/pages/scatter-plot';
import { setNavigate } from "@api/request";
import TaskList from "@pages/arithmetic/pages/task-list";
import Simulation from "@pages/model/pages/simulation";

//异步加载
const LoginPage = React.lazy(() => import('@/pages/login'))

const routeList: any[] = [
  {
    path: "/login",
    element: <WrapperRouteComponent element={<LoginPage />} />,
  },
  {
    path: "/",
    element: <WrapperRouteComponent element={<LayoutPage />} />,
    children: [
      {
        path: "/home",
        element: <WrapperRouteComponent element={<Home />} />,
        children: [

        ]
      },
      {
        path: "/sample",
        element: <WrapperRouteComponent element={<Sample />} />,
      },
      {
        path: "/model/*",
        element: <WrapperRouteComponent auth={true} element={<Model />} />,
        children: [
          {
            path: "/simulation",
            element: <WrapperRouteComponent element={<Simulation />} />,
          },
          {
            path: '/:id',
            element: <WrapperRouteComponent element={<ModelList />} />,
          }
        ],
      },

      {
        path: "/arithmetic",
        element: <WrapperRouteComponent element={<ArithmeticPage />} />,
        children: [
          {
            path: '/task-list',
            element: <WrapperRouteComponent element={<TaskList />} />,
          },
          {
            path: '/list',
            element: <WrapperRouteComponent element={<ArithmeticList />} />,
          },
          {
            path: '/stemForm',
            element: <WrapperRouteComponent element={<ArithmeticStepForm />} />,
          },
          {
            path: '/detail/',
            element: <WrapperRouteComponent element={<ArithmeticDetail />} />,
          }
        ]
      },
      {
        path: '/data',
        element: <WrapperRouteComponent element={<DataPage />} />,
        children: [
          {
            path: '/list',
            element: <WrapperRouteComponent element={<DataList />} />,
          },
          {
            path: '/export',
            element: <WrapperRouteComponent element={<Export />} />,
          },
          {
            path: '/import',
            element: <WrapperRouteComponent element={<Import />} />,
          },
          {
            path: '/browsing/chart',
            element: <WrapperRouteComponent element={<Browsing />} />,
            children: [
              // {
              //   path: '/area-chart',
              //   element: <WrapperRouteComponent element={<AreaChart />} />,
              // },
              // {
              //   path: '/bar-graph',
              //   element: <WrapperRouteComponent element={<BarGraph />} />,
              // },
              // {
              //   path: '/data-aggregation',
              //   element: <WrapperRouteComponent element={<DataAggregation />} />,
              // },
              // {
              //   path: '/line-chart',
              //   element: <WrapperRouteComponent element={<LineChart />} />,
              // },
              // {
              //   path: '/line-charts',
              //   element: <WrapperRouteComponent element={<LineCharts />} />,
              // },
              // {
              //   path: '/histogram',
              //   element: <WrapperRouteComponent element={<Histogram />} />,
              // },
              // {
              //   path: '/pie-chart',
              //   element: <WrapperRouteComponent element={<PieChart />} />,
              // },
              // {
              //   path: '/scatter-plot',
              //   element: <WrapperRouteComponent element={<ScatterPlot />} />,
              // },
            ]
          },
          {
            path: '/detail/edit/:id',
            element: <WrapperRouteComponent element={<EditDetail />} />,
          },
          {
            path: '/detail/:id',
            element: <WrapperRouteComponent element={<DataDetail />} />,
          }
        ]
      },
      {
        path: "*",
        element: <WrapperRouteComponent element={<NotFound />} />,
      },
    ],
  },
];
const RenderRouter: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  setNavigate(navigate, location)
  const element = useRoutes(routeList);
  return element;
};

export default RenderRouter;
