import React, { useCallback } from "react";
import Map from "./Map";
import { Marker } from "@react-google-maps/api";

const MapPicker = ({center, setCenter, ...rest}) => {
  const onMapClick = useCallback((e) => {
    setCenter({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);

  const onMarkerDrag = useCallback((e) => {
    setCenter({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  });

  return (
    <Map
     center={center}
     setCenter={setCenter}
     onClick={onMapClick}
     {...rest}
    >
      <Marker
        position={center}
        icon={"https://maps.google.com/mapfiles/ms/icons/green-dot.png"}
        zIndex={1000}
        draggable={true}
        onDragEnd={onMarkerDrag}
      />
    </Map>
  );
};

export default MapPicker;
