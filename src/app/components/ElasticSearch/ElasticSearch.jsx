"use client"
import { useContext, useEffect } from "react";
import { ElasticSearchContext } from "@/app/contexts/ElasticSearchContext";


import ElasticSearchField from "@/app/components/ElasticSearch/ElasticSearchFilters/ElasticSearchField";
import ElasticSizeOfItemsPerPage from "@/app/components/ElasticSearch/ElasticSearchFilters/ElasticSizeOfItemsPerPage";
import ElasticContainer from "@/app/components/ElasticSearch/ElasticContent/ElasticContainer";
import ElasticPagination from "@/app/components/ElasticSearch/ElasticSearchFilters/ElasticPagination";
import {FontSizeChanger} from "@/app/components/ElasticSearch/ElasticSearchFilters/FontSizeChange";

export default function ElasticSearch() {
    const {
        search,
        page,
        size,
        error,
        fetchData,
    } = useContext(ElasticSearchContext);

    useEffect(() => {
        fetchData(search, page, size);
    }, [search, page, size]);

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
          <div className={"container mx-auto px-5"}>
              <div className={"searchBar py-3"}>
                  <ElasticSearchField  />
                  <div className={"flex gap-5 flex-col sm:flex-row py-3"}>
                      <FontSizeChanger />
                  <ElasticSizeOfItemsPerPage />
                  </div>
                  <ElasticContainer />
                  <ElasticPagination />
              </div>
          </div>
    );
}