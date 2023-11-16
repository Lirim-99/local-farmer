import { Router } from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';

import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
} from '../controllers/room.js';
import auth from '../middleware/auth.js';
import checkAccess from '../middleware/checkAccess.js';
import roomPermissions from '../middleware/permissions/room/roomPermissions.js';

const roomRouter = Router();

const checkCategory = (allowedCategories) => async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user || !allowedCategories.includes(user.category)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User category does not allow this action.',
      });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
roomRouter.get('/categories', async (req, res) => {
  try {
    // Fetch distinct categories from the Products collection
    const categories = await Product.distinct('name');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

roomRouter.post('/', auth, checkCategory(['seller']), createRoom);
roomRouter.get('/', getRooms);
roomRouter.delete(
  '/:roomId',
  auth,
  checkCategory(['seller', 'admin', 'editor']), // Adjust the allowed category as needed
  checkAccess(roomPermissions.delete),
  deleteRoom
);
roomRouter.patch(
  '/:roomId',
  auth,
  checkCategory(['seller', 'admin', 'editor']), // Adjust the allowed category as needed
  checkAccess(roomPermissions.update),
  updateRoom
);

export default roomRouter;
