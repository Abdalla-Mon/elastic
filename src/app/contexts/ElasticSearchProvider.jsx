"use client";
import { useState } from "react";
import { ElasticSearchContext } from "./ElasticSearchContext";
import { handleSearch } from "@/app/actions/actions";
import { FILTER_FIELDS } from "@/app/filterFields";

export const ElasticSearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(25);
  const [error, setError] = useState(null);
  const filter = FILTER_FIELDS.reduce((acc, field) => {
    acc[field.uiName] = [];
    return acc;
  }, {});

  const [selectedFilters, setSelectedFilters] = useState({
    ...filter,
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const filterArgs = FILTER_FIELDS.map(
        (field) => selectedFilters[field.uiName],
      );

      const data = await handleSearch(search, page - 1, size, ...filterArgs);
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
        selectedFilters,
        setSelectedFilters,
      }}
    >
      {children}
    </ElasticSearchContext.Provider>
  );
};
