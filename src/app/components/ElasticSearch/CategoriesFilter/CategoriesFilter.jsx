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
    search,
  ]);

  useEffect(() => {
    if (search !== fetchQuery) {
      setFetchQuery(search);
      setCurrentFilter(null);
      setSelectedApplications([]);
      setSelectedTechnologies([]);
      setSelectedTypes([]);
      setSelectedOrganizations([]);
      setSelectedCountries([]);
      setSelectedDate([]);
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
