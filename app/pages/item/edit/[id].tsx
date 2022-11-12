import { NextPage } from "next";
import {useRouter} from "next/router";

export const getServerSideProps = async () => {

}

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
