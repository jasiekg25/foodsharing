import React from "react";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";

const TagSearch = ({ tags, selectedTags, setSelectedTags }) => {
  return (
    <Autocomplete
      multiple
      id="tags-standard"
      value={selectedTags}
      onChange={(event, newValue) => {
        setSelectedTags(newValue);
      }}
      options={tags}
      getOptionLabel={(tag) => `#${tag.tag_name}`}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" placeholder="Select Tags" />
      )}
      renderTags={(value, getTagProps) =>
        value.map((tag, index) => (
          <Chip
            label={`#${tag.tag_name}`}
            {...getTagProps({ index })}
          />
        ))
      }
      style={{
        marginLeft: "10px",
        width: "75%",
      }}
    />
  );
};

export default TagSearch;
