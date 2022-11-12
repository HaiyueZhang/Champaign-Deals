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
  return await query("SELECT * FROM Item ORDER BY publishDate DESC LIMIT 20 OFFSET ?", [page * 20])
}

export async function fetchItem(id: number): Promise<ItemOverview> {
  return await query("SELECT * FROM Item WHERE id = ?", [id])
}

export async function searchItem(keyword: string): Promise<ItemOverview[]> {
  return await query(`
    SELECT *
    FROM Item
    WHERE name LIKE ? OR description LIKE ?
    ORDER BY publishDate DESC
  `, [`%${keyword}%`, `%${keyword}%`])
}

export async function bestSeller(){
  return await query(`(SELECT u.id, u.name as sellerName, SUM(Price) as turnover
  FROM project.User u JOIN project.Transaction T ON (u.id = T.sellerId) JOIN project.Item I  USING (id) 
  WHERE EXISTS(
      SELECT *
      FROM project.User u2 JOIN project.Item I2  USING (id)
      WHERE publishDate >= 2020 AND u2.id = u.id AND T.status = "completed"
  )
  GROUP BY u.id
  )
  
  UNION
  
  (SELECT u.id, u.name as sellerName, SUM(Price) as turnover
  FROM project.User u JOIN project.Item I  USING (id) JOIN project.Transaction T ON (I.id = T.sellerId)
  WHERE EXISTS(
    SELECT T.sellerId
    FROM project.Item I2 JOIN project.Comment c ON (I2.id = c.id) JOIN project.Transaction T ON (I2.id = T.sellerId)
      WHERE T.status = "completed"
    GROUP BY T.sellerId
    HAVING COUNT(*) > 3
  )
  GROUP BY u.id)
  ORDER BY turnover DESC
  LIMIT 20;
  `
)
}

export async function cheapCategory() {
  return await query(`SELECT c.name, COUNT(*) AS Num_Item
  FROM project.Category c JOIN (
    SELECT i.id, i.categoryId FROM project.Item i
       WHERE i.price < 5 AND i.status = 'available'
  ) as subtable ON c.id = subtable.categoryId
  GROUP BY c.name
  ORDER BY Num_Item DESC
  LIMIT 20;
  `)
}