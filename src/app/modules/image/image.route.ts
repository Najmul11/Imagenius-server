import express from 'express';
import singleUpload from '../../middlewares/multer';
import { ImageController } from './image.controller';
import auth, { ENUM_USER_ROLE } from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/add-image',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  singleUpload,
  ImageController.addImage
);
router.patch(
  '/:imageId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  singleUpload,
  ImageController.editImage
);
router.delete(
  '/:imageId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ImageController.deleteImage
);
router.get('/:imageId', ImageController.deleteImage);
router.get('/', ImageController.getAllmages);

export const ImageRoutes = router;
