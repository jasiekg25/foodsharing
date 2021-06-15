import { useState, useRef, useEffect, useCallback } from "react";

const useMap = ({ lat, lng }) => {
  const mapRef = useRef();
  const [center, setCenter] = useState({
    lat,
    lng,
  });

  const fitPoint = useCallback(
    ({ lat, lng }) => {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(center.lat, center.lng));
      bounds.extend(new window.google.maps.LatLng(lat, lng));
      mapRef.current.fitBounds(bounds, 100); // second parameter is padding in pixels
    },
    [center]
  );

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  }, []);

  return { mapRef, center, setCenter, fitPoint, panTo };
};

export default useMap;
