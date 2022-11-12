import type { NextApiRequest, NextApiResponse } from 'next'
import {TokenUserInfo} from "../../types/types";
import {getTokenUserInfo} from "../../utils/token";
import {getUserFromEmail, insertUser} from "../../utils/database";

type Data = TokenUserInfo | {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userInfo = await getTokenUserInfo(req, res);
  if (userInfo) {
    let user = await getUserFromEmail(userInfo.email);
    if (user == null) {
      user = await insertUser(userInfo);
    }
    res.status(200).json({
      id: user.id,
      ...userInfo
    })
  } else {
    res.status(200).json({});
  }
}
