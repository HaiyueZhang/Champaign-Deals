import {ItemOverview} from "../../../types/types";
import {NextApiRequest, NextApiResponse} from "next";
import {searchItem} from "../../../utils/database";

type Data = {
  list: ItemOverview[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | {}>
) {
  const list = await searchItem(req.query.keyword as string);
  res.status(200).json({list});
}
