import { NextPage } from "next";
import {Button} from "@chakra-ui/react";
import React, {useState} from "react";

const Page1: React.FC = () => {
  return (
    <>
      <h1>Page 1</h1>
    </>
  )
}

const Page2: React.FC = () => {
  return (
    <>
      <h1>Page 2</h1>
      Something else <br/>
      aashudasiudu
    </>
  )
}

const Discover: NextPage = () => {
  const [page, setPage] = useState(1);
  if (page == 1) {
    return (
      <>
        <Button colorScheme='blue' onClick={() => setPage(1)}>Button 1</Button>
        <Button colorScheme='blue' onClick={() => setPage(2)}>Button 2</Button>
        <Page1/>
      </>
    )
  }
  return (
    <>
      <Button colorScheme='blue' onClick={() => setPage(1)}>Button 1</Button>
      <Button colorScheme='blue' onClick={() => setPage(2)}>Button 2</Button>
      <Page2/>
    </>
  )
}

export default Discover;