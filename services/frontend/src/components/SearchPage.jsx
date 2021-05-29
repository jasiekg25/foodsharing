import React, { useEffect, useState } from "react";
import TagSearch from "./tags/TagSearch";
import { Row, Container, Button } from "react-bootstrap";
import Tag from "./tags/Tag";
import Offers from "./Offers";
import {Redirect} from "react-router-dom";
import api from "../api";

const SearchPage = ({ isLoggedIn }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    api.getTags()
        .then((res) => {
          let tagsData = res.data;
          for(let tag of tagsData){
            tag['selected'] = false;
          }
          setTags(tagsData);
        })
        .catch((err) => {
          console.log("Could not get any tags " + err.message);
        })
  }, [])

  const onTagToggle = (tag) => {
    const index = tags.findIndex((el) => el.id === tag.id);
    let newTags = [...tags];
    newTags[index] = { ...tag, selected: !tag.selected };

    setTags(newTags);
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
      }

      <Offers />
    </div>
  );
};

export default SearchPage;
