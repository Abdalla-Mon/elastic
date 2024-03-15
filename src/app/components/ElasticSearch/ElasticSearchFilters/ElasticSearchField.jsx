import {TextField} from "@mui/material";
import {ElasticSearchContext} from "@/app/contexts/ElasticSearchContext";
import {useContext, useEffect} from "react";

export default function ElasticSearchField(){
    const {search,setSearch}=useContext(ElasticSearchContext)
    function handleInputChange(e){
        setSearch(e.target.value)
    }
    useEffect(() => {
        if(!search || search.length === 0){
            setSearch("")
        }

    },[search]);
    return (
          <TextField
                id="outlined-basic"
                label="Search"
                variant="filled"
                value={search}
                onChange={handleInputChange}
                fullWidth
          />
    )
}

