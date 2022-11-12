import mysql from 'mysql'
import {ItemOverview, TokenUserInfo, User} from "../types/types";

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

function query<T>(sql: string, params: any[] = []): Promise<T> {
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      params,
      (error, results, _) => {
        if (!error) {
          resolve(JSON.parse(JSON.stringify(results)))  // convert mysql RowDataPacket to JavaScript object
        } else {
          reject(error)
        }
      }
    )
  })
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const users = await query<User[]>(`SELECT * FROM User WHERE email = ?`, [email]);
  if (users.length === 0) {
    return null;
  }
  return users[0];
}

export async function insertUser(user: TokenUserInfo): Promise<User> {
  return await query(`INSERT INTO User (id, email, name, description) SELECT MAX(id) + 1, ?, ?, ? FROM User`, [user.email, user.name, ""]);
}

export async function fetchItems(page: number): Promise<ItemOverview[]> {
  return await query("SELECT * FROM Item ORDER BY publishDate DESC LIMIT 20 OFFSET ?", [page * 20])
}

export async function fetchItem(id: number): Promise<ItemOverview> {
  return await query("SELECT * FROM Item WHERE id = ?", [id])
}

export async function searchItem(keyword: string): Promise<ItemOverview[]> {
  return await query("SELECT * FROM Item WHERE name LIKE ? OR description LIKE ? ORDER BY publishDate DESC", [`%${keyword}%`, `%${keyword}%`])
}
