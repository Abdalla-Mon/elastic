// "use client"
// import {useState} from "react";
// import {handleSearch} from "@/app/actions/actions";
//
// export default function Home() {
//     const [search,setSearch]=useState("")
//
//     const  handleInputChange =async (e) => {
//         await handleSearch(e.target.value).then(data => {
//             setSearch(data);
//         });
//     }
//     return (
//           <main>
//               <div>
//                   <form noValidate>
//                       <input type="text" placeholder="Search" onChange={handleInputChange} />
//                   </form>
//               </div>
//           </main>
//     );
// }
import ElasticSearch from "@/app/components/ElasticSearch/ElasticSearch";

export default function Home() {
    return <ElasticSearch />
}