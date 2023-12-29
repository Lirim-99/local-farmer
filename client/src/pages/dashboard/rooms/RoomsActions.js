import { Box, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit, Preview } from '@mui/icons-material';
import { useValue } from '../../../context/ContextProvider';
import { clearRoom, deleteRoom } from '../../../actions/room';
import { useNavigate } from 'react-router-dom';

const RoomsActions = ({ params }) => {
  const { _id, lng, lat, price, title, description, images, uid, category, form, formValue, currency } = params.row;
  const {
    dispatch,
    state: { currentUser, updatedRoom, addedImages, images: newImages },
  } = useValue();

  const navigate = useNavigate();
  const handleEdit = () => {
    if (updatedRoom) {
      clearRoom(dispatch, currentUser, addedImages, updatedRoom);
    } else {
      clearRoom(dispatch, currentUser, newImages);
    }
    dispatch({ type: 'UPDATE_LOCATION', payload: { lng, lat } });
    dispatch({
      type: 'UPDATE_DETAILS',
      payload: { price, title, description, category, form, formValue, currency },
    });
    console.log("currency", currency)
    dispatch({ type: 'UPDATE_IMAGES', payload: images });
    dispatch({ type: 'UPDATE_UPDATED_ROOM', payload: { _id, uid } });
    dispatch({ type: 'UPDATE_SECTION', payload: 2 });
    navigate('/');
  };
  return (
    <Box>
      <Tooltip title="View product details">
        <IconButton
          onClick={() => dispatch({ type: 'UPDATE_ROOM', payload: params.row })}
        >
          <Preview />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit this product">
        <IconButton onClick={handleEdit}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete this product">
        <IconButton
          onClick={() => deleteRoom(params.row, currentUser, dispatch)}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default RoomsActions;