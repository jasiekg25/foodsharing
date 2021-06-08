import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import "./Map.css";

import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: 10,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = ({ mapRef, center, setCenter, offers, selected }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
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

  // useEffect(() => {
  //   const bounds = new window.google.maps.LatLngBounds();
  //   bounds.extend(new window.google.maps.LatLng(center.lat, center.lng));
  //   offers.map((offer, i) => {
  //     bounds.extend(
  //       new window.google.maps.LatLng(
  //         offer.pickup_latitude,
  //         offer.pickup_longitude
  //       )
  //     );
  //   });
  //   console.log(bounds)
  //   mapRef.current.fitBounds(bounds);
  // }, []);

  // const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);



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
        <Marker
          icon={{
            url: "https://www.robotwoods.com/dev/misc/bluecircle.png",
            scaledSize: new window.google.maps.Size(20, 20),
          }}
          position={center}
          zIndex={10}
        />
        {offers.map((offer) =>
          selected === offer ? (
            <Marker
              key={selected.id}
              position={{
                lat: selected.pickup_latitude,
                lng: selected.pickup_longitude,
              }}
              icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />
          ) : (
            <Marker
              key={offer.id}
              position={{
                lat: offer.pickup_latitude,
                lng: offer.pickup_longitude,
              }}
              icon="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            />
          )
        )}
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
