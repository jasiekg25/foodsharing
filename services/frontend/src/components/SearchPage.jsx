import React, { useEffect, useState } from "react";
import TagSearch from "./tags/TagSearch";
import { Row, Container, Button, Col } from "react-bootstrap";
import Tag from "./tags/Tag";
import Offers from "./Offers";
import { Redirect } from "react-router-dom";
import api from "../api";
import OfferMap from "./maps/OfferMap"
import useMap from "./maps/useMap";

const SearchPage = ({ isLoggedIn }) => {
  const [tags, setTags] = useState([]);
  const { mapRef, center, setCenter, fitPoint } = useMap({
    lat: 50.06143,
    lng: 19.93658,
  });
  const [offers, setOffers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api
      .getTags()
      .then((res) => {
        let tagsData = res.data;
        for (let tag of tagsData) {
          tag["selected"] = false;
        }
        setTags(tagsData);
      })
      .catch((err) => {
        console.log("Could not get any tags " + err.message);
      });

    getOffers();
  }, []);

  const getOffers = () => {
    api
      .getOffers()
      .then((res) => {
        console.log(res.data);
        setOffers(res.data);
      })
      .catch((err) => {
        console.log("Could not get any offers " + err.message);
      });
  };

  const onTagToggle = (tag) => {
    const index = tags.findIndex((el) => el.id === tag.id);
    let newTags = [...tags];
    newTags[index] = { ...tag, selected: !tag.selected };

    setTags(newTags);
  };

  const onOfferSelect = (offer) => {
    setSelected(offer);
    fitPoint({ lat: offer.pickup_latitude, lng: offer.pickup_longitude });
  };

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Container>
        {/*<Row>*/}
        {/*  {tags*/}
        {/*    .filter((tag) => tag.selected)*/}
        {/*    .map((tag) => {*/}
        {/*      return <Tag key={tag.id} tag={tag} toggle={onTagToggle} />;*/}
        {/*    })}*/}
        {/*</Row>*/}
      </Container>
      <TagSearch
        tags={tags}
        onTagToggle={onTagToggle}
        searchButton={true}
        containerStyle="col-md-6 search-container"
      />

      <Row>
        <Col md={6}>
          <Offers
            offers={offers}
            getOffers={getOffers}
            onOfferSelect={onOfferSelect}
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
