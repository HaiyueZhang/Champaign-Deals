import { NextPage } from "next";
import {BoughtOverview} from "../../types/types";
import {AxiosResponse} from "axios";
import useSWR from "swr";
import request from "../../utils/request";
import {Box, Container, Flex, Heading, Text} from "@chakra-ui/react";
import React from "react";

const useBoughtItems = () => {
  const { data, error } = useSWR<AxiosResponse>('/api/items/bought', request.get);
  return {
    items: data?.data.list,
    isLoading: !error && !data,
    isError: error,
  }
}


const ManageCard: React.FC<{bought: BoughtOverview}> = ({ bought }) => {
  return (
    <Box
      border="1px solid lightgray"
      w="800px"
      h="160px"
      p="20px"
    >
      <Flex flexDirection="row" mb="10px">
        <Heading size="md" noOfLines={2}>
          {bought.name}
        </Heading>
        <Box flex={1}/>
        <Heading size="md" noOfLines={2} textAlign="right" w="250px">
          {bought.price === bought.origin_price ? (
            <>
              ${bought.price}
            </>
          ) : (
            <>
              <Box textDecoration="line-through">
                ${bought.origin_price}
              </Box>
              <Box>
                ${bought.price}
              </Box>
            </>
          )}
        </Heading>
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        <Text fontSize="14px" noOfLines={1}>
          Bought by {bought.boughtDate}
        </Text>
      </Flex>
    </Box>
  )
}


const BoughtView: NextPage = () => {
    const { items, isLoading, isError } = useBoughtItems();
    return (
      <>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error</div>}
        {items && (
          <Container centerContent py="40px">
            {items.map((bought: BoughtOverview) => (
              <Box key={bought.name} mb="30px">
                <ManageCard
                  bought={bought}
                //   onUpdate={id => router.push(`/item/edit/${id}`)}
                //   onDelete={async () => {
                //     await deleteItem(item.id!);
                //     await updateItems();
                //   }}
                />
              </Box>
            ))}
          </Container>
        )}
      </>
    )
  }
  export default BoughtView;