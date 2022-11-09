import {Avatar, Box, Button, Input, InputGroup, InputLeftElement} from "@chakra-ui/react"
import Link from "next/link"
import styles from "../styles/layout.module.css"
import {SearchIcon} from "@chakra-ui/icons";
import React from "react";

const NavBar: React.FC = () => {
  return (
    <Box
      position="fixed"
      top={0}
      width="100%"
      height="65px"
      zIndex={1000}
      display="flex"
      alignItems="center"
      pl="30px"
      pr="40px"
      bg="white"
      borderBottom={1}
      borderBottomStyle="solid"
      borderBottomColor="gray.300"
    >
      <Box className={styles.navTitle} mr="20px">
        <Link href="/">
          Champaign Deals
        </Link>
      </Box>
      <Box mr="20px">
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
          >
            <SearchIcon color='gray.300'/>
          </InputLeftElement>
          <Input placeholder='Search'/>
        </InputGroup>
      </Box>
      <Box>
        <Link href={"/discover"}>
          Discover
        </Link>
      </Box>
      <Box flex={1}/>
      <Box style={{}} mr="20px">
        <Link href={"/item/edit/new"}>
          <Button colorScheme="blue" size="md">
            Sell Items
          </Button>
        </Link>
      </Box>
      <Box style={{}} mr="20px">
        <Link href={"/item/manage"}>
          <Button size="md">
            Manage Items
          </Button>
        </Link>
      </Box>
      <Box>
        <Avatar/>
      </Box>
    </Box>
  )
}

const Footer = () => {
  return (
    <div style={{ width: "100%", padding: "30px", textAlign: "center", color: "gray" }}>
      Copyright © 2022 Champaign Deals
    </div>
  )
}

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <>
      <NavBar/>
      <div style={{ paddingTop: "65px" }}>
        {children}
      </div>
      <Footer/>
    </>
  )
}

export default Layout
