import { useState, useContext, useEffect } from "react";
import { Autocomplete } from "@mui/material";
import { TextField, Chip } from "@mui/material";
import { ElasticSearchContext } from "@/app/contexts/ElasticSearchContext";
import {handleSearch} from "@/app/actions/actions";

export function CategoriesFilter() {
    const { search, selectedApplications, page, size, setSelectedApplications, selectedTechnologies, setSelectedTechnologies } = useContext(ElasticSearchContext);
    const [data, setData] = useState([]);
    const [fetchQuery, setFetchQuery] = useState(search);

    useEffect(() => {
        const fetchData = async () => {
            const newData = await handleSearch(fetchQuery, page-1, size, selectedApplications, selectedTechnologies, true);
            setData(newData);
        };
        fetchData();
    }, [fetchQuery, page, size]);

    useEffect(() => {
        if (search !== fetchQuery) {
            setFetchQuery(search);
        }
    }, [search]);

    const uniqueApplications = data?.uniqueApplications || [];
    const uniqueTechnologies = data?.uniqueTechnologies || [];
    useEffect(() => {
            setFetchQuery(search);
            const newSelectedApplications = selectedApplications.filter(app => uniqueApplications.includes(app)    )
            setSelectedApplications(newSelectedApplications);
            const newSelectedTechnologies = selectedTechnologies.filter(tech => uniqueTechnologies.includes(tech));
            setSelectedTechnologies(newSelectedTechnologies);

    }, [data]);
function handleAppsChange(newValue) {
    setSelectedApplications(newValue);
}
function handleTechsChange(newValue) {
    setSelectedTechnologies(newValue);
}
    return (
          <div className=" w-full flex flex-col gap-5 pt-8   border-r border-[#2f528f] p-5 ">
              <Autocomplete
                    multiple
                    id="application-select"
                    options={uniqueApplications}
                    value={selectedApplications}
                    onChange={(event, newValue) => {
                        handleAppsChange(newValue);
                    }}

                    renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="Application" />
                    )}
                    renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })}  key={option+index} />
                          ))
                    }
              />

              <Autocomplete
                    multiple
                    id="technology-select"
                    options={uniqueTechnologies}
                    value={selectedTechnologies}
                    onChange={(event, newValue) => {
                        handleTechsChange(newValue);
                    }}
                    renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="Technology" />
                    )}
                    renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })}    key={option+index}/>
                          ))
                    }
              />
          </div>
    );
}