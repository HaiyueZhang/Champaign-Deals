import {NextApiRequest, NextApiResponse} from "next";
import {getUserId} from "../../../utils/token";
import {deleteItem} from "../../../utils/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = await getUserId(req, res);
  if (!id) {
    res.status(401).end();
  } else {
    await deleteItem(id, Number(req.query.id));
    res.status(200).end();
  }
}