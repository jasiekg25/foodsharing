import React from "react";
import { Col, Button } from "react-bootstrap";
import './Tags.css';


const Tag = ({ tag, toggle }) => {
  return (
    <Col md="auto" className="tag-col">
      <Button
        className="tag-btn"
        variant={tag.selected ? "success" : "outline-secondary"}
        onClick={() => {
          toggle(tag);
        }}
      >
        #{tag.tag_name}
      </Button>
    </Col>
  );
};

export default Tag;
