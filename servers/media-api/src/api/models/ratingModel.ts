import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Rating, UserLevel} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {MessageResponse} from '@sharedTypes/MessageTypes';

// LIST ALL RATINGS
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

// LIST RATINGS BY MEDIA ID
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

// LIST AVERAGE RATING BY MEDIA ID
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

// LIST RATINGS BY USER ID
const fetchRatingsByUserId = async (
  user_id: number
): Promise<Rating[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Rating[]>(
      'SELECT * FROM Ratings WHERE user_id = ?',
      [user_id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchRatingsByUserId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// POST RATING
const postRating = async (
  media_id: number,
  user_id: number,
  rating_value: number
): Promise<MessageResponse | null> => {
  // TRANSACTION
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    // CHECK EXISTANCE OF RATING
    const [ratingExists] = await connection.execute<RowDataPacket[] & Rating[]>(
      'SELECT * FROM Ratings WHERE media_id = ? AND user_id = ? FOR UPDATE',
      [media_id, user_id]
    );

    // DELETE IF RATING EXISTS AND RATING_VALUE = 0
    if (ratingExists.length > 0) {
      const [deleteResult] = await connection.execute<ResultSetHeader>(
        'DELETE FROM Ratings WHERE rating_id = ? AND user_id = ?',
        [ratingExists[0].rating_id, user_id]
      );
      if (deleteResult.affectedRows === 0) {
        await connection.rollback();
        return null;
      }
    }

    // NEW RATING IF RATING > 0
    if (rating_value === 0) {
      await connection.commit();
      return {message: 'Rating deleted'};
    }
    const [ratingResult] = await connection.execute<ResultSetHeader>(
      'INSERT INTO Ratings (media_id, user_id, rating_value) VALUES (?, ?, ?)',
      [media_id, user_id, rating_value]
    );

    // ROLLBACK IF NO ROWS AFFECTED
    if (ratingResult.affectedRows === 0) {
      await connection.rollback();
      return null;
    }

    // GET INSERTED RATING
    const [rows] = await connection.execute<RowDataPacket[] & Rating[]>(
      'SELECT * FROM Ratings WHERE rating_id = ?',
      [ratingResult.insertId]
    );

    // ROLLBACK IF NO ROWS RETURNED
    if (rows.length === 0) {
      await connection.rollback();
      return null;
    }

    // COMMIT IF SUCCESS
    await connection.commit();

    return {message: 'Rating added'};
  } catch (e) {
    // If there was an error, rollback the transaction
    await connection.rollback();
    console.error('postRating error', (e as Error).message);
    throw new Error((e as Error).message);
  } finally {
    // RELEASE CONNECTION
    connection.release();
  }
};

// DELETE RATING
const deleteRating = async (
  media_id: number,
  user_id: number,
  level_name: UserLevel['level_name']
): Promise<MessageResponse | null> => {
  try {
    let sql = '';
    if (level_name === 'Admin') {
      sql = promisePool.format('DELETE FROM Ratings WHERE rating_id = ?', [
        media_id,
      ]);
    } else {
      sql = promisePool.format(
        'DELETE FROM Ratings WHERE rating_id = ? AND user_id = ?',
        [media_id, user_id]
      );
    }

    const [ratingResult] = await promisePool.execute<ResultSetHeader>(sql);
    if (ratingResult.affectedRows === 0) {
      return null;
    }
    return {message: 'Rating deleted'};
  } catch (e) {
    console.error('deleteRating error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {
  fetchAllRatings,
  fetchRatingsByMediaId,
  fetchRatingsByUserId,
  fetchAverageRatingByMediaId,
  postRating,
  deleteRating,
};
