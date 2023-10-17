import express from 'express';
import singleUpload from '../../middlewares/multer';
import { ImageController } from './image.controller';

const router = express.Router();

router.post('/add-image', singleUpload, ImageController.addImage);
router.get('/', ImageController.getAllmages);

export const ImageRoutes = router;
