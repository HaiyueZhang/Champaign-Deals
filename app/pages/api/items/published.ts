import type { NextApiRequest, NextApiResponse } from 'next'
import {ItemOverview} from "../../../types/types";
import {getUserId} from "../../../utils/token";
import {fetchPublishedItems} from "../../../utils/database";

type Data = {
  list: ItemOverview[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | {}>
) {
  const id = await getUserId(req, res);
  if (!id) {
    res.status(401).end();
  } else {
    const list = await fetchPublishedItems(id);
    res.status(200).json({list});
  }
}
