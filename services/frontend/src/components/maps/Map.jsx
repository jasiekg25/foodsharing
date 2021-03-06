import React, { useCallback, useEffect } from "react";
import { Container } from "react-bootstrap";
import "./Map.css";
import Search from "./Search";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "90vh",
  borderRadius: 10,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = ({
  mapRef,
  center,
  setCenter,
  children,
  onClick,
  geolocation = true,
  mapStyle = mapContainerStyle
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  useEffect(() => {
    if (geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log(error),
        options
      );
    }
  }, [setCenter]);

  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
    },
    [mapRef]
  );

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading...";

  return (
    <Container className="map sticky-top">
      <Search panTo={setCenter} />

    <div style={{height: '100%'}}> <GoogleMap
        mapContainerStyle={mapStyle}
        zoom={15}
        center={center}
        options={options}
        onLoad={onMapLoad}
        onClick={onClick}
      >
        {children}
      </GoogleMap></div>
     
    </Container>
  );
};

export default Map;
