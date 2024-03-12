"use server"
import { Client } from "@elastic/elasticsearch";

const client = new Client({
    node: " https://6aec9ca46ed5408d922a6b08e0459821.us-central1.gcp.cloud.es.io:443",
    auth: {
        apiKey: "OW5tOUw0NEIxeUQzcUxUUXhuQmI6b2hzY0xwUHZSNXlBTkFQc3lvbnhVQQ==",
    },
});

export async function handleSearch(q,page = 1,size=2) {

    const elasticSearchParams = {
        index: "main",
        size: size,
        from: page,
        body: {
            query: {
                multi_match: {
                    query: q,
                    fields: ["abstract", "title"],
                },
            },
        },
    };
    let data = await client.search(elasticSearchParams);
    const documents = data.hits.hits.map((hit) => hit._source);

    const total = data.hits.total;
    return {documents,total:total.value};
}
