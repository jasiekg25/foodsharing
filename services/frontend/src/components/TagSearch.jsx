import React, { useEffect, useState } from "react";
import { FormControl, Container, Card, Row } from "react-bootstrap";
import Tag from "./Tag";
import useVisible from "../useVisible";

// TODO: to będzie przyjmować tags jako props, wyciągamy tags poziom wyżej
const TagSearch = () => {
  const { ref, isVisible, setIsVisible } = useVisible(false);
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // TODO: when there is an endpoint for this add "selected" field
    // api
    //   .getTags()
    //   .then((res) => setTags(res.data))
    //   .catch((err) => console.log("Could not get any tags " + err.message));

    setTags([
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
    ]);
  }, []);

  const toogleTag = (tag) => {
    const index = tags.findIndex((el) => el.id === tag.id);
    let newTags = [...tags];
    newTags[index] = { ...tag, selected: !tag.selected };

    setTags(newTags);
  };

  return (
    <Container
      className="col-md-3 rounded"
      style={{ background: "white", padding: "0" }}
      ref={ref}
    >
      <FormControl
        placeholder="Search Tags"
        onInput={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsVisible(true)}
        style={{ marginBottom: "10px", height: "40px" }}
      />

      {isVisible && (
        <>
          <Row style={{ padding: "0px 15px" }}>
            {tags
              .filter((tag) => tag.selected)
              .map((tag) => {
                return <Tag key={tag.id} tag={tag} toggle={toogleTag} />;
              })}
          </Row>
          <hr />

          <Row style={{ padding: "0px 15px" }}>
            {tags
              .filter(
                (tag) =>
                  !tag.selected &&
                  tag.tag_name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((tag) => {
                return <Tag key={tag.id} tag={tag} toggle={toogleTag} />;
              })}
          </Row>
        </>
      )}
    </Container>
  );
};

export default TagSearch;
