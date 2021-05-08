import React, { useEffect, useState } from "react";
import TagSearch from "./tags/TagSearch";
import { Row, Container } from "react-bootstrap";
import Tag from "./tags/Tag";
import Offers from "./Offers";

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
];

const SearchPage = ({ isLoggedIn }) => {
  const [tags, setTags] = useState([]);

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

  return (
    <div>
      <Container>
        <Row>
          {tags
            .filter((tag) => tag.selected)
            .map((tag) => {
              return <Tag key={tag.id} tag={tag} toggle={onTagToggle} />;
            })}
        </Row>
      </Container>
      <TagSearch tags={tags} onTagToggle={onTagToggle} />

      <Offers isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default SearchPage;
