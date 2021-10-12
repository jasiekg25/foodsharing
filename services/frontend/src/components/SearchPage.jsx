import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Offers from "./Offers";
import { Redirect } from "react-router-dom";
import api from "../api";
import OfferMap from "./maps/OfferMap";
import useMap from "./maps/useMap";
import SortSelect from "./sortSelect/sortSelect";
import { useTags } from "../hooks/useTags";
import TagSearch from "./TagSearch";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

const SearchPage = ({ isLoggedIn }) => {
  const classes = useStyles();

  const { tags, selectedTags, setSelectedTags } = useTags();
  const { mapRef, center, setCenter, fitPoint } = useMap({
    lat: 50.06143,
    lng: 19.93658,
  });
  const [offers, setOffers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [sortBy, setSortBy] = useState("localization");

  useEffect(() => {
    getOffers(pageCount);
  }, []);

  useEffect(() => {
    searchUpdate();
  }, [center, selectedTags]); // TODO: debounce instead of fetching on every change

  const getOffers = (afterSuccessfulOrder = false) => {
    let queryTags = tags
      .filter((tag) => {
        return tag["selected"];
      })
      .map((tag) => tag.id)
      .join(",");
      let pageNumber = afterSuccessfulOrder ? 1 : (pageCount + 1)
      setPageCount(pageNumber);
    api
      .getOffers(pageNumber, center.lat, center.lng, queryTags, sortBy)
      .then((res) => {
        if (afterSuccessfulOrder)
          setOffers(res.data);
        else
          setOffers([...offers, ...res.data]);
        if (res.data.length < 15)
          setHasNextPage(false);
      })
      .catch((err) => {
        console.log("Could not get any offers " + err.message);
        setHasNextPage(false);
      });
  };

  const searchUpdate = (sortByUpdated = sortBy) => {
    let queryTags = selectedTags.map((tag) => tag.id).join(",");
    api
      .getOffers(1, center.lat, center.lng, queryTags, sortByUpdated)
      .then((res) => {
        setOffers(res.data);
        setSelected(null);
        setPageCount(1);
        if (res.data.length === 0 || res.data.length < 15)
          setHasNextPage(false);
      })
      .catch((err) => {
        console.log("Could not get any offers " + err.message);
        setHasNextPage(false);
      });
  };

  const onOfferSelect = (offer) => {
    setSelected(offer);
    fitPoint({ lat: offer.pickup_latitude, lng: offer.pickup_longitude });
  };

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={6}>
          <Container style={{paddingRight: 0}}>
            <Toolbar
              variant="regular"
              style={{
                paddingTop: "20px",
              }}
            >
              <SortSelect
                sortBy={sortBy}
                setSortBy={setSortBy}
                searchFunction={searchUpdate}
              />
              <TagSearch
                tags={tags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            </Toolbar>
            <Offers
              offers={offers}
              getOffers={getOffers}
              onOfferSelect={onOfferSelect}
              hasNextPage={hasNextPage}
            />
          </Container>
        </Grid>
        <Grid item xs={6}>
          <Container style={{
                paddingTop: "20px",
                paddingLeft: 0
              }}>
            <OfferMap
              mapRef={mapRef}
              center={center}
              setCenter={setCenter}
              offers={offers}
              selected={selected}
            />
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchPage;
