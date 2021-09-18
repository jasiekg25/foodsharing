import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Offers from "./Offers";
import { Redirect } from "react-router-dom";
import api from "../api";
import OfferMap from "./maps/OfferMap"
import useMap from "./maps/useMap";
import SortSelect from "./sortSelect/sortSelect";
import { useTags } from "../hooks/useTags";
import TagSearch from './TagSearch'

const SearchPage = ({ isLoggedIn }) => {
  const { tags, selectedTags, setSelectedTags } = useTags();
  const { mapRef, center, setCenter, fitPoint } = useMap({
    lat: 50.06143,
    lng: 19.93658,
  });
  const [offers, setOffers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [sortBy, setSortBy] = useState('localization');

  useEffect(() => {
    getOffers(pageCount);
  }, []);

  useEffect(() => {
    searchUpdate()
  }, [center, selectedTags]) // TODO: debounce instead of fetching on every change

  const getOffers = () => {
    let queryTags = tags.filter(tag => {return tag['selected'];}).map(tag => tag.id).join(',');
    api
      .getOffers(pageCount, center.lat, center.lng, queryTags, sortBy)
      .then((res) => {
        setOffers([...offers, ...res.data]);
        let newPageCount = pageCount + 1
        setPageCount(newPageCount);
        if(res.data.length === 0 || res.data.length < 15)
          setHasNextPage(false)
      })
      .catch((err) => {
        console.log("Could not get any offers " + err.message);
        setHasNextPage(false);
      });
  };

  const searchUpdate = (sortByUpdated = sortBy) => {
    let queryTags = selectedTags.map(tag => tag.id).join(',');
    api
      .getOffers(1, center.lat, center.lng, queryTags, sortByUpdated)
      .then((res) => {
        setOffers(res.data);
        setSelected(null);
        setPageCount(1);
        if(res.data.length === 0 || res.data.length < 15)
          setHasNextPage(false)
      })
      .catch((err) => {
        console.log("Could not get any offers " + err.message);
        setHasNextPage(false);
      });
  }

  const onOfferSelect = (offer) => {
    setSelected(offer);
    fitPoint({ lat: offer.pickup_latitude, lng: offer.pickup_longitude });
  };

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <TagSearch
        tags={tags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />

      <Row>
        <SortSelect
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchFunction={searchUpdate}
        />
      </Row>

      <Row>
        <Col md={6}>
          <Offers
            offers={offers}
            getOffers={getOffers}
            onOfferSelect={onOfferSelect}
            hasNextPage={hasNextPage}
          />
        </Col>
        <Col md={6}>
          <OfferMap
            mapRef={mapRef}
            center={center}
            setCenter={setCenter}
            offers={offers}
            selected={selected}
          />
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage;
