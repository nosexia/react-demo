import {
  useBatch,
  useCreate,
  useGetList,
  useGetOne,
  useUpdate,
} from "./request";
import { CardGroup, Card } from "@/models/home";

export const useGetCardList = () => {
  return useGetOne<CardGroup[]>(
      'CardGroup',
      '/home/list'
  );
};
