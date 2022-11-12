import {NextApiRequest, NextApiResponse} from "next";
import {getUserId} from "../../../utils/token";
import {insertItem, updateItem} from "../../../utils/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = await getUserId(req, res);
  if (!id) {
    res.status(401).end();
  } else {
    const itemInfo = req.body;
    if (itemInfo.id) {
      await updateItem(itemInfo);
    } else {
      itemInfo.sellerId = id;
      itemInfo.publishDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await insertItem(itemInfo);
    }
    res.status(200).end();
  }
}