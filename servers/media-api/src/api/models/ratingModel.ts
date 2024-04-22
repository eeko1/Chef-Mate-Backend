import { Rating } from "@sharedTypes/DBTypes";
import promisePool from "../../lib/db";
import { RowDataPacket } from "mysql2";

const fetchAllRatings = async (): Promise<Rating[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Rating[]>(
      'SELECT * FROM Ratings'
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllRatings error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};
const fetchRatingsByMediaId = async (
  media_id: number
): Promise<Rating[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Rating[]>(
      'SELECT * FROM Ratings WHERE media_id = ?',
      [media_id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchRatingsByMediaId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const fetchAverageRatingByMediaId = async (
  media_id: number
): Promise<number | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Rating[]>(
      'SELECT AVG(rating_value) as averageRating FROM Ratings WHERE media_id = ?',
      [media_id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0].averageRating;
  } catch (e) {
    console.error('fetchRatingsByMediaId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {fetchAllRatings, fetchRatingsByMediaId, fetchAverageRatingByMediaId};
