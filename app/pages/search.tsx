import {NextPage} from "next";
import {useRouter} from "next/router";
import {searchItem} from "../utils/database";
import {ItemOverview} from "../types/types";
import {Box, Container, Flex, Heading, Text} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import React, {useState} from "react";

export const getServerSideProps = async (context: any) => {
  const items = await searchItem(context.query.keyword);
  return {
    props: {
      items,
    }
  }
}
const SearchCard: React.FC<{ item: ItemOverview }> = ({ item }) => {
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
  

const Search: NextPage<{ items: ItemOverview[] }> = ({ items:originalItems }) => {
  const router = useRouter()
  const { keyword } = router.query
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
      Searching for "{keyword}"
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
            <SearchCard item={item}/>
          </Box>
        ))}
        </InfiniteScroll>
    </Container>
  )
}

export default Search;
