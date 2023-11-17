import {
  FormControl,
  FormControlLabel,
  InputAdornment,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useValue } from '../../../context/ContextProvider';
import InfoField from './InfoField';

const AddDetails = () => {
  const {
    state: {
      details: { title, description, price, selectedCategories },
    },
    dispatch,
  } = useValue();
  const initialSelectedCategories = Array.isArray(selectedCategories)
    ? selectedCategories
    : [];

  const [costType, setCostType] = useState(price ? 1 : 0);
  const [categories, setCategories] = useState(initialSelectedCategories);
  const handleCostTypeChange = (e) => {
    const costType = Number(e.target.value);
    setCostType(costType);
    if (costType === 0) {
      dispatch({ type: 'UPDATE_DETAILS', payload: { price: 0 } });
    } else {
      dispatch({ type: 'UPDATE_DETAILS', payload: { price: 15 } });
    }
  };
  const handlePriceChange = (e) => {
    dispatch({ type: 'UPDATE_DETAILS', payload: { price: e.target.value } });
  };
  const handleCategoryChange = (e) => {
    setCategories(e.target.value);
  };
  return (
    <Stack
      sx={{
        alignItems: 'center',
        '& .MuiTextField-root': { width: '100%', maxWidth: 500, m: 1 },
      }}
    >
      <FormControl>
        <RadioGroup
          name="costType"
          value={costType}
          row
          onChange={handleCostTypeChange}
        >
          <FormControlLabel value={0} control={<Radio />} label="Free" />
          <FormControlLabel value={1} control={<Radio />} label="Nominal Fee" />
          {Boolean(costType) && (
            <TextField
              sx={{ width: '7ch !important' }}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              inputProps={{ type: 'number', min: 1, max: 50 }}
              value={price}
              onChange={handlePriceChange}
              name="price"
            />
          )}
        </RadioGroup>
      </FormControl>

      <FormControl sx={{ width: '50%' }}>
  <InputLabel id="category-label">Select Categories</InputLabel>
  <Select
    labelId="category-label"
    id="category"
    multiple
    value={categories}
    onChange={handleCategoryChange}
    renderValue={(selected) => selected.join(', ')}
    sx={{ width: '100%' }} // Set the width to 100%
  >
    {/* Render your categories dynamically */}
    <MenuItem value="Cereals">Cereals</MenuItem>
    <MenuItem value="Maize">Maize</MenuItem>
    {/* ... Add more categories and subcategories */}
  </Select>
</FormControl>


      <InfoField
        mainProps={{ name: 'title', label: 'Title', value: title }}
        minLength={5}
      />
      <InfoField
        mainProps={{
          name: 'description',
          label: 'Description',
          value: description,
        }}
        minLength={10}
        optionalProps={{ multiline: true, rows: 4 }}
      />
    </Stack>
  );
};

export default AddDetails;
