import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from '@mui/material';
import { AddLocationAlt, Bed, LocationOn  } from '@mui/icons-material';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';

import { useEffect, useRef, useState } from 'react';
import ClusterMap from './map/ClusterMap';
import Rooms from './rooms/Rooms';
import AddRoom from './addRoom/AddRoom';
import Protected from './protected/Protected';
import { useValue } from '../context/ContextProvider';

const BottomNav = () => {
  const { state: { section, currentUser }, dispatch } = useValue();
  const ref = useRef();

  useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, [section]);

  // Conditionally set the initial section value based on user login status and role
  useEffect(() => {
    if (currentUser) {
      // If the user is logged in and has a role other than "basic", set the section to "Map" (0)
      if (currentUser.role !== 'basic') {
        dispatch({ type: 'UPDATE_SECTION', payload: 1 });
      } else {
        // If the user has a "basic" role, set the section to "Products" (1)
        dispatch({ type: 'UPDATE_SECTION', payload: 0 });
      }
    } else {
      // If the user is not logged in, set the section to "Products" (1)
      dispatch({ type: 'UPDATE_SECTION', payload: 0 });
    }
  }, [currentUser, dispatch]);

  return (
    <Box ref={ref}>
      {
        {
          0: <Rooms />,
          1: currentUser && currentUser.role !== 'basic' ? <ClusterMap /> : null,
          2: (
            <Protected>
              <AddRoom />
            </Protected>
          ),
        }[section]
      }
      <Paper
        elevation={3}
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }}
      >
        <BottomNavigation
          showLabels
          value={section}
          onChange={(e, newValue) =>
            dispatch({ type: 'UPDATE_SECTION', payload: newValue })
          }
        >
          <BottomNavigationAction
            label="Products"
            icon={<LocalGroceryStoreIcon />}
          />
          {currentUser && currentUser.role !== 'basic' && (
            <BottomNavigationAction label="Map" icon={<LocationOn />} />
          )}
          <BottomNavigationAction label="Add" icon={<AddLocationAlt />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNav;
