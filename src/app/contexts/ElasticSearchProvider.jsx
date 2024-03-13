"use client"
import { useState} from "react";
import { ElasticSearchContext } from "./ElasticSearchContext";
import { handleSearch } from "@/app/actions/actions";

export const ElasticSearchProvider = ({ children }) => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(25);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize ]= useState(16);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [selectedTechnologies, setSelectedTechnologies] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!search || search.length === 0) {
                setData(null);

                setLoading(false);
                return;
            }
            const data = await handleSearch(search, page - 1, size,selectedApplications,selectedTechnologies);
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
                    selectedApplications, setSelectedApplications,
                    selectedTechnologies, setSelectedTechnologies
                }}
          >
              {children}
          </ElasticSearchContext.Provider>
    );
};