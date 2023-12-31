import React, { useEffect, useState } from 'react';
import { useValue } from '../../context/ContextProvider';
import { getRooms } from '../../actions/room';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import Supercluster from 'supercluster';
import './cluster.css';
import { Avatar, Paper, Tooltip } from '@mui/material';
import GeocoderInput from '../sidebar/GeocoderInput';
import PopupRoom from './PopupRoom';
import CerealIcon from '../categoryIcons/cereals_icon5.png';
import FruitsIcon from '../categoryIcons/fruits.jpg';
import LegumesIcon from '../categoryIcons/Legumes_Icon.png';
import NutsIcon from '../categoryIcons/Nuts_Icon.png';
import VegetablesIcon from '../categoryIcons/vegetables.svg';

const iconMapping = {
  Cereals: CerealIcon,
  Fruits: FruitsIcon, 
  Legumes: LegumesIcon,
  Nuts: NutsIcon,
  Vegetables: VegetablesIcon,
};


const supercluster = new Supercluster({
  radius: 75,
  maxZoom: 20,
});

const ClusterMap = () => {
  const {
    state: { filteredRooms },
    dispatch,
    mapRef,
  } = useValue();
  const [points, setPoints] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [bounds, setBounds] = useState([-180, -85, 180, 85]);
  const [zoom, setZoom] = useState(0);
  const [popupInfo, setPopupInfo] = useState(null);

  useEffect(() => {
    getRooms(dispatch);
  }, []);

  useEffect(() => {
    const points = filteredRooms.map((room) => {
      const mainCategory = room.category ? room.category.mainCategory : 'Unknown'; // Access mainCategory under category
      return {
        type: 'Feature',
        properties: {
          cluster: false,
          roomId: room._id,
          price: room.price,
          title: room.title,
          description: room.description,
          lng: room.lng,
          lat: room.lat,
          images: room.images,
          uPhoto: room.uPhoto,
          uName: room.uName,
          mainCategory: mainCategory, // Assuming mainCategory exists in your room object
        },
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(room.lng), parseFloat(room.lat)],
        },
      };
    });
    setPoints(points);
  }, [filteredRooms]);
  

  useEffect(() => {
    supercluster.load(points);
    setClusters(supercluster.getClusters(bounds, zoom));
  }, [points, zoom, bounds]);

  useEffect(() => {
    if (mapRef.current) {
      setBounds(mapRef.current.getMap().getBounds().toArray().flat());
    }
  }, [mapRef?.current]);


  return (
    <ReactMapGL
      mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      ref={mapRef}
      onZoomEnd={(e) => setZoom(Math.round(e.viewState.zoom))}
    >
      {clusters.map((cluster) => {
        const { cluster: isCluster, point_count } = cluster.properties;
        const [longitude, latitude] = cluster.geometry.coordinates;
        const mainCategory = cluster.properties.mainCategory;
        const categoryIcon = iconMapping[mainCategory];
        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              longitude={longitude}
              latitude={latitude}
            >
              <div
                className="cluster-marker"
                style={{
                  width: `${10 + (point_count / points.length) * 20}px`,
                  height: `${10 + (point_count / points.length) * 20}px`,
                }}
                onClick={() => {
                  const zoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom,
                    speed: 1,
                  });
                }}
              >
                {point_count}
              </div>
            </Marker>
          );
        }

        return (
          <Marker
    key={`room-${cluster.properties.roomId}`}
    longitude={longitude}
    latitude={latitude}
   >
    <Tooltip title={cluster.properties.uName}>
      {/* Dynamically select the icon based on mainCategory */}
      <div
        className="custom-marker"
        style={{
          backgroundImage: `url(${categoryIcon || cluster.properties.uPhoto})`,
          width: '32px', // Adjust the width as needed
          height: '32px', // Adjust the height as needed
          cursor: 'pointer',
          backgroundSize: 'cover',
          borderRadius: '50%',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
        onClick={() => setPopupInfo(cluster.properties)}
      />
    </Tooltip>
   </Marker>
        
        );
      })}
      <GeocoderInput />
      {popupInfo && (
        <Popup
        longitude={popupInfo.lng}
        latitude={popupInfo.lat}
        maxWidth="auto"
        closeOnClick={false}
        focusAfterOpen={false}
        onClose={() => setPopupInfo(null)}
      >
        {/* Ensure PopupRoom is properly enclosed within the Popup */}
        <div style={{ maxWidth: '300px', width: '250px' }}> {/* Adjust the width as needed */}
          <PopupRoom {...{ popupInfo }} />
        </div>
      </Popup>
      )}
    </ReactMapGL>
  );
};

export default ClusterMap;