import { NextPage } from "next";
import {ItemOverview} from "../../types/types";
import {AxiosResponse} from "axios";
import useSWR from "swr";
import request from "../../utils/request";

const usePublishedItems = () => {
  const { data, error } = useSWR<AxiosResponse>('/api/items/published', request.get);
  return {
    items: data?.data.items,
    isLoading: !error && !data,
    isError: error
  }
}

const deleteItem = async (id: string) => {
  await request.post(`/api/items/delete?id=${id}`)
}

const ItemManage: NextPage = () => {
  const { items, isLoading, isError } = usePublishedItems();
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {items && items.map((item: ItemOverview) => (
        <>
          <div>{item.name}</div>
        </>
      ))}
    </>
  )
}

export default ItemManage;
