import React from 'react';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';

const defaultStyle = {
  marginLeft: '10px',
  width: '75%',
};

const TagSearch = ({
  tags,
  selectedTags,
  setSelectedTags,
  style = defaultStyle,
}) => {
  return (
    <Autocomplete
      fullWidth 
      multiple
      id='tags-standard'
      value={selectedTags}
      onChange={(event, newValue) => {
        setSelectedTags(newValue);
      }}
      options={tags}
      getOptionLabel={(tag) => `#${tag.tag_name}`}
      renderInput={(params) => (
        <TextField {...params} placeholder='Select Tags' variant='outlined' />
      )}
      renderTags={(value, getTagProps) =>
        value.map((tag, index) => (
          <Chip label={`#${tag.tag_name}`} {...getTagProps({ index })} />
        ))
      }
      style={style}
    />
  );
};

export default TagSearch;
