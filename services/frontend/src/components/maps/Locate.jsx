import React from "react";

const Locate = ({ panTo }) => {
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

export default Locate;
