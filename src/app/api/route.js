import { Client } from "@elastic/elasticsearch";

const client = new Client({
    node: " https://6aec9ca46ed5408d922a6b08e0459821.us-central1.gcp.cloud.es.io:443",
    auth: {
        apiKey: "OW5tOUw0NEIxeUQzcUxUUXhuQmI6b2hzY0xwUHZSNXlBTkFQc3lvbnhVQQ==",
    },
});

export async function GET(request) {
    const { searchParams } = request.nextUrl;
    let q = searchParams.get("q");
    let  itemsPerPage= searchParams.get("itemsPerPage");
    if(!itemsPerPage){
        itemsPerPage=20
    }
    const elasticSearchParams = {
        index: "main",
        size: itemsPerPage,
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

    return Response.json(documents);
}
