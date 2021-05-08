import React from "react";
import { Col, Button } from "react-bootstrap";

const Tag = ({ tag, toggle }) => {
  return (
    <Col md="auto" style={{ padding: "0" }}>
      <Button
        variant={tag.selected ? "success" : "outline-secondary"}
        onClick={() => {
          toggle(tag);
        }}
        style={{ margin: "5px" }}
      >
        #{tag.tag_name}
      </Button>
    </Col>
  );
};

export default Tag;
