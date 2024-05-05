import express from 'express';
import {
  mediaDelete,
  mediaGet,
  mediaListGet,
  mediaListGetByAppId,
  mediaPost,
} from '../controllers/mediaController';
import { authenticate } from '../../middlewares';

const router = express.Router();

/**
 * @api {get} /media Get list of all media
 * @apiName GetMediaList
 * @apiGroup Media
 * @apiDescription Retrieves a list of all media items.
 *
 * @apiSuccess {Object[]} media Array of media items.
 * @apiSuccess {Number} media.id Media ID.
 * @apiSuccess {String} media.title Title of the media item.
 * @apiSuccess {String} media.description Description of the media item.
 * @apiSuccess {String} media.url URL of the media item.
 * @apiSuccess {Date} media.created_at Timestamp when the media was created.
 * @apiSuccess {Date} media.updated_at Timestamp when the media was last updated.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "title": "Sample Media",
 *         "description": "A sample media item for demonstration.",
 *         "url": "http://example.com/media/1",
 *         "created_at": "2021-01-01T00:00:00.000Z",
 *         "updated_at": "2021-01-02T00:00:00.000Z"
 *       }
 *     ]
 */
router.get('/', mediaListGet);

/**
 * @api {post} /media Add new media
 * @apiName PostMedia
 * @apiGroup Media
 * @apiDescription Adds a new media item to the collection.
 *
 * @apiPermission Authenticated
 *
 * @apiBody {String} title Title of the media item.
 * @apiBody {String} description Description of the media item.
 * @apiBody {String} url URL where the media can be accessed.
 *
 * @apiSuccess {Object} media The newly created media item.
 * @apiSuccess {Number} media.id Media ID.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": 2,
 *       "title": "New Media Item",
 *       "description": "Description of the new media item.",
 *       "url": "http://example.com/media/2"
 *     }
 */
router.post('/', authenticate, mediaPost);

/**
 * @api {get} /media/:id Get media by ID
 * @apiName GetMedia
 * @apiGroup Media
 * @apiDescription Retrieves a single media item by its ID.
 *
 * @apiParam {Number} id Media item's unique ID.
 *
 * @apiSuccess {Object} media Media item detail.
 * @apiSuccess {Number} media.id Media ID.
 * @apiSuccess {String} media.title Title of the media.
 * @apiSuccess {String} media.description Description of the media.
 * @apiSuccess {String} media.url URL of the media.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "title": "Sample Media",
 *       "description": "A sample media item for demonstration.",
 *       "url": "http://example.com/media/1"
 *     }
 */
router.get('/:id', mediaGet);

/**
 * @api {delete} /media/:id Delete media by ID
 * @apiName DeleteMedia
 * @apiGroup Media
 * @apiDescription Deletes a single media item by its ID.
 *
 * @apiPermission Authenticated
 *
 * @apiParam {Number} id Media item's unique ID to be deleted.
 *
 * @apiSuccess {String} message Success message indicating the media was deleted.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Media successfully deleted."
 *     }
 */
router.delete('/:id', authenticate, mediaDelete);

/**
 * @api {get} /media/app/:id Get media by App ID
 * @apiName GetMediaByAppId
 * @apiGroup Media
 * @apiDescription Retrieves a list of media items associated with a specific application ID.
 *
 * @apiParam {Number} id Application's unique ID.
 *
 * @apiSuccess {Object[]} media Array of media items associated with the app.
 * @apiSuccess {Number} media.id Media ID.
 * @apiSuccess {String} media.title Title of the media item.
 * @apiSuccess {String} media.description Description of the media item.
 * @apiSuccess {String} media.url URL of the media item.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 3,
 *         "title": "App Specific Media",
 *         "description": "Media item related to specific app.",
 *         "url": "http://example.com/media/3"
 *       }
 *     ]
 */
router.get('/app/:id', mediaListGetByAppId);

export default router;
