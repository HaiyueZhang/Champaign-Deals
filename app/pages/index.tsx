import type { NextPage } from 'next';
import {Box, Container, Flex, Heading, Text} from "@chakra-ui/react";
import { ItemOverview } from '../types/types';
import Link from 'next/link';
import {fetchItems} from "../utils/database";
import InfiniteScroll from "react-infinite-scroll-component";
import React, {useState} from "react";

const ItemCard: React.FC<{ item: ItemOverview }> = ({ item }) => {
  return (
    <Link href={`/item/${item.id}`}>
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
          published by {item.sellerName} on {item.publishDate}
        </Text>
      </Box>
    </Link>
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
            <ItemCard item={item}/>
          </Box>
        ))}
      </InfiniteScroll>
    </Container>
  )
}

export default Home
