"use server"
import { Client } from "@elastic/elasticsearch";

const client = new Client({
    node: " https://6aec9ca46ed5408d922a6b08e0459821.us-central1.gcp.cloud.es.io:443",
    auth: {
        apiKey: "OW5tOUw0NEIxeUQzcUxUUXhuQmI6b2hzY0xwUHZSNXlBTkFQc3lvbnhVQQ==",
    },
});

export async function handleSearch(q){
    const elasticSearchParams = {
        index: "main",
        size: 20,
        body: {
            query: {
                multi_match: {
                    query: q,
                    fields: ["abstract", "title"],
                },
            },
        },
    };
    const data = await client.search(elasticSearchParams);
    const documents = data.hits.hits.map((hit) => hit._source);

    return documents;
    // const response = await fetch(`https://elastic-ten.vercel.app/?q=${search}`);
    // if (!response.ok) {
    //     console.error("HTTP error! status: ", response.status);
    //     console.error("The actual response is: ", await response.text());
    //     return;
    // } else if (!response.headers.get("content-type").includes("application/json")) {
    //     console.error("The response is not JSON. The actual response is: ", await response.text());
    //     return;
    // }
    //
    // const data = await response.json();
    // console.log(data)
}