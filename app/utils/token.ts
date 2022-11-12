import {NextApiRequest, NextApiResponse} from "next";
import {OAuth2Client} from 'google-auth-library';
import jwt from 'jsonwebtoken';
import {TokenUserInfo, User} from "../types/types";
import {getUserFromEmail} from "./database";

const CLIENT_ID = process.env.NEXT_PUBLIC_GIS_CLIENT_ID as string
const JWT_SECRET = process.env.JWT_SECRET as string

const GIS_TOKEN_KEY = "gis-token"
const API_TOKEN_KEY = "api-token"
const SET_API_TOKEN_KEY = "set-api-token";

const client = new OAuth2Client(CLIENT_ID);

async function verifyGISToken(token: string): Promise<TokenUserInfo> {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload()!;
  return {  // filter out unnecessary information
    name: payload.name!,
    email: payload.email!,
    picture: payload.picture!
  };
}

function decodeJWT(token: string): TokenUserInfo {
  return jwt.verify(token, JWT_SECRET) as TokenUserInfo;
}

function signJWT(userInfo: TokenUserInfo): string {
  return jwt.sign(userInfo, JWT_SECRET);
}

export async function getTokenUserInfo(req: NextApiRequest, res: NextApiResponse): Promise<TokenUserInfo | null> {
  const gisToken = req.headers[GIS_TOKEN_KEY] as string;
  if (gisToken) {
    try {
      const userInfo = await verifyGISToken(gisToken);
      const token = signJWT(userInfo);
      res.setHeader(SET_API_TOKEN_KEY, token);
      return userInfo;
    } catch (e) {
      console.log("Failed to verify GIS token", e);
      return null;
    }
  }
  const apiToken = req.headers[API_TOKEN_KEY] as string;
  if (apiToken) {
    try {
      return decodeJWT(apiToken);
    } catch (e) {
      console.log("Failed to decode API token", e);
      return null;
    }
  }
  return null;
}

export async function getUser(req: NextApiRequest, res: NextApiResponse): Promise<User | null> {
  const tokenUserInfo = await getTokenUserInfo(req, res);
  if (tokenUserInfo) {
    return getUserFromEmail(tokenUserInfo.email);
  }
  return null;
}

export async function getUserId(req: NextApiRequest, res: NextApiResponse): Promise<number | null> {
  const user = await getUser(req, res);
  return user?.id ?? null;
}
