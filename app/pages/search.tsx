import {NextPage} from "next";
import {useRouter} from "next/router";
import {searchItem} from "../utils/database";
import {ItemOverview} from "../types/types";
import {Box, Container, Flex, Heading, Text} from "@chakra-ui/react";

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
          published by {item.sellerName} on {item.publishDate}
        </Text>
      </Box>
  )
}
  

const Search: NextPage<{ items: ItemOverview[] }> = ({ items }) => {
  const router = useRouter()
  const { keyword } = router.query
  return (
    
    <Container centerContent py="40px">
      Searching for "{keyword}"
        {items.map(item => (
          <Box key={item.id} mb="30px">
            <SearchCard item={item}/>
          </Box>
        ))}
    </Container>
  )
}

export default Search;
