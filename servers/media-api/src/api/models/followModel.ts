import { ResultSetHeader, RowDataPacket } from 'mysql2';
import promisePool from '../../lib/db';
import { UserFollow } from '@sharedTypes/DBTypes';
import { MessageResponse } from '@sharedTypes/MessageTypes';

// fetch all follows
const fetchAllFollow = async (): Promise<UserFollow[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & UserFollow[]>('SELECT * FROM UserFollow');
    if (rows.length === 0) {
    return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllFollow error', (e as Error).message);
    throw new Error('fetchAllFollow error');
  }
};

// follow user / post user follow
const postUserFollow = async (
  followed_id: number,
  user_id: number,
): Promise<MessageResponse | null> => {
  try {
    const [followExist] = await promisePool.execute<RowDataPacket[] & UserFollow[]>(
      'SELECT * FROM UserFollow WHERE follower_id = ? AND followed_id = ?',
      [user_id, followed_id]
    );
    if (followExist.length !== 0) {
      return null;
    }

    const [followResult] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO UserFollow (followed_id, follower_id) VALUES (?, ?)',
      [followed_id, user_id]
    );
    if (followResult.affectedRows === 0) {
      return null;
    }

    return { message: 'Follow created' };
  } catch (e) {
    console.error('postUserFollow error', (e as Error).message);
    throw new Error('postUserFollow error');
  }
}

// delete user follow

const deleteUserFollow = async (
  followed_id: number,
  user_id: number,
): Promise<MessageResponse | null> => {
  try {
    const [followExist] = await promisePool.execute<RowDataPacket[] & UserFollow[]>(
      'SELECT * FROM UserFollow WHERE follower_id = ? AND followed_id = ?',
      [user_id, followed_id]
    );
    if (followExist.length === 0) {
      return null;
    }

    const [followResult] = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM UserFollow WHERE follower_id = ? AND followed_id = ?',
      [user_id, followed_id]
    );
    if (followResult.affectedRows === 0) {
      return null;
    }

    return { message: 'Follow deleted' };
  } catch (e) {
    console.error('deleteUserFollow error', (e as Error).message);
    throw new Error('deleteUserFollow error');
  }
}

export {
  fetchAllFollow,
  postUserFollow,
  deleteUserFollow,
};
