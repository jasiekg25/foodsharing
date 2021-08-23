import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import './sortSelect.css';

export default function SortSelect({sortBy, setSortBy, searchFunction}) {
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    const updatedValue = event.target.value
    console.log(updatedValue)
    setSortBy(updatedValue);
    searchFunction(updatedValue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className="sort-container">
      <p>Sort by:</p>
      <FormControl>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={sortBy}
          onChange={handleChange}
        >
          <MenuItem value="localization">Localization</MenuItem>
          <MenuItem value="rating">Rating</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
