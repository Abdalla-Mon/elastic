import { Button, TextField } from "@mui/material";
import { ElasticSearchContext } from "@/app/contexts/ElasticSearchContext";
import { useContext, useEffect, useState } from "react";

export default function ElasticSearchField() {
  const { search, setSearch } = useContext(ElasticSearchContext);
  const [searchValue, setSearchValue] = useState("");

  function handleInputChange(e) {
    setSearchValue(e.target.value);
  }

  useEffect(() => {
    if (!searchValue || searchValue.length === 0) {
      setSearch("");
    }
  }, [searchValue]);
  return (
    <div className={"flex gap-5 items-center"}>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="filled"
        value={searchValue}
        onChange={handleInputChange}
        fullWidth
      />
      <Button
        onClick={() => {
          const trimmedValue = searchValue.trim();
          setSearch(trimmedValue);
        }}
        className="py-3 bg-blue-500 text-white px-5 hover:bg-blue-400" // Tailwind CSS classes
      >
        Search
      </Button>
    </div>
  );
}
