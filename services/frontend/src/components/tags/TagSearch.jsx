import React, { useEffect, useState } from "react";
import { FormControl, Container, Card, Row } from "react-bootstrap";
import Tag from "./Tag";
import useVisible from "../../useVisible";
import './Tags.css';

const TagSearch = ({ tags, onTagToggle }) => {
  const { ref, isVisible, setIsVisible } = useVisible(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Container
      className="col-md-3 rounded search-container "
      ref={ref}
    >
      <FormControl
        className="search-bar"
        placeholder="Search Tags"
        onInput={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsVisible(true)}
      />

      {isVisible && (
        <div className="tag-scroll">
          <Row className="tag-row">
            {tags
              .filter((tag) => tag.selected)
              .map((tag) => {
                return <Tag key={tag.id} tag={tag} toggle={onTagToggle} />;
              })}
          </Row>
          <hr />

          <Row className="tag-row">
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
        </div>
      )}
    </Container>
  );
};

export default TagSearch;
