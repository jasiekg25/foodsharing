import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const TagSearch = ({ tags, selectedTags, setSelectedTags }) => {
  return (
    <div>
      <Autocomplete
        multiple
        id='tags-standard'
        value={selectedTags}
        onChange={(event, newValue) => {
          setSelectedTags(newValue);
        }}
        options={tags}
        getOptionLabel={(tag) => `#${tag.tag_name}`}
        renderInput={(params) => (
          <TextField {...params} variant='standard' placeholder='Select Tags' />
        )}
      />
    </div>
  );
};

export default TagSearch;
