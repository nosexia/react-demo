import { createContext, useContext, useEffect, useState } from "react";
import Axios, { AxiosInstance, AxiosTransformer } from "axios";
import { message, notification } from "antd";
import { createBrowserHistory } from "history";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { stringify } from "querystring";
//安全的带检查的操作字符串转换的库
import qs from "qs";
// export const base = "http://10.10.10.30:18866";
export const base = "/dev-api";
//配置上传
export const uploadUrl = base + "/common/upload";
//配置axios实例
export  const axios = Axios.create({
  //这里需要根据现有环境进行配置，后续查看如何配置更合适
  baseURL: base + "/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});


//保存路由跳转
let navigate: any = null;
let location: any = null;

export const setNavigate = (navi: any, loca: any) => {
  navigate = navi;
  location = loca;
};

//请求拦截器header增加本地token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

//响应拦截器
axios.interceptors.response.use(
  (response) => {
    // console.log("response:", response); //调试用
    //status信息请求状态如果为200代表成功，可以根据后续的错误信息反馈来做错误响应
    const data = response.data;
    //响应代码需要根据data中的code判断
    if (data.code === 200) {
      return data;
    }

    notification.error({
      message: `请求错误${data.code}`,
      description: `${data.msg}`,
    });

    if (data.code === 401) {
      if (location.pathname !== "/login") {
        navigate(`/login?redirect=${location.pathname}${location.search}`);
      }

      //强制刷新
      // history.go(0);
    }
    return Promise.resolve(data);
  },
  (error) => {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        //401：未登录
        //未登录则跳转到登陆页面，并携带当前页面的路径
        //在登陆成功后返回当前页面，这一步需要在登录页操作
        case "401":
          if (location.pathname !== "/login") {
          navigate("/login", {
            search: stringify({
              redirect: location.pathname + location.search,
            }),
          });
        }
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空Recoil中token对象
        // 跳转登录页面
        case 403:
          navigate("/login");
          break;
        // 404请求不存在
        case 404:
          notification.error({
            message: `请求不存在`,
            description: error.response.data?.msg || "Error",
          });
          break;
        case 406:
          notification.error({
            message: `请求参数有误`,
            description: error.response.data?.msg || "Error",
          });
          break;
        default:
          notification.error({
            message: `请求错误`,
            description: error.response.data?.msg || "Error",
          });
      }
    }
    //向外抛出错误
    // return Promise.reject(error);
    //请求错误不应该抛出异常，提示即可
    return Promise.resolve(error);
    // return null
  }
);

//创建Context对象,用来传递axios给子组件使用
export const AxiosContext = createContext<AxiosInstance>(
  new Proxy(axios, {
    apply: () => {
      throw new Error("必须将组件包裹在AxiosProvider组件中");
    },
    get: () => {
      throw new Error("必须将组件包裹在AxiosProvider组件中");
    },
  })
);

//获取context的当前值
export const useAxios = () => {
  return useContext(AxiosContext);
};

//转换分页
const transformPagination = (pagination: any) => {
  if (!pagination) return;

  const current = pagination.current
    ? pagination.current
    : pagination.defaultCurrent;
  const pageSize = pagination.pageSize
    ? pagination.pageSize
    : pagination.defaultPageSize;

  let offset = 0;
  if (current && pageSize) {
    offset = (current - 1) * pageSize;
  }

  return {
    offset,
    limit: pageSize,
  };
};

//转换过滤
const transformFilters = (filters: any) => {
  if (!filters) return;
  let result: any[] = [];
  for (let key in filters) {
    if (!filters[key] || filters[key] === null) continue;
    result = [...result, [key + ":eq:" + filters[key]]];
  }
  return result;
};

//转换排序
const transformSorter = (sorter: any) => {
  if (!sorter) return;

  let result = "";
  if (sorter.field && sorter.order) {
    let order: string = "desc";
    if (sorter.order === "ascend") order = "asc";
    result = sorter.field + " " + order;
  }

  return result;
};

/**
 * pro-table请求封装
 */
const useGetListPro = async <T>(
  key: string,
  url: string,
  params?: any,
  filters?: any,
  sorter?: any
) => {
  const transformRequest: AxiosTransformer = (data, header) => {};
  let res: any = await axios.post(url, {
    ...params,
    filter: filters,
    order: sorter,
    paramsSerializer: (params: any) => {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
    transformRequest,
  });
  return {
    data: res.rows,
    success: res.code === 200,
    total: res.total ?? res.total_results,
  };
};
/**
 * pro-table请求封装
 * 这里又换成get请求的方式了
 */
export const useGetListProGet = async <T>(
  key: string,
  url: string,
  params?: any
) => {
  let res: any = await axios.get(url, {
    params: { ...params },
  });
  return {
    data: res.data,
    success: res.code === 200,
    total: res.total ?? res.total_results,
  };
};

export const getSelectListOne = async <T>(
  key: string,
  url: string,
  params?: T
) => {
  try {
    let res: any = await axios.get(url, {
      params: params ? { ...params } : {},
    });
    if (res.code === 200) {
      return res.data;
    }
  } catch (e) {}

  return [];
};

export const post = async (url: string, data?: any,headers={}) => {
  try {
    let res: any = await axios.post(url, {...(data || {}) });
    return res;
  } catch (e) {
    return e;
  }
};

export const get = async (url: string, params?: any) => {
  try {
    let res: any = await axios.get(url, { ...(params || {}) });
    return res;
  } catch (e) {
    return e;
  }
};

type listParams = {
  limit?: number;
  offset?: number;
  filter?: string[];
  order?: string;
};

const useGetList = <T>(
  key: string,
  url: string,
  pagination?: any,
  filters?: any,
  sorter?: any
) => {
  const axios = useAxios();
  const service = async () => {
    let params: listParams = {};

    params = { ...transformPagination(pagination) };
    params.filter = transformFilters(filters);
    params.order = transformSorter(sorter);

    const transformRequest: AxiosTransformer = (data, header) => {};
    let dataP = axios.get(`${url}`, {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
      transformRequest,
    });
    return dataP;
  };
  return useQuery(key, () => service());
};

const useGetOne = <T>(key: string, url: string, params?: any) => {
  const axios = useAxios();

  const service = async () => {
    const data: T = await axios.get(`${url}`, params);
    return data;
  };
  return useQuery(key, () => service());
};

export const useRequest = (method: string, url: string, params?: any) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const service = async () => {
    const res: any = await axios.get(`${url}`, params);
    setLoading(false);
    if (res && res.code === 200) {
      setData(res.data);
    } else {
      setError(res);
    }
  };

  useEffect(() => {
    setLoading(true);
    service();
  }, []);

  return {
    loading,
    data,
    error,
  };
};

export const useGet = <T>(url: string, params?: any) => {
  return useRequest("get", url, params);
};

const useCreate = <T, U>(url: string) => {
  const axios = useAxios();
  return useMutation(async (params: T) => {
    const data: U = await axios.post(`${url}`, params);
    return data;
  });
};

const useUpdate = <T>(url: string) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (item: T) => {
    const data: T = await axios.patch(`${url}`, item);
    return data;
  });
};

const useDelete = <T>(url: string) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (id: number) => {
    const data: T = await axios.delete(`${url}?id=${id}`);
    return data;
  });
};

const useBatch = (url: string) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (ids: number[]) => {
    const data = await axios.post(`${url}`, { idList: ids });
    return data;
  });
};

export {
  useGetOne,
  useGetList,
  useUpdate,
  useCreate,
  useDelete,
  useBatch,
  useGetListPro,
};

export default axios;
