import React, { useEffect, useState } from "react";
import { FormControl, Container, Card, Row } from "react-bootstrap";
import Tag from "./Tag";
import useVisible from "../../useVisible";

// TODO: to będzie przyjmować tags jako props, wyciągamy tags poziom wyżej
const TagSearch = ({ tags, onTagToggle }) => {
  const { ref, isVisible, setIsVisible } = useVisible(false);
  const [searchQuery, setSearchQuery] = useState("");

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
                return <Tag key={tag.id} tag={tag} toggle={onTagToggle} />;
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
                return <Tag key={tag.id} tag={tag} toggle={onTagToggle} />;
              })}
          </Row>
        </>
      )}
    </Container>
  );
};

export default TagSearch;
