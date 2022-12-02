import type { NextApiRequest, NextApiResponse } from 'next'
import {BoughtOverview} from "../../../types/types";
import {getUserId} from "../../../utils/token";
import {fetchBoughtItems} from "../../../utils/database";

type Data = {
  list: BoughtOverview[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | {}>
) {
  const id = await getUserId(req, res);
  if (!id) {
    res.status(401).end();
  } else {
    const list = await fetchBoughtItems(id);
    res.status(200).json({list});
  }
}
