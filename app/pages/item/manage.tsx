import { NextPage } from "next";
import {ItemInfo} from "../../types/types";
import {AxiosResponse} from "axios";
import useSWR from "swr";
import request from "../../utils/request";
import {Box, Button, Container, Flex, Heading, Text} from "@chakra-ui/react";
import { useRouter } from "next/router";

const usePublishedItems = () => {
  const { data, error, mutate } = useSWR<AxiosResponse>('/api/items/published', request.get);
  return {
    items: data?.data.list,
    isLoading: !error && !data,
    isError: error,
    updateItems: mutate
  }
}

const deleteItem = async (id: number) => {
  await request.post(`/api/items/delete?id=${id}`)
}

interface ManageCardProps {
  item: ItemInfo
  onUpdate: (id: number) => void
  onDelete: (id: number) => void
}

const ManageCard: React.FC<ManageCardProps> = ({ item, onUpdate, onDelete }) => {
  return (
    <Box
      border="1px solid lightgray"
      w="800px"
      h="160px"
      p="20px"
    >
      <Flex flexDirection="row" mb="10px">
        <Heading size="md" noOfLines={1}>
          {item.name}
        </Heading>
        <Box flex={1}/>
        <Heading size="md" noOfLines={1} textAlign="right" w="250px">
          ${item.price}
        </Heading>
      </Flex>
      <Text noOfLines={2} mb="10px" height="50px">
        {item.description}
      </Text>
      <Flex flexDirection="row" alignItems="center">
        <Text fontSize="14px" noOfLines={1}>
          published on {item.publishDate}
        </Text>
        <Box flex={1}/>
        <Button size="sm" mr="12px" onClick={() => onUpdate(item.id!)}>
          Update
        </Button>
        <Button size="sm" colorScheme='red' onClick={() => onDelete(item.id!)}>
          Delete
        </Button>
      </Flex>
    </Box>
  )
}

const ItemManage: NextPage = () => {
  const { items, isLoading, isError, updateItems } = usePublishedItems();
  const router = useRouter();
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {items && (
        <Container centerContent py="40px">
          {items.map((item: ItemInfo) => (
            <Box key={item.id} mb="30px">
              <ManageCard
                item={item}
                onUpdate={id => router.push(`/item/edit/${id}`)}
                onDelete={async () => {
                  await deleteItem(item.id!);
                  await updateItems();
                }}
              />
            </Box>
          ))}
        </Container>
      )}
    </>
  )
}

export default ItemManage;
