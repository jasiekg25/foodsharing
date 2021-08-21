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
  const { mapRef, center, setCenter, fitPoint, panTo } = useMap({
    lat: 50.06143,
    lng: 19.93658,
  });
  const [offers, setOffers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

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

    getOffers(pageCount);
  }, []);

  useEffect(() => {
    searchUpdate()
  }, [center])

  const getOffers = () => {
    let queryTags = tags.filter(tag => {return tag['selected'];}).map(tag => tag.id).join(',');
    api
      .getOffers(pageCount, center.lat, center.lng, queryTags)
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

  const searchUpdate = () => {
    let queryTags = tags.filter(tag => {return tag['selected'];}).map(tag => tag.id).join(',');
    api
      .getOffers(1, center.lat, center.lng, queryTags)
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
        searchFunction={searchUpdate}
      />

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
