import type { NextPage } from 'next';
import {Box, Button, Container, Flex, Heading, Spinner, Text} from "@chakra-ui/react";
import { ItemOverview } from '../types/types';
import {fetchItems} from "../utils/database";
import InfiniteScroll from "react-infinite-scroll-component";
import React, {useState} from "react";
import request from "../utils/request";
import {ConfirmPopover} from "../components/confirm";
import {useRouter} from "next/router";

const ItemCard: React.FC<{ item: ItemOverview, onBuyItem?: () => Promise<any> }> = ({ item, onBuyItem }) => {
  const [loading, setLoading] = useState(false);
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
          published by {item.sellerName} on {item.publishDate}
        </Text>
        <Box flex={1}/>
        {!loading ? (
          <ConfirmPopover
            title="Confirm purchase"
            message="Are you sure you want to purchase this item?"
            onConfirm={async () => {
              setLoading(true);
              await onBuyItem?.();
              setLoading(false);
            }}
            confirmButtonColorScheme="orange"
            confirmButtonText="Confirm Buy"
          >
            <Button colorScheme="orange" size="sm">
              Buy item
            </Button>
          </ConfirmPopover>
        ) : (
          <Spinner color="blue"/>
        )}
      </Flex>
    </Box>
  )
}

export const getServerSideProps = async () => {
  const items: ItemOverview[] = await fetchItems(0);
  return {
    props: {
      items,
    },
  }
}

const Home: NextPage<{ items: ItemOverview[] }> = ({ items: originalItems }) => {
  const [items, setItems] = useState(originalItems)
  const [page, setPage] = useState(0)
  const router = useRouter();

  const fetchMoreItems = async () => {
    const response = await fetch("/api/items?page=" + (page + 1))
    const { items: newItems } = await response.json()
    setItems([...items, ...newItems])
    setPage(page + 1)
  }

  return (
    <Container centerContent py="40px">
      <InfiniteScroll
        dataLength={items.length} //This is important field to render the next data
        next={fetchMoreItems}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {items.map(item => (
          <Box key={item.id} mb="30px">
            <ItemCard item={item} onBuyItem={async () => {
              await request.post(`/api/items/buy?id=${item.id}`)
              await router.push(`/item/bought`)
            }}/>
          </Box>
        ))}
      </InfiniteScroll>
    </Container>
  )
}

export default Home
