import mysql from 'mysql'
import {ItemOverview} from "../types/types";

const db = mysql.createConnection({
  host: process.env.NEXT_PUBLIC_MYSQL_HOST,
  user: process.env.NEXT_PUBLIC_MYSQL_USER,
  password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
  database: process.env.NEXT_PUBLIC_MYSQL_DATABASE
})

function query(sql: string, params: any[] = []): Promise<any> {
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

export async function fetchItems(page: number): Promise<ItemOverview[]> {
  return await query("SELECT * FROM Item ORDER BY publishDate DESC LIMIT 20 OFFSET ?", [page * 10])
}
