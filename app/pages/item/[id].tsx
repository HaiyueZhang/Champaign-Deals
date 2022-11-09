import { NextPage } from "next";
import {useRouter} from "next/router";

const Item: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      Item {id}
    </>
  )
}

export default Item;
