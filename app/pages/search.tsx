import {NextPage} from "next";
import {useRouter} from "next/router";
import {ItemOverview} from "../types/types";
import {Box, Container, Flex, Heading, Text} from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import axios, {AxiosResponse} from "axios";

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
          published by {item.sellerName} on {item.publishDate}
        </Text>
      </Box>
  )
}

const useSearchResult = (query: string) => {
  const { data, error } = useSWR<AxiosResponse>('/api/items/search?keyword=' + query, axios.get)
  return {
    items: data?.data.list,
    isLoading: !error && !data,
    isError: error
  }
}

const Search: NextPage = () => {
  const router = useRouter()
  const { keyword } = router.query
  const { items, isLoading, isError } = useSearchResult(keyword as string)

  return (
    <Container centerContent py="40px">
      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error</Text>}
      {items && (
        <>
          <Box mb="20px">
            Searching for "{keyword}"
          </Box>
          {items.map((item: ItemOverview) => (
            <Box key={item.id} mb="30px">
              <SearchCard item={item}/>
            </Box>
          ))}
        </>
      )}
    </Container>
  )
}

export default Search;
