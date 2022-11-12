import { NextPage } from "next";
import {ItemOverview} from "../../types/types";
import {AxiosResponse} from "axios";
import useSWR from "swr";
import request from "../../utils/request";
import {Box, Button, Container, Flex, Heading, Text} from "@chakra-ui/react";


const usePublishedItems = () => {
  const { data, error, mutate } = useSWR<AxiosResponse>('/api/items/published', request.get);
  return {
    items: data?.data.items,
    isLoading: !error && !data,
    isError: error,
    updateItems: mutate
  }
}

const deleteItem = async (id: number) => {
  await request.post(`/api/items/delete?id=${id}`)
}

const ManageCard: React.FC<{ item: ItemOverview }> = ({ item }) => {
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
        <Text fontSize="14px" noOfLines={1}>
          published by {item.publisherName} on {item.publishDate}
        </Text>
      </Box>
  )
}

const ItemManage: NextPage = () => {
  // const { items, isLoading, isError, updateItems } = usePublishedItems();
  //临时
  const updateItems = () => {

  }

  const items = [
    {
    id: 369,
    name: "testName",
    description: "testDescrp",
    price: 369,
    publisherName: "user",
    publishDate: "3/6/9"
    },
    {
      id: 957,
      name: "testName2",
      description: "testDescrp2",
      price: 2200,
      publisherName: "user2",
      publishDate: "4/3/22"
      }
  ]

  return (
    
    <Container centerContent py="40px">
        {items.map(item => (
          <Box key={item.id} mb="30px">
            <ManageCard item={item}/>
            <Button colorScheme='red'onClick={async () => {
              await deleteItem(item.id);
              updateItems();
            }}>
              Delete
            </Button>
          </Box>
        ))}
    </Container>
  )
  // return (
  //   <>
  //     {isLoading && <div>Loading...</div>}
  //     {isError && <div>Error</div>}
  //     {items && items.map((item: ItemOverview) => (
  //       <>
  //         <div>{item.name}</div>
  //       </>
  //     ))}
  //   </>
  // )
}

export default ItemManage;
