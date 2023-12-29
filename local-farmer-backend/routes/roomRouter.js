import { Router } from 'express';
import User from '../models/User.js';

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

// const checkCategory = (allowedCategories) => async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const user = await User.findById(userId);
//     if (!user || !allowedCategories.includes(user.category)) {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied. User category does not allow this action.',
//       });
//     }
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

roomRouter.post('/', auth, createRoom);
roomRouter.get('/', getRooms);
roomRouter.delete(
  '/:roomId',
  auth,
  checkAccess(roomPermissions.delete),
  deleteRoom
);
roomRouter.patch(
  '/:roomId',
  auth,
  checkAccess(roomPermissions.update),
  updateRoom
);

export default roomRouter;
