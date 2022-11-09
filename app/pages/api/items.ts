// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {fetchItems} from "../../utils/database";
import {ItemOverview} from "../../types/types";

type Data = {
  items: ItemOverview[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    items: await fetchItems(req.query.page as unknown as number ?? 0)
  })
}
