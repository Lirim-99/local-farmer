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
      details: { title, description, price, category },
    },
    dispatch,
  } = useValue();
  const categories = [
    {
      name: 'Cereals',
      subcategories: [
        'Maize', 'Rice', 'Wheat', 'Barley', 'Sorghum', 'Millet', 'Oats', 'Triticale', 'Rye',
        'Fonio', 'Buckwheat', 'Quinoa', 'Chia'
      ],
    },
    {
      name: 'Legumes',
      subcategories: [
        'Beans', 'Soybeans', 'Chickpeas', 'Peanuts', 'Lentils', 'Lupins', 'Grass peas',
        'Carob', 'Tamarind'
      ],
    },
    {
      name: 'Nuts',
      subcategories: [
        'Almond', 'Brazil nut', 'Cashew', 'Chestnut', 'Coconut', 'Hazelnut', 'Macadamia', 'Peanut',
        'Pecan', 'Pine nuts', 'Pistachio', 'Walnut', 'Acorns', 'Beech nuts'
      ],
    },
  ];
  

  const initialCategory = category.mainCategory || ''; // Assuming category.mainCategory holds the main category
  const initialSubCategory = category.subCategories || [];

  const [costType, setCostType] = useState(price ? 1 : 0);

  const [mainCategory, setMainCategory] = useState(initialCategory);
  const [subCategories, setSubCategories] = useState(initialSubCategory)

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
  const handleMainCategoryChange = (e) => {
    setMainCategory(e.target.value);
    // Reset subcategories when changing the main category
    setSubCategories([]);
  };
  const handleSubCategoryChange = (e) => {
    const selectedSubCategories = Array.isArray(e.target.value)
      ? e.target.value
      : [e.target.value];
    setSubCategories(selectedSubCategories);
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
          <FormControlLabel
            value={1}
            control={<Radio />}
            label="Nominal Fee"
          />
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
        value={subCategories}
        onChange={handleSubCategoryChange}
        renderValue={(selected) => selected.join(', ')}
        sx={{ width: '100%' }}
      >
        {categories.map((category) => (
          <optgroup label={category.name} key={category.name}>
            {category.subcategories.map((subcategory) => (
              <MenuItem value={subcategory} key={subcategory}>
                {subcategory}
              </MenuItem>
            ))}
          </optgroup>
        ))}
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
