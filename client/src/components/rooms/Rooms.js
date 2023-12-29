import {
  Avatar,
  Card,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Rating,
  Tooltip,
} from '@mui/material';
import { useValue } from '../../context/ContextProvider';
import { StarBorder } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { getRooms } from '../../actions/room';
import { getDistance } from 'geolib'; 



const Rooms = () => {
  const { state: { filteredRooms }, dispatch } = useValue();
  const [userLocation, setUserLocation] = useState(null);
  const [sortedRooms, setSortedRooms] = useState([]);
  const currentUser = localStorage.getItem('currentUser');
  const user = currentUser ? JSON.parse(currentUser) : null; 

  useEffect(() => {
    getRooms(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const updateUserLocation = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCoordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              setUserLocation(userCoordinates);
            },
            (error) => {
              console.error('Error getting user location:', error);
            }
          );
        }
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };

    updateUserLocation();

  }, []);

  useEffect(() => {
    if (userLocation && filteredRooms.length > 0) {
      const roomsWithDistance = filteredRooms.map((room) => {
        if (room.lat !== undefined && room.lng !== undefined) {
          const distance = getDistance(
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude: room.lat, longitude: room.lng }
          );
          return { ...room, distance };
        } else {
          return { ...room, distance: Infinity };
        }
      });
  
      const sorted = roomsWithDistance.sort((a, b) => a.distance - b.distance);
  
      if (user && user.role === 'basic') {
        const nearRooms = sorted.filter((room) => room.distance <= 20000);
        setSortedRooms(nearRooms);
      } else {
        setSortedRooms(sorted);
      }
    } else {
      setSortedRooms(filteredRooms);
    }
  }, [filteredRooms, userLocation, user]);
  return (
    <Container>
     <ImageList
        gap={12}
        sx={{
          mb: 8,
          gridTemplateColumns:
            'repeat(auto-fill, minmax(280px, 1fr))!important',
        }}
      >
        {sortedRooms.map((room) => (
          <Card key={room._id} sx={{ maxHeight: 350 }}>
            <ImageListItem sx={{ height: '100% !important' }}>
              <ImageListItemBar
                sx={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)',
                }}
                title={room.price === 0 ? 'Free' : '$' + room.price}
                actionIcon={
                  <Tooltip title={room.uName} sx={{ mr: '5px' }}>
                    <Avatar src={room.uPhoto} />
                  </Tooltip>
                }
                position="top"
              />
              <img
                src={room.images[0]}
                alt={room.title}
                loading="lazy"
                style={{ cursor: 'pointer' }}
                onClick={() => dispatch({ type: 'UPDATE_ROOM', payload: room })}
              />
              <ImageListItemBar
                title={room.title}
                actionIcon={
                  <Rating
                    sx={{ color: 'rgba(255,255,255, 0.8)', mr: '5px' }}
                    name="room-rating"
                    defaultValue={3.5}
                    precision={0.5}
                    emptyIcon={
                      <StarBorder sx={{ color: 'rgba(255,255,255, 0.8)' }} />
                    }
                  />
                }
              />
            </ImageListItem>
          </Card>
        ))}
      </ImageList>
    </Container>
  );
};

export default Rooms;