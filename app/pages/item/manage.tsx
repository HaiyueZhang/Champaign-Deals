import { NextPage } from "next";
import {ItemInfo} from "../../types/types";
import {AxiosResponse} from "axios";
import useSWR from "swr";
import request from "../../utils/request";
import {
  Box, Button, Container, Flex, Heading, Spinner, Tag, Text
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import {ConfirmPopover} from "../../components/confirm";

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
        <Heading size="md" noOfLines={1} mr="10px">
          {item.name}
        </Heading>
        {item.status === 'available' && (
          <Tag colorScheme="green">Available</Tag>
        )}
        {item.status === 'sold out' && (
          <Tag colorScheme="red">Sold Out</Tag>
        )}
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
        <ConfirmPopover
          title="Delete item"
          message="Are you sure you want to delete this item?"
          onConfirm={() => onDelete(item.id!)}
          confirmButtonColorScheme="red"
          confirmButtonText="Delete"
        >
          <Button size="sm" colorScheme='red'>
            Delete
          </Button>
        </ConfirmPopover>
      </Flex>
    </Box>
  )
}

const ItemManage: NextPage = () => {
  const { items, isLoading, isError, updateItems } = usePublishedItems();
  const router = useRouter();
  return (
    <>
      {isLoading && (
        <Container centerContent py="100px">
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Container>
      )}
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
      {items && items.length == 0 && (
        <Container centerContent py="40px">
          <Text fontSize="xl">You have not published any items yet.</Text>
        </Container>
      )}
    </>
  )
}

export default ItemManage;
