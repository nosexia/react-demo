// 边的类型
export enum EdgeType {
  RESIDENT = 'resident',
  WORKSPACE = 'workSpace',
  STREET = 'street',
  CROSS = 'cross',
}

// 边的数据类型
export type EdgeData = {
  type: EdgeType;
  id: number;
  points: number[][];
}

// 静态数据类型
export type StaticInfo = {
  scenarioIdx: number;
  edges: EdgeData[];
  backgroundUrl: string;
};

// veh的类型
export enum VehType {
  TRUCK = 'truck',
  CAR = 'car',
  TAXI = 'taxi',
}

// veh数据类型
export type VehData =  {
  id: number;
  pos: number[];
  currentStreet: number;
  currentSide: string;
  type: string;
}

// people数据类型
export type PeopleData = {
  id: number;
  pos: number[];
  currentStreet: number;
  currentSide: string;
}

// 动态数据类型
export type DynamicInfo = {
  veh: VehData[];
  people: PeopleData[];
}