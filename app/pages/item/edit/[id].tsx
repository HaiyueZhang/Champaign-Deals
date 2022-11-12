import { NextPage } from "next";
import {fetchItemInfo} from "../../../utils/database";
import {ItemInfo} from "../../../types/types";
import {useState} from "react";
import {Button, Input, Textarea} from "@chakra-ui/react";
import {useRouter} from "next/router";
import request from "../../../utils/request";

export const getServerSideProps = async (context: any) => {
  if (context.query.id === "new") {
    return { props: { item: {} } }
  } else {
    return { props: { item: await fetchItemInfo(context.query.id) } }
  }
}

const updateItem = async (itemInfo: ItemInfo) => {
  await request.post(`/api/items/edit`, itemInfo)
}

const ItemEdit: NextPage<{ item: ItemInfo }> = ({ item: initialItem }) => {
  const [ item, setItem ] = useState(initialItem);
  const router = useRouter();
  return (
    <>
      Edit Item
      <Input placeholder="Item name" value={item.name} onChange={e => setItem({ ...item, name: e.target.value })}/>
      <Textarea placeholder="Description" value={item.description} onChange={e => setItem({ ...item, description: e.target.value })}/>
      <Input placeholder="Price" value={item.price} onChange={e => setItem({ ...item, price: e.target.value as unknown as number })}/>
      <Button onClick={() => router.replace("/item/manage")}>
        Cancel
      </Button>
      <Button colorScheme="blue" onClick={async () => {
        await updateItem(item)
        await router.replace("/item/manage")
      }}>
        {item.id ? "Update" : "Publish"}
      </Button>
    </>
  )
}

export default ItemEdit;
