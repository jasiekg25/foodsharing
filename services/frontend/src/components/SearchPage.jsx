import React, { useEffect, useState } from "react";
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
    padding: 0,
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  map: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}));

const SearchPage = () => {
  const classes = useStyles();

  const { tags, selectedTags, setSelectedTags } = useTags();
  const { mapRef, center, setCenter, fitPoint } = useMap({
    lat: 50.06143,
    lng: 19.93658,
  });
  const [offers, setOffers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [sortBy, setSortBy] = useState("localization");

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
    queryOffers(queryTags, pageNumber)
  };

  const searchUpdate = (sortByUpdated=sortBy) => {
    let queryTags = selectedTags.map((tag) => tag.id).join(",");
    let pageNumber = 1;
    setPageCount(pageNumber);
    queryOffers(queryTags, pageNumber, sortByUpdated);
  };

  const queryOffers = (queryTags, pageNumber, sortByUpdated=sortBy) => {
    api
    .getOffers(pageNumber, center.lat, center.lng, queryTags, sortByUpdated)
    .then((res) => {
      setOffers(res.data);
      setSelected(null);
      setSortBy(sortByUpdated);
      setHasNextPage(true);
      if (res.data.length < 15)
        setHasNextPage(false);
    })
    .catch((err) => {
      console.log("Could not get any offers " + err.message);
      setHasNextPage(false);
    });
  }

  const onOfferSelect = (offer) => {
    if(selected) selected.expanded = !selected.expanded
    setSelected(offer);
    offer.expanded = true
    fitPoint({ lat: offer.pickup_latitude, lng: offer.pickup_longitude });
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item md={6} xs={12}>
          <Grid item lg={12} md={12} sm={12} xs={12} style={{padding: 0}}>
            <Toolbar
              variant="regular"
              style={{
                paddingTop: "20px",
                alignItems: "center",
                textAlign: "center",
                justifyContent: "center"
              }}
            >
              <SortSelect
                sortBy={sortBy}
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
          </Grid>
        </Grid>
        <Grid item md={6} className={classes.map}>
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
