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
import { useEffect, useState } from 'react';
import { getRooms } from '../../actions/room';
import { getDistance } from 'geolib'; // Example: using the geolib library




const Rooms = () => {
  const {
    state: { filteredRooms },
    dispatch,
  } = useValue();

    const [allRooms, setAllRooms] = useState([]);


  useEffect(() => {
    getRooms(dispatch);
    const updateUserLocation = async () => {
      try {
        // Ask user for permission to access their location
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'granted') {
          // Get user's coordinates using browser geolocation API
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCoordinates = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setUserLocation(userCoordinates); // Update the user's location state
              console.log('User Latitude:', userCoordinates.lat);
              console.log('User Longitude:', userCoordinates.lng);
            },
            (error) => {
              console.error('Error getting user location:', error);
            }
          );
        } else {
          console.error('Geolocation permission denied');
        }
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };
    updateUserLocation();
  }, [dispatch]);
  

  const [userLocation, setUserLocation] = useState(null); // User's location, update it with actual values
  const [selectedDistance, setSelectedDistance] = useState(0); // State to track selected distance


  const filterRoomsByDistance = (rooms, distance) => {
    if (!userLocation || !userLocation.lat || !userLocation.lng) {
      // User location not available, return all rooms
      return rooms;
    }
  
    const filtered = rooms.filter((room) => {
      const roomDistance = getDistance(
        { latitude: userLocation.lat, longitude: userLocation.lng },
        { latitude: room.lat, longitude: room.lng }
      );
  
      return roomDistance <= distance * 1000; // Convert km to meters for geolib
    });
  
    return filtered;
  };
  const handleDistanceChange = (event) => {
    const selected = parseInt(event.target.value, 10);
    setSelectedDistance(selected); // Update selected distance state

    let filtered = [];
    if (selected === 0) {
      filtered = filteredRooms; // Show all rooms when "Show All" is selected
    } else {
      filtered = filterRoomsByDistance(filteredRooms, selected); // Filter based on distance
    }

    // Log and dispatch the filtered rooms
    console.log(`Rooms within ${selected} km: `, filtered);
    dispatch({ type: 'UPDATE_ROOMS', payload: filtered });
  };
  
  return (
    <Container>
      <select value={selectedDistance} onChange={handleDistanceChange}>
        <option value={0}>Show All</option>
        <option value={10}>Within 10km</option>
        <option value={20}>Within 20km</option>
        {/* Add more options as needed */}
      </select>
     <ImageList
        gap={12}
        sx={{
          mb: 8,
          gridTemplateColumns:
            'repeat(auto-fill, minmax(280px, 1fr))!important',
        }}
      >
        {filteredRooms.map((room) => (
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