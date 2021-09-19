import React, { useState, useEffect } from 'react';
import api from '../api.js';

export const useTags = () => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const fetchTags = () => {
    api
      .getTags()
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => {
        console.log('Could not get any tags ' + err.message);
      });
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    setTags,
    selectedTags,
    setSelectedTags,
    refetchTags: fetchTags,
  };
};
