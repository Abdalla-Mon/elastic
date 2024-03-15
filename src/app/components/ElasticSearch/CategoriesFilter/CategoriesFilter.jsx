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
  const [data, setData] = useState([]);
  const [fetchQuery, setFetchQuery] = useState(search);

  useEffect(() => {
    const fetchData = async () => {
      const newData = await handleSearchTwo(
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

  const uniqueApplications = data?.uniqueApplications || [];
  const uniqueTechnologies = data?.uniqueTechnologies || [];
  const uniqueTypes = data?.uniqueTypes || [];
  const uniqueOrganizations = data?.uniqueOrganizations || [];
  const uniqueCountries = data?.uniqueCountries || [];
  const uniqueDates = data?.uniqueDates || [];

  function handleAppsChange(newValue) {
    setSelectedApplications(newValue);
  }

  function handleTechsChange(newValue) {
    setSelectedTechnologies(newValue);
  }

  function handleTypesChange(newValue) {
    setSelectedTypes(newValue);
  }

  function handleOrgsChange(newValue) {
    setSelectedOrganizations(newValue);
  }

  function handleCountriesChange(newValue) {
    setSelectedCountries(newValue);
  }

  function handleDateChange(newValue) {
    setSelectedDate(newValue);
  }

  return (
    <div className=" w-full flex flex-col gap-5 pt-8   border-r border-[#2f528f] p-5 ">
      <Autocomplete
        multiple
        id="application-select"
        options={uniqueApplications}
        value={uniqueApplications.filter((option) =>
          selectedApplications.includes(option),
        )}
        onChange={(event, newValue) => {
          handleAppsChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Application" />
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
      <Autocomplete
        multiple
        id="technology-select"
        options={uniqueTechnologies}
        value={uniqueTechnologies.filter((option) =>
          selectedTechnologies.includes(option),
        )}
        onChange={(event, newValue) => {
          handleTechsChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Technology" />
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
      <Autocomplete
        multiple
        id="type-select"
        options={uniqueTypes}
        value={uniqueTypes.filter((option) => selectedTypes.includes(option))}
        onChange={(event, newValue) => {
          handleTypesChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Type" />
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
      <Autocomplete
        multiple
        id="organization-select"
        options={uniqueOrganizations}
        value={uniqueOrganizations.filter((option) =>
          selectedOrganizations.includes(option),
        )}
        onChange={(event, newValue) => {
          handleOrgsChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Organization" />
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
      <Autocomplete
        multiple
        id="country-select"
        options={uniqueCountries}
        value={uniqueCountries.filter((option) =>
          selectedCountries.includes(option),
        )}
        onChange={(event, newValue) => {
          handleCountriesChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Country" />
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
      <Autocomplete
        multiple
        id="date-select"
        options={uniqueDates}
        value={Array.isArray(selectedDate) ? selectedDate : []}
        onChange={(event, newValue) => {
          handleDateChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Date" />
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
    </div>
  );
}
