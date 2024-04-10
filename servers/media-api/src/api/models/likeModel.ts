import { RowDataPacket } from "mysql2";
import promisePool from "../../lib/db"
import { Like } from "@sharedTypes/DBTypes";

// FETCH ALL LIKES
const fetchAllLikes = async (): Promise<Like[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>('SELECT * FROM Likes');
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllLikes error', (e as Error).message);
    throw new Error('fetchAllLikes error');
  }
};


// fetchLikesByMediaId
const fetchLikesByMediaId = async (media_id: number): Promise<Like[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>('SELECT * FROM Likes WHERE media_id = ?', [media_id]);
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchLikesByMediaId error', (e as Error).message);
    throw new Error('fetchLikesByMediaId error');
  }
}

export {
  fetchAllLikes, fetchLikesByMediaId
};
