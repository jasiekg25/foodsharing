import React, { useEffect, useState } from "react";
import { FormControl, Container, Col, Row , Button} from "react-bootstrap";
import Tag from "./Tag";
import "./Tags.css";
import { HiXCircle } from "react-icons/hi";

const TagSearch = ({ tags, onTagToggle, close, containerStyle, searchButton }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTags, setShowTags] = useState(false);

  return (
    <Container className={containerStyle}>
      <Row>
        <Col md={9}>
          <FormControl
            className="search-bar"
            placeholder="Tags"
            onClick={(e) => setShowTags(true)}
            onInput={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
          <Col md={3}>
              {searchButton &&(
                  <Button className="search-button" variant="success" onClick={(e) => setShowTags(false)}>Search</Button>)
              }
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
        {showTags ?
            (<Row className="tag-row tag-scroll hide-scroll">
        {tags
          .filter(
            (tag) =>
              !tag.selected &&
              tag.tag_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((tag) => {
            return <Tag key={tag.id} tag={tag} toggle={onTagToggle} />;
          })}
      </Row>) : null}
    </Container>
  );
};

export default TagSearch;
