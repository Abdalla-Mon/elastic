import {Skeleton} from "@mui/material";
import {useContext} from "react";
import {ElasticSearchContext} from "@/app/contexts/ElasticSearchContext";
import {ElasticCard} from "@/app/components/ElasticSearch/ElasticContent/ElasticCard";

export default function ElasticContainer(){
    let {data, loading} = useContext(ElasticSearchContext)
    if(!data||data.length==0){
        return <p>No data</p>
    }
    if(data.documents.length === 0){
        return <p>No data matched the result</p>
    }
    data = data.documents;

    return (
          <>
              {loading &&
                    [1,2,3,4].map((item, index) => {
                        return (
                              <Skeleton key={index} variant="rectangular"  height={600}  className={"max-w-full md:max-w-[600px] mx-auto my-5"} />
                        );
                    })
              }
              <div  className={" py-5 flex flex-col gap-5"}>
                  {data.map((item, index) => {
                      return (
                            <ElasticCard data={item} key={index} />
                      );
                  })}
              </div>
          </>
    )
}