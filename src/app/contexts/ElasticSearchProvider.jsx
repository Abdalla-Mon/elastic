"use client";
import { useState } from "react";
import { ElasticSearchContext } from "./ElasticSearchContext";
import { handleSearch } from "@/app/actions/actions";
import { handleSearchTwo } from "@/app/actions/actoins_two";

export const ElasticSearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(25);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await handleSearchTwo(
        search,
        page - 1,
        size,
        selectedApplications,
        selectedTechnologies,
        selectedTypes,
        selectedOrganizations,
        selectedCountries,
        selectedDate,
      );
      setData(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <ElasticSearchContext.Provider
      value={{
        search,
        setSearch,
        data,
        setData,
        loading,
        setLoading,
        page,
        setPage,
        size,
        setSize,
        error,
        setError,
        fetchData,
        fontSize,
        setFontSize,
        selectedApplications,
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
      }}
    >
      {children}
    </ElasticSearchContext.Provider>
  );
};
