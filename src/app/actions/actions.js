"use server"
import { Client } from "@elastic/elasticsearch";

const client = new Client({
    node: " https://6aec9ca46ed5408d922a6b08e0459821.us-central1.gcp.cloud.es.io:443",
    auth: {
        apiKey: "OW5tOUw0NEIxeUQzcUxUUXhuQmI6b2hzY0xwUHZSNXlBTkFQc3lvbnhVQQ==",
    },
});

export async function handleSearch(q, page = 1, size = 2, selectedApplications = [], selectedTechnologies = [],noFilters=false) {
    const elasticSearchParams = {
        index: "main",
        size: size,
        from: page,
        body: {
            query: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query: q,
                                fields: ["abstract", "title"],
                            },
                        },
                    ],
                    filter: noFilters ? [] : {
                        bool: {
                            should: [
                                ...(selectedApplications.length > 0 ? [{ terms: { "applications.keyword": selectedApplications } }] : []),
                                ...(selectedTechnologies.length > 0 ? [{ terms: { "technologies.keyword": selectedTechnologies } }] : []),
                            ],
                            minimum_should_match: 1,
                        },
                    },
                },
            },
            aggs: {
                unique_applications: {
                    terms: {
                        field: "applications.keyword",
                    },
                },
                unique_technologies: {
                    terms: {
                        field: "technologies.keyword",
                    },
                },
            },
        },
    };
    let data = await client.search(elasticSearchParams);
    const documents = data.hits.hits.map((hit) => hit._source);

    const total = data.hits.total;
    const uniqueApplications = data.aggregations.unique_applications.buckets.map(bucket => bucket.key);
    const uniqueTechnologies = data.aggregations.unique_technologies.buckets.map(bucket => bucket.key);

    return { documents, total: total.value, uniqueApplications, uniqueTechnologies };
}