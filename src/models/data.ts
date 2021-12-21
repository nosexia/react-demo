export interface IData {
  id: string;
  summary: string;
  summaryImg: string;
  detail: string;
  detailImg: string,
}

export interface IDataSet {
  id: string;
  imgUrl: string;
  name: string;
  DataList: IData[];
}

export interface IDataResponse{
    data: IDataSet
    type: 'success' | 'error';
    code: number
}
