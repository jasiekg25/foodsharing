import React from "react";
import Map from "./Map";
import { Marker } from "@react-google-maps/api";

const OfferMap = ({ mapRef, center, setCenter, offers, selected }) => {
  return (
    <Map mapRef={mapRef} center={center} setCenter={setCenter}>
      <Marker
        icon={{
          url: "https://www.robotwoods.com/dev/misc/bluecircle.png",
          //   scaledSize: new window.google.maps.Size(20, 20),
        }}
        position={center}
        zIndex={1001}
      />
      {selected && (
        <Marker
          position={{
            lat: selected.pickup_latitude,
            lng: selected.pickup_longitude,
          }}
          icon={"https://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
          zIndex={1000}
        />
      )}
      {offers.map(
        (offer) =>
          selected !== offer && (
            <Marker
              key={offer.id}
              position={{
                lat: offer.pickup_latitude,
                lng: offer.pickup_longitude,
              }}
              icon={"https://maps.google.com/mapfiles/ms/icons/red-dot.png"}
            />
          )
      )}
    </Map>
  );
};

export default OfferMap;
