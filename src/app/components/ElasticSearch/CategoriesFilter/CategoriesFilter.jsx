import { useState, useContext, useEffect } from "react";
import { Autocomplete } from "@mui/material";
import { TextField, Chip } from "@mui/material";
import { ElasticSearchContext } from "@/app/contexts/ElasticSearchContext";
import { handleSearch } from "@/app/actions/actions";
import { FILTER_FIELDS } from "@/app/filterFields";

export function CategoriesFilter() {
  const { search, page, size, selectedFilters, setSelectedFilters } =
    useContext(ElasticSearchContext);
  let [data, setData] = useState([]);
  const [fetchQuery, setFetchQuery] = useState(search);
  const [currentFilter, setCurrentFilter] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const filterArgs = FILTER_FIELDS.map(
        (field) => selectedFilters[field.uiName],
      );
      let newData = await handleSearch(
        fetchQuery,
        page - 1,
        size,
        ...filterArgs,
        true,
      );
      if (currentFilter) {
        newData[currentFilter] = data[currentFilter];
      }
      setData(newData);
    };
    fetchData();
  }, [fetchQuery, page, size, selectedFilters, search]);

  useEffect(() => {
    if (search !== fetchQuery) {
      setFetchQuery(search);
      setCurrentFilter(null);
      setSelectedFilters(
        FILTER_FIELDS.reduce((acc, field) => {
          acc[field.uiName] = [];
          return acc;
        }, {}),
      );
    }
  }, [search]);

  function handleFilterChange(filterName, newValue) {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: newValue,
    }));
    setCurrentFilter(
      newValue.length &&
        `unique${filterName.charAt(0).toUpperCase() + filterName.slice(1)}`,
    );
  }

  const filters = FILTER_FIELDS.map((field) => ({
    id: `${field.uiName}-select`,
    options:
      data?.[
        `unique${field.uiName.charAt(0).toUpperCase() + field.uiName.slice(1)}`
      ] || [],
    value: selectedFilters[field.uiName],
    onChange: (newValue) => handleFilterChange(field.uiName, newValue),
    label: field.uiName.charAt(0).toUpperCase() + field.uiName.slice(1),
  }));
  const filterDate = (selectedDate) =>
    Array.isArray(selectedDate) ? selectedDate : [];
  return (
    <div className=" w-full flex flex-col gap-5 pt-8   border-r border-[#2f528f] p-5 ">
      {filters.map((filter) => (
        <Autocomplete
          multiple={filter.id !== "filter_date"}
          id={filter.id}
          options={filter.options}
          key={filter.id}
          value={
            filter.id === "filter_date"
              ? filterDate(option)
              : filter.options.filter((option) => filter.value.includes(option))
          }
          onChange={(event, newValue) => {
            filter.onChange(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label={filter.label} />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                key={option + index}
              />
            ))
          }
        />
      ))}
    </div>
  );
}
