import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import "./Map.css";

import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: 10,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  const [center, setCenter] = useState({
    lat: 50.06143,
    lng: 19.93658,
  });

  useEffect(() => {
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
  }, []);

  const [markers, setMarkers] = useState([]);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // const panTo = useCallback(({ lat, lng }) => {
  //   setCenter({ lat, lng })
  //   mapRef.current.panTo({ lat, lng });
  //   mapRef.current.setZoom(15);
  // }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading...";

  return (
    <Container className="map sticky-top">
      <Search panTo={setCenter} />

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.time.toISOString()}
            position={{ lat: marker.lat, lng: marker.lng }}
          />
        ))}
        <Marker
          icon='https://www.robotwoods.com/dev/misc/bluecircle.png'
          position={center}
        />
      </GoogleMap>
    </Container>
  );
};

export const Locate = ({ panTo }) => {
  return (
    <Button
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => console.log(error),
          options
        );
      }}
    >
      Current Location
    </Button>
  );
};

export const Search = ({ panTo }) => {
  const onPlaceSelect = (value) => {
    try {
      const { lat, lon } = value.properties;
      panTo({ lat: lat, lng: lon });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="search">
      <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
        <GeoapifyGeocoderAutocomplete
          placeholder="Enter address here"
          placeSelect={onPlaceSelect}
        />
      </GeoapifyContext>
    </div>
  );
};

export default Map;
