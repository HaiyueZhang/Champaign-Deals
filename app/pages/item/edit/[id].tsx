import { NextPage } from "next";
import {fetchItemInfo} from "../../../utils/database";
import {ItemInfo} from "../../../types/types";
import {useState} from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup, InputLeftElement,
  Textarea
} from "@chakra-ui/react";
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
      <Center>
        <Box w="100%" maxW="1000px" py="50px">
          <FormControl mb="20px">
            <FormLabel>Item Name</FormLabel>
            <Input placeholder="Please input item name" value={item.name} onChange={e => setItem({ ...item, name: e.target.value })}/>
          </FormControl>
          <FormControl mb="20px">
            <FormLabel>Item Description</FormLabel>
            <Textarea placeholder="Please input description" value={item.description} onChange={e => setItem({ ...item, description: e.target.value })}/>
          </FormControl>
          <FormControl mb="40px">
            <FormLabel>Item Price</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                color='gray.300'
                fontSize='1.2em'
                children='$'
              />
              <Input placeholder="Please input price" value={item.price} onChange={e => setItem({ ...item, price: e.target.value as unknown as number })}/>
            </InputGroup>
            </FormControl>
          <Button onClick={() => router.replace("/item/manage")} mr="12px">
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={async () => {
            await updateItem(item)
            await router.replace("/item/manage")
          }}>
            {item.id ? "Update" : "Publish"}
          </Button>
        </Box>
      </Center>
    </>
  )
}

export default ItemEdit;
