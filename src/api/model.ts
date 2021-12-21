import {
    useGetListProGet,
  } from "./request";
  const simulationListUrl = "/spw/simmanger/modeling";


  export const useSimulationList = (params: any, filter: any, sort: any) => {
    params.page = params.current;
    delete params.current;
    return useGetListProGet("getModelTask", simulationListUrl, params);
  };
  
 
  