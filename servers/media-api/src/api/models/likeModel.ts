import { ResultSetHeader, RowDataPacket } from "mysql2";
import promisePool from "../../lib/db"
import { Like } from "@sharedTypes/DBTypes";
import { MessageResponse } from "@sharedTypes/MessageTypes";

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

// POST LIKE
const postLike = async (
  media_id: number,
  user_id: number
): Promise<MessageResponse | null> => {
  try {
    const [likeExists] = await promisePool.execute<RowDataPacket[] & Like[]>(
      'SELECT * FROM Likes WHERE media_id = ? AND user_id = ?',
      [media_id, user_id]
    );
    if (likeExists.length !== 0) {
      return null;
    }

    const [likeResult] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Likes (user_id, media_id) VALUES (?, ?)',
      [user_id, media_id]
    );
    if (likeResult.affectedRows === 0) {
      return null;
    }

    return {message: 'Like added'};
  } catch (e) {
    console.error('postLike error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// DELETE LIKE
const deleteLike = async (
  media_id: number,
  user_id: number
): Promise<MessageResponse | null> => {
  try {
    const [likeExists] = await promisePool.execute<RowDataPacket[] & Like[]>(
      'SELECT * FROM Likes WHERE media_id = ? AND user_id = ?',
      [media_id, user_id]
    );
    if (likeExists.length === 0) {
      return null;
    }

    const [deleteResult] = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM Likes WHERE user_id = ? AND media_id = ?',
      [user_id, media_id]
    );
    if (deleteResult.affectedRows === 0) {
      return null;
    }

    return {message: 'Like deleted'};
  } catch (e) {
    console.error('deleteLike error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {
  fetchAllLikes, fetchLikesByMediaId, postLike, deleteLike
};
