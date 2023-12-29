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
} from "@mui/material";
import { useState } from "react";
import { useValue } from "../../../context/ContextProvider";
import InfoField from "./InfoField";

const AddDetails = () => {
  const {
    state: {
      details: { title, description, category, form, currency, formValue, price },
    },
    dispatch,
  } = useValue();
  const initialCurrency = currency || "";
  const initialForm = form || "";
  const initialFormValue = formValue || "";
  const initialPrice = price || 0;


  const initialCategory = category?.mainCategory || "";
  const initialSubCategory = category?.subCategories || [];

  const [theCurrency, setTheCurrency] = useState(initialCurrency);
  const currencies = ["$ ", "€ ", "£ ", "CHF"];

  const [mainCategory, setMainCategory] = useState(initialCategory);
  const [subCategories, setSubCategories] = useState(initialSubCategory);

  const [selectedForm, setSelectedForm] = useState(initialForm);
  const [formsValue, setFormValue] = useState(initialFormValue); // Initialize with an appropriate default value
  const [productPrice, setPrice] = useState(initialPrice); 
  

  const categories = [
    {
      mainCategory: "Cereals",
      subcategories: [
        "Maize",
        "Rice",
        "Wheat",
        "Barley",
        "Sorghum",
        "Millet",
        "Oats",
        "Triticale",
        "Rye",
        "Fonio",
        "Buckwheat",
        "Quinoa",
        "Chia",
      ],
    },
    {
      mainCategory: "Legumes",
      subcategories: [
        "Beans",
        "Soybeans",
        "Chickpeas",
        "Peanuts",
        "Lentils",
        "Lupins",
        "Grass peas",
        "Carob",
        "Tamarind",
      ],
    },
    {
      mainCategory: "Nuts",
      subcategories: [
        "Almond",
        "Brazil nut",
        "Cashew",
        "Chestnut",
        "Coconut",
        "Hazelnut",
        "Macadamia",
        "Peanut",
        "Pecan",
        "Pine nuts",
        "Pistachio",
        "Walnut",
        "Acorns",
        "Beech nuts",
      ],
    },
    {
      mainCategory: "Fruits",
      subcategories: [
        "Apples",
        "Apricots ",
        "Açaí",
        "Avocados",
        "Bananas",
        "Blood limes",
        "Buddha’s Hand",
        "Carambola",
        "Cherries",
        "Crimson",
        "Dragonfruits",
        "Grapefruits",
        "Grapes",
        "Kiwifruit",
        "Lemons",
        "Limes",
        "Mango",
        "Nectarines",
        "Olives",
        "Oranges",
        "Papaya",
        "Pears",
        "Peaches",
        "Plums",
        "Pomegranates",
        "Quinces",
        "Tangerines",
        "Watermelons",
        "Yuzu",
      ],
    },
  ];

  const handlePriceChange = (newValue) => {
    setPrice(newValue);
    dispatch({ type: "UPDATE_DETAILS", payload: { price: newValue } });
  };

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    console.log(selectedCurrency, " selected");
    setTheCurrency(selectedCurrency);
    dispatch({
      type: "UPDATE_CURRENCY",
      payload: { currency: selectedCurrency },
    });
  };

  const handleFormChange = (e) => {
    const selectedForm = e.target.value;
    setSelectedForm(selectedForm);
    dispatch({ type: "UPDATE_FORM", payload: { form: selectedForm } });
  };
  const handleFormValueChange = (e) => {
    const value = e.target.value;
    setFormValue(value);
    dispatch({ type: "UPDATE_FORM_VALUE", payload: { formValue: value } });
  };

  const handleMainCategoryChange = (e) => {
    const selectedMainCategory = e.target.value;
    setMainCategory(selectedMainCategory);

    // Reset subcategories when changing the main category
    setSubCategories([]);

    dispatch({
      type: "UPDATE_DETAILS",
      payload: {
        price: productPrice, // Get price from state or set default
        category: {
          mainCategory: selectedMainCategory,
          subCategories: [],
        },
      },
    });
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategories = Array.isArray(e.target.value)
      ? e.target.value
      : [e.target.value];
    setSubCategories(selectedSubCategories);

    dispatch({
      type: "UPDATE_DETAILS",
      payload: {
        price: productPrice,
        category: {
          mainCategory,
          subCategories: selectedSubCategories,
        },
      },
    });
  };

  const renderFormTextField = () => {
    switch (form) {
      case "piece":
      case "kg":
      case "pound":
        return (
          <TextField
            label={
              form === "piece"
                ? "Number of Pieces"
                : form === "kg"
                ? "Kilograms"
                : "Pounds"
            }
            value={formsValue}
            onChange={handleFormValueChange}
            type="number"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack
      sx={{
        alignItems: "center",
        "& .MuiTextField-root": { width: "100%", maxWidth: 500, m: 1 },
      }}
    >
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={selectedForm}
        onChange={handleFormChange}
      >
        <FormControlLabel value="piece" control={<Radio />} label="Piece" />
        <FormControlLabel value="kg" control={<Radio />} label="Kg" />
        <FormControlLabel value="pound" control={<Radio />} label="Pound" />
      </RadioGroup>

      {renderFormTextField()}
      <TextField
        select
        label="Select Currency"
        id="currency"
        value={theCurrency}
        onChange={handleCurrencyChange}
      >
        {currencies.map((curr) => (
          <MenuItem key={curr} value={curr}>
            {curr}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Price"
        type="number"
        value={productPrice}
        onChange={(e) => handlePriceChange(e.target.value)}
        InputProps={{ step: "0.01" }}
      />

      <TextField
        select
        id="category"
        label="Select Categories"
        value={mainCategory}
        onChange={handleMainCategoryChange}
        sx={{ width: "100%" }}
      >
        {categories.map((category) => (
          <MenuItem value={category.mainCategory} key={category.mainCategory}>
            {category.mainCategory}
          </MenuItem>
        ))}
      </TextField>

      {mainCategory && (
        <TextField
          select
          label="Select Subcategories"
          value={subCategories}
          onChange={handleSubCategoryChange}
          SelectProps={{
            multiple: true,
            renderValue: (selected) => selected.join(", "),
          }}
          sx={{ width: "100%" }}
        >
          {categories
            .find((cat) => cat.mainCategory === mainCategory)
            ?.subcategories.map((subcategory) => (
              <MenuItem value={subcategory} key={subcategory}>
                {subcategory}
              </MenuItem>
            ))}
        </TextField>
      )}

      <InfoField
        mainProps={{ name: "title", label: "Title", value: title }}
        minLength={5}
      />
      <InfoField
        mainProps={{
          name: "description",
          label: "Description",
          value: description,
        }}
        minLength={10}
        optionalProps={{ multiline: true, rows: 4 }}
      />
    </Stack>
  );
};

export default AddDetails;
