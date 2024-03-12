"use client"
import {Card, CardContent, Skeleton, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {handleSearch} from "@/app/actions/actions";

export default function ElasticSearch() {
    const [data,setData]=useState()
    const [loading,setLoading]=useState(false)
        const  handleInputChange =async (e) => {
        setLoading(true)
        await handleSearch(e.target.value).then(data => {
            setData(data);
        });
        setLoading(false)
    }
  return (
    <div className={"container mx-auto"}>
   <div className={"searchBar py-3"}>
       <TextField id="filled-basic" label="Search" variant="filled"
                  onChange={handleInputChange}
       sx={{width: "100%"}}
       />
       <DataContainer data={data} loading={loading} />
   </div>
    </div>
  );
}
function DataContainer({data,loading}){
    if(!data){
        return <p>No data</p>
    }
    if(data.length==0){
        return <p>No data matched the result</p>
    }

    return(
                    <div className={"dataContainer"}>
                        {loading &&
                              [1,2,3,4].map((item, index) => {
                                  return (
                                          <Skeleton key={index} variant="rectangular"  height={600}  className={"max-w-full md:max-w-[600px] mx-auto my-5"} />
                                  );
                              })

                        }
          {data.map((item, index) => {
                return (
                        <ElasticCard data={item} key={index} />
                );
            })}
                    </div>
    )
}
function ElasticCard({data}){
    return(
          <div className={"max-w-full md:max-w-[600px] mx-auto my-5"}>
          <Card  >
              <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                      {data.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                      {data.abstract}
                  </Typography>
              </CardContent>
          </Card>
          </div>
    )
}
