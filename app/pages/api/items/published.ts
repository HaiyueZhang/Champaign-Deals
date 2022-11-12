import type { NextApiRequest, NextApiResponse } from 'next'
import {ItemOverview} from "../../../types/types";

type Data = {
  list: ItemOverview[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200)
}
