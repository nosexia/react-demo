import {
    useGet,
    useGetListProGet,
  } from "./request";
  import type { IDataResponse } from "@/models/data";
  const algorithmList = "/spw/machineLearning/getAlgorithm";
  const taskListUrl = "/spw/machineLearning/getAlgorithmTask";
  export const useGeAlgorithmList = (params: any, filter: any, sort: any) => {
     
    params.algorithmName = params.AlgorithmNameCN;
    delete params.AlgorithmNameCN;
    params.algorithmType = params.AlgorithmTypeCN;
    delete params.AlgorithmTypeCN;

    params.page = params.current;
    delete params.current;

    return useGetListProGet("getAlgorithm", algorithmList, params);
  };

  export const useTaskList = (params: any, filter: any, sort: any) => {
    params.algorithmType = params['task_core_algo_type'];
    delete params['task_core_algo_type'];
    params.page = params.current;
    delete params.current;
    
    return useGetListProGet("getAlgorithmTask", taskListUrl, params);
  };
  
  export const useGetAlgorithmDetail =  (name: string) => {
    return useGet<IDataResponse>(`/spw/machineLearning/getAlgorithm/${name}`);
  };
  