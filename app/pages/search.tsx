import {NextPage} from "next";
import {useRouter} from "next/router";
import {searchItem} from "../utils/database";
import {ItemOverview} from "../types/types";

export const getServerSideProps = async (context: any) => {
  const items = await searchItem(context.query.keyword);
  return {
    props: {
      items,
    }
  }
}

const Search: NextPage<{ items: ItemOverview[] }> = ({ items }) => {
  const router = useRouter()
  const { keyword } = router.query
  return (
    <>
      Search {keyword}
      {items.map(item => item.name)}
    </>
  )
}

export default Search;
