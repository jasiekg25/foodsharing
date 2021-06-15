import React from "react"
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

const Search = ({ panTo }) => {
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

export default Search;
