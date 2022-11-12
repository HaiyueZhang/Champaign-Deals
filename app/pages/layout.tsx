import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Menu, MenuButton, MenuDivider, MenuItem, MenuList,
  useDisclosure
} from "@chakra-ui/react"
import Link from "next/link"
import styles from "../styles/layout.module.css"
import {SearchIcon} from "@chakra-ui/icons";
import React from "react";
import {useRouter} from "next/router";
import Script from "next/script";
import useSWR from "swr";
import {AxiosResponse} from "axios";
import request from "../utils/request";
import {FocusableElement} from "@chakra-ui/utils";

const useUserInfo = () => {
  const response = useSWR<AxiosResponse>('/api/user', request.get)
  return {
    isLoading: !response.error && !response.data,
    isLoggedIn: Boolean(response.data?.data.email),
    userInfo: response.data?.data
  }
}

const UserActions: React.FC = () => {
  const { isLoading, isLoggedIn, userInfo } = useUserInfo();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<FocusableElement>();
  const router = useRouter();
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        // @ts-ignore
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Login Required
            </AlertDialogHeader>

            <AlertDialogBody>
              Sign in with Google to access this service.
            </AlertDialogBody>

            <AlertDialogFooter>
              {/*// @ts-ignore*/}
              <Button ref={cancelRef} onClick={onClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Box style={{}} mr="20px">
        <Button colorScheme="blue" size="md" onClick={() => {
          if (!isLoading) {
            if (isLoggedIn) {
              router.push("/item/edit/new")
            } else {
              onOpen()
            }
          }
        }}>
          Sell Items
        </Button>
      </Box>
      <Box style={{}} mr="20px">
        <Button size="md" onClick={() => {
          if (!isLoading) {
            if (isLoggedIn) {
              router.push("/item/manage")
            } else {
              onOpen()
            }
          }
        }}>
          Manage Items
        </Button>
      </Box>
      <Box>
        {!isLoading && isLoggedIn && (
          <Menu>
            <MenuButton as={Avatar} colorScheme='pink' size='md' src={userInfo.picture} showBorder />
            <MenuList color="gray.600">
              <MenuItem closeOnSelect={false}>{userInfo.email}</MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={async () => {
                  localStorage.removeItem('api-token');
                  location.replace('/');
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        )}
        {!isLoading && !isLoggedIn && (
          <>
            <Script src="https://accounts.google.com/gsi/client" async defer></Script>
            <Script
              id="script1"
              dangerouslySetInnerHTML={{
                  __html: `
                function handleToken(response) {
                  localStorage.setItem("gis-token", response.credential)
                  location.reload()
                }
              `,
              }}
            />
            <div id="g_id_onload"
                 data-client_id="1016781944203-oo8ijgpmlhug2sce9o37f4jul14e258u.apps.googleusercontent.com"
                 data-callback="handleToken"
                 data-auto_prompt="true"
            />
            <div className="g_id_signin"
                 data-type="standard"
                 data-size="large"
                 data-theme="outline"
                 data-text="sign_in_with"
                 data-shape="rectangular"
                 data-logo_alignment="left"
            />
          </>
        )}
      </Box>
    </>
  )
}

const NavBar: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  return (
    <Flex
      position="fixed"
      top={0}
      width="100%"
      height="65px"
      zIndex="banner"
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
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color='gray.300'/>
          </InputLeftElement>
          <Input
            placeholder='Search'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
      </Box>
      <Box style={{}} mr="20px">
        <Button colorScheme="blue" size="md" onClick={() => router.push("/search?keyword=" + search)}>
          Search
        </Button>
      </Box>
      <Box>
        <Link href={"/discover"}>
          Discover
        </Link>
      </Box>
      <Box flex={1}/>
      <UserActions/>
    </Flex>
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
