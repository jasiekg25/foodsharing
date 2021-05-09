import React, { useEffect, useState } from "react";
import { FormControl, Container, Col, Row } from "react-bootstrap";
import Tag from "./Tag";
import "./Tags.css";
import { HiXCircle } from "react-icons/hi";

const TagSearch = ({ tags, onTagToggle, close, containerStyle }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Container className={containerStyle}>
      <Row>
        <Col md={10}>
          <FormControl
            className="search-bar"
            placeholder="Search Tags"
            onInput={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={2} style={{ display: "inline-flex", alignItems: "center" }}>
          {!!close && <HiXCircle
            onClick={close}
            size={25}
            style={{ verticalAlign: "baseline" }}
          />}
        </Col>
      </Row>

      <Row className="tag-row">
        {tags
          .filter((tag) => tag.selected)
          .map((tag) => {
            return <Tag key={tag.id} tag={tag} toggle={onTagToggle} />;
          })}
      </Row>
      <hr />
      <Row className="tag-row tag-scroll hide-scroll">
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
    </Container>
  );
};

export default TagSearch;
