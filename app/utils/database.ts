import mysql from 'mysql'
import {ItemInfo, ItemOverview, TokenUserInfo, User} from "../types/types";

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

function beginTransaction(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.beginTransaction(
      (error) => {
        if (!error) {
          resolve()
        } else {
          reject(error)
        }
      }
    )
  })
}

function commit(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.commit(
      (error) => {
        if (!error) {
          resolve()
        } else {
          reject(error)
        }
      }
    )
  })
}

function rollback(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.rollback(
      (error) => {
        if (!error) {
          resolve()
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
  return await query(`
    SELECT I.*, U.name AS sellerName
      FROM Item I JOIN User U ON I.sellerId = U.id
      WHERE I.status = 'available'
      ORDER BY publishDate DESC
      LIMIT 20 OFFSET ?
  `, [page * 20])
}

export async function fetchBoughtItems(userId: number): Promise<ItemOverview[]> {
  return await query("SELECT T.price, I.price as origin_price, T.date as boughtDate, I.name FROM Transaction T JOIN Item I ON (T.itemId = I.id) WHERE T.buyerId = ? ORDER BY date DESC", [userId])
}

export async function fetchPublishedItems(userId: number): Promise<ItemOverview[]> {
  return await query("SELECT * FROM Item WHERE sellerId = ? ORDER BY publishDate DESC", [userId])
}

export async function insertItem(item: ItemInfo): Promise<void> {
  await query(`
    INSERT INTO Item (id, name, description, price, sellerId, publishDate, locationId, categoryId, status)
      SELECT MAX(id) + 1, ?, ?, ?, ?, ?, 1, 1, 'available' FROM Item`,
    [item.name, item.description, item.price, item.sellerId, item.publishDate])
}

export async function updateItem(item: ItemInfo): Promise<void> {
  await query(`
    UPDATE Item SET name = ?, description = ?, price = ?
      WHERE id = ? AND sellerId = ?`,
    [item.name, item.description, item.price, item.id, item.sellerId]);
}

export async function deleteItem(userId: number, itemId: number): Promise<void> {
  await query("DELETE FROM Item WHERE sellerId = ? AND id = ?", [userId, itemId]);
}

export async function fetchItemInfo(id: number): Promise<ItemInfo> {
  const items = await query<ItemInfo[]>(`SELECT * FROM Item WHERE id = ?`, [id]) as unknown as ItemInfo[];
  if (items.length === 0) {
    throw new Error("Item not found");
  }
  return items[0];
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
  return await query(`
    SELECT u.id, u.name as sellerName, SUM(I.price) as turnover
    FROM project.User u JOIN project.Transaction T ON (u.id = T.sellerId) JOIN project.Item I  USING (id) 
    WHERE EXISTS(
        SELECT *
        FROM project.User u2 JOIN project.Item I2  USING (id)
        WHERE publishDate >= 2020 AND u2.id = u.id AND T.status = 'completed'
    )
    GROUP BY u.id

    UNION
    
    SELECT u.id, u.name as sellerName, SUM(I.price) as turnover
    FROM project.User u JOIN project.Item I  USING (id) JOIN project.Transaction T ON (I.id = T.sellerId)
    WHERE EXISTS(
      SELECT T.sellerId
      FROM project.Item I2 JOIN project.Comment c ON (I2.id = c.id) JOIN project.Transaction T ON (I2.id = T.sellerId)
        WHERE T.status = 'completed'
      GROUP BY T.sellerId
      HAVING COUNT(*) > 3
    )
    GROUP BY u.id
    
    ORDER BY turnover DESC
    LIMIT 20;
  `)
}

export async function cheapCategory() {
  return await query(`
    SELECT c.name, COUNT(*) AS Num_Item
    FROM project.Category c JOIN (
      SELECT i.id, i.categoryId FROM project.Item i
         WHERE i.price < 5 AND i.status = 'available'
    ) as subtable ON c.id = subtable.categoryId
    GROUP BY c.name
    ORDER BY Num_Item DESC
    LIMIT 20;
  `)
}

export async function buyItem(userId: number, itemId: number): Promise<void> {
  await query(`
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
  `);
  await beginTransaction()
  try {
    let [{ price }] = await query(`
        SELECT price FROM Item WHERE id = ?
    `, [itemId]) as any
    await query(`
      INSERT INTO Transaction (buyerId, itemId, sellerId, status, price, date)
        SELECT ?, I.id, I.sellerId, 'completed', NOW(), ? FROM Item I WHERE I.id = ?
    `, [userId, price, itemId])
    await query(`
      UPDATE Item SET status = 'sold out' WHERE id = ?
    `, [itemId])
    await commit()
  } catch (e) {
    console.log("Rollback: ")
    console.log(e)
    await rollback()
  }
}