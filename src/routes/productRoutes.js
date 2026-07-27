// productRoutes.js
import express from 'express';
const router = express.Router();
import { createProductValidation, updateProductValidation } from '../validations/productValidation.js';
import * as productController from '../controllers/productController.js';
import role from '../middleware/roleMiddleware.js'; 
import {protect, authorize} from '../middleware/authMiddleware.js';

router.post('/', authorize, role(['owner','admin','manager']),protect,authorize,createProductValidation, productController.create);
router.put('/:id', authorize, role(['owner','admin','manager']), protect, authorize, updateProductValidation, productController.update);

export default router;