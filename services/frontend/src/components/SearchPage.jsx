import React, { useEffect, useState } from "react";
import TagSearch from "./tags/TagSearch";
import { Row, Container, Button } from "react-bootstrap";
import Tag from "./tags/Tag";
import Offers from "./Offers";
import {Redirect} from "react-router-dom";


const mockTags = [
  {
    id: 1,
    tag_name: "Free",
    selected: false,
  },
  {
    id: 2,
    tag_name: "Vegan",
    selected: false,
  },
  {
    id: 3,
    tag_name: "Vegetarian",
    selected: false,
  },
  {
    id: 4,
    tag_name: "GlutenFree",
    selected: false,
  },
  {
    id: 5,
    tag_name: "Diary",
    selected: false,
  },
  {
    id: 6,
    tag_name: "DiaryFree",
    selected: false,
  },
  {
    id: 7,
    tag_name: "Sweet",
    selected: false,
  },
  {
    id: 8,
    tag_name: "Meat",
    selected: false,
  },
  {
    id: 9,
    tag_name: "Soup",
    selected: false,
  },
  {
    id: 10,
    tag_name: "Vegetables",
    selected: false,
  },
];

const SearchPage = ({ isLoggedIn }) => {
  const [tags, setTags] = useState([]);
  const [tagSearchVisible, setTagSearchVisible] = useState(false);

  useEffect(() => {
    // TODO: when there is an endpoint for this add "selected" field
    // api
    //   .getTags()
    //   .then((res) => setTags(res.data))
    //   .catch((err) => console.log("Could not get any tags " + err.message));

    setTags(mockTags);
  }, []);

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
      {!tagSearchVisible && (
        <Button onClick={() => setTagSearchVisible(true)}>Add Tags</Button>
      )}
      <Container>
        <Row>
          {tags
            .filter((tag) => tag.selected)
            .map((tag) => {
              return <Tag key={tag.id} tag={tag} toggle={onTagToggle} />;
            })}
        </Row>
      </Container>
      {tagSearchVisible && (
        <TagSearch
          tags={tags}
          onTagToggle={onTagToggle}
          close={() => setTagSearchVisible(false)}
          containerStyle="col-md-3 search-container"
        />
      )}

      <Offers />
    </div>
  );
};

export default SearchPage;
