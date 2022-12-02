import {NextApiRequest, NextApiResponse} from "next";
import {getUserId} from "../../../utils/token";
import {buyItem} from "../../../utils/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = await getUserId(req, res);
  if (!id) {
    res.status(401).end();
  } else {
    await buyItem(id, Number(req.query.id));
    res.status(200).end();
  }
}