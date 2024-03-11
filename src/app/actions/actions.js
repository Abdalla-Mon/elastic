"use server"

export async function handleSearch(search){
    const data= await fetch(`https://elastic-ten.vercel.app/api?q=${search}`)
          .then(response=>response.json())
          .then(data=> data
          )
    return await data;
}