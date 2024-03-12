"use server"

export async function handleSearch(search){
    const data= await fetch(`http://localhost:3001/api?q=${search}`)
          .then(response=>response.json())
          .then(data=> data
          )
    return await data;
}