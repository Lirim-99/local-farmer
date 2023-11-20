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
      mainCategory: 'Cereals',
      subcategories: [
        'Maize', 'Rice', 'Wheat', 'Barley', 'Sorghum', 'Millet', 'Oats', 'Triticale', 'Rye',
        'Fonio', 'Buckwheat', 'Quinoa', 'Chia'
      ],
    },
    {
      mainCategory: 'Legumes',
      subcategories: [
        'Beans', 'Soybeans', 'Chickpeas', 'Peanuts', 'Lentils', 'Lupins', 'Grass peas',
        'Carob', 'Tamarind'
      ],
    },
    {
      mainCategory: 'Nuts',
      subcategories: [
        'Almond', 'Brazil nut', 'Cashew', 'Chestnut', 'Coconut', 'Hazelnut', 'Macadamia', 'Peanut',
        'Pecan', 'Pine nuts', 'Pistachio', 'Walnut', 'Acorns', 'Beech nuts'
      ],
    },
  ];
  


  const initialCategory = category?.mainCategory || '';
  const initialSubCategory = category?.subCategories || [];

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
    const selectedMainCategory = e.target.value;
    setMainCategory(selectedMainCategory);
    console.log('Selected Main Category:', selectedMainCategory);

    
    // Reset subcategories when changing the main category
    setSubCategories([]);
  
    dispatch({
      type: 'UPDATE_DETAILS',
      payload: {
        price: costType === 0 ? 0 : 15, // Get price from state or set default
        category: {
          mainCategory: selectedMainCategory,
          subCategories: [],
        },
      },
    });
  };
  
  const handleSubCategoryChange = (e) => {
    const selectedSubCategories = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
    setSubCategories(selectedSubCategories);
    console.log('Selected Sub Categories:', selectedSubCategories);

    dispatch({
      type: 'UPDATE_DETAILS',
      payload: {
        price: costType === 0 ? 0 : 15, // Get price from state or set default
        category: {
          mainCategory,
          subCategories: selectedSubCategories,
        },
      },
    });
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
        <InputLabel id="category-label">Select Main Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          value={mainCategory}
          onChange={handleMainCategoryChange}
          sx={{ width: '100%' }}
        >
          {categories.map((category) => (
            <MenuItem value={category.mainCategory} key={category.mainCategory}>
              {category.mainCategory}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {mainCategory && (
        <FormControl sx={{ width: '50%' }}>
          <InputLabel id="subcategory-label">Select Subcategories</InputLabel>
          <Select
            labelId="subcategory-label"
            id="subcategory"
            multiple
            value={subCategories}
            onChange={handleSubCategoryChange}
            renderValue={(selected) => selected.join(', ')}
            sx={{ width: '100%' }}
          >
            {categories.find((cat) => cat.mainCategory === mainCategory)?.subcategories.map((subcategory) => (
  <MenuItem value={subcategory} key={subcategory}>
    {subcategory}
  </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

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
