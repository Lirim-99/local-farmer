import checkOwner from './checkOwner.js';

const roomPermissions = {
  update: {
    roles: ['admin', 'editor','basic'],
    owner: checkOwner,
  },
  delete: {
    roles: ['admin', 'editor','basic'],
    owner: checkOwner,
  },
};

export default roomPermissions;