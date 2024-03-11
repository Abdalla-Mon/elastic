"use client"
import {useState} from "react";
import {handleSearch} from "@/app/actions/actions";

export default function Home() {
    const [search,setSearch]=useState("")

    const  handleInputChange =async (e) => {
        await handleSearch(e.target.value).then(data => {
            setSearch(data);
        });
    }
    console.log(search)
    return (
          <main>
              <div>
                  <form noValidate>
                      <input type="text" placeholder="Search" onChange={handleInputChange} />
                  </form>
              </div>
          </main>
    );
}