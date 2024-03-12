import {TextField} from "@mui/material";
import {ElasticSearchContext} from "@/app/contexts/ElasticSearchContext";
import {useContext} from "react";

export default function ElasticSearchField(){
    const {search,setSearch}=useContext(ElasticSearchContext)
    function handleInputChange(e){
        setSearch(e.target.value)
    }
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

