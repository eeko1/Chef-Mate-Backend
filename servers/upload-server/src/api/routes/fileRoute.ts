import express, {Request} from 'express';
import {deleteFile, uploadFile} from '../controllers/uploadController';
import multer, {FileFilterCallback} from 'multer';
import {authenticate, makeThumbnail} from '../../middlewares';

const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.includes('image') || file.mimetype.includes('video')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({dest: './uploads/', fileFilter});
const router = express.Router();

/**
 * @api {post} /upload Upload a file
 * @apiName UploadFile
 * @apiGroup File
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {File} file File to upload
 *
 * @apiSuccess {String} message File uploaded successfully
 * @apiSuccess {String} url URL of the uploaded file
 * @apiSuccess {String} thumbnail URL of the thumbnail
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "message": "File uploaded successfully",
 * "url": "http://localhost:3000/uploads/1612345678900-filename.jpg",
 * "thumbnail": "http://localhost:3000/uploads/thumbnails/1612345678900-filename.jpg"
 * }
 *
 */

/**
 * @api {delete} /delete/:filename Delete a file
 * @apiName DeleteFile
 * @apiGroup File
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {String} filename Filename to delete
 *
 * @apiSuccess {String} message File deleted successfully
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "message": "File deleted successfully"
 * }
 *
 * */
router
  .route('/upload')
  .post(authenticate, upload.single('file'), makeThumbnail, uploadFile);

router.route('/delete/:filename').delete(authenticate, deleteFile);

export default router;
