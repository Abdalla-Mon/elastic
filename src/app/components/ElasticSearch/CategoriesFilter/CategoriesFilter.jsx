import { useState, useContext, useEffect } from "react";
import { Autocomplete } from "@mui/material";
import { TextField, Chip } from "@mui/material";
import { ElasticSearchContext } from "@/app/contexts/ElasticSearchContext";
import { handleSearch } from "@/app/actions/actions";
import { handleSearchTwo } from "@/app/actions/actoins_two";

export function CategoriesFilter() {
  const {
    search,
    selectedApplications,
    page,
    size,
    setSelectedApplications,
    selectedTechnologies,
    setSelectedTechnologies,
    selectedTypes,
    setSelectedTypes,
    selectedOrganizations,
    setSelectedOrganizations,
    selectedCountries,
    setSelectedCountries,
    selectedDate,
    setSelectedDate,
  } = useContext(ElasticSearchContext);
  let [data, setData] = useState([]);
  const [fetchQuery, setFetchQuery] = useState(search);
  const [currentFilter, setCurrentFilter] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      let newData = await handleSearchTwo(
        fetchQuery,
        page - 1,
        size,
        selectedApplications,
        selectedTechnologies,
        selectedTypes,
        selectedOrganizations,
        selectedCountries,
        selectedDate,
        true,
      );
      if (currentFilter) {
        newData[currentFilter] = data[currentFilter];
      }
      setData(newData);
    };
    fetchData();
  }, [
    fetchQuery,
    page,
    size,
    selectedApplications,
    selectedTechnologies,
    selectedTypes,
    selectedOrganizations,
    selectedCountries,
    selectedDate,
  ]);

  useEffect(() => {
    if (search !== fetchQuery) {
      setFetchQuery(search);
    }
  }, [search]);

  let uniqueApplications = data?.uniqueApplications || [];
  let uniqueTechnologies = data?.uniqueTechnologies || [];
  let uniqueTypes = data?.uniqueTypes || [];
  let uniqueOrganizations = data?.uniqueOrganizations || [];
  let uniqueCountries = data?.uniqueCountries || [];
  let uniqueDates = data?.uniqueDates || [];

  function handleAppsChange(newValue) {
    setSelectedApplications(newValue);
    setCurrentFilter(newValue.length && "uniqueApplications");
  }

  function handleTechsChange(newValue, reason) {
    setSelectedTechnologies(newValue);
    setCurrentFilter(newValue.length && "uniqueTechnologies");
  }

  function handleTypesChange(newValue) {
    setSelectedTypes(newValue);
    setCurrentFilter(newValue.length && "uniqueTypes");
  }

  function handleOrgsChange(newValue) {
    setSelectedOrganizations(newValue);
    setCurrentFilter(newValue.length && "uniqueOrganizations");
  }

  function handleCountriesChange(newValue) {
    setSelectedCountries(newValue);
    setCurrentFilter(newValue.length && "uniqueCountries");
  }

  function handleDateChange(newValue) {
    setSelectedDate(newValue);
    setCurrentFilter(newValue.length && "uniqueDates");
  }

  const filters = [
    {
      id: "application-select",
      options: uniqueApplications,
      value: selectedApplications,
      onChange: handleAppsChange,
      label: "Application",
    },
    {
      id: "technology-select",
      options: uniqueTechnologies,
      value: selectedTechnologies,
      onChange: handleTechsChange,
      label: "Technology",
    },
    {
      id: "type-select",
      options: uniqueTypes,
      value: selectedTypes,
      onChange: handleTypesChange,
      label: "Type",
    },
    {
      id: "organization-select",
      options: uniqueOrganizations,
      value: selectedOrganizations,
      onChange: handleOrgsChange,
      label: "Organization",
    },
    {
      id: "country-select",
      options: uniqueCountries,
      value: selectedCountries,
      onChange: handleCountriesChange,
      label: "Country",
    },
    {
      id: "date-select",
      options: uniqueDates,
      value: Array.isArray(selectedDate) ? selectedDate : [],
      onChange: handleDateChange,
      label: "Date",
    },
  ];

  return (
    <div className=" w-full flex flex-col gap-5 pt-8   border-r border-[#2f528f] p-5 ">
      {filters.map((filter) => (
        <Autocomplete
          multiple
          id={filter.id}
          options={filter.options}
          key={filter.id}
          value={filter.value}
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
