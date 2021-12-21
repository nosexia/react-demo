import {
  useBatch,
  useCreate,
  useGetList,
  useGet,
  useUpdate,
  useGetListPro,
} from "./request";
import type { IDataResponse } from "@/models/data";
const dataList = "/spw/spwDataSet/list";
export const useGetDataList = (params: any, filter: any, sort: any) => {
  return useGetListPro("spwDataSet", dataList, params, filter, sort);
};

export const useGetDataDetail =  (id: string) => {
  return useGet<IDataResponse>(`/spw/spwDataSet/${id}`);
};
