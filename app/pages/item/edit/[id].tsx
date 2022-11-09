import { NextPage } from "next";
import {useRouter} from "next/router";

const ItemEdit: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      Edit Item {id}
    </>
  )
}

export default ItemEdit;
