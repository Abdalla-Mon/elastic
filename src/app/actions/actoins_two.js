"use server";
import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: " https://6aec9ca46ed5408d922a6b08e0459821.us-central1.gcp.cloud.es.io:443",
  auth: {
    apiKey: "OW5tOUw0NEIxeUQzcUxUUXhuQmI6b2hzY0xwUHZSNXlBTkFQc3lvbnhVQQ==",
  },
});

export async function handleSearchTwo(
  q,
  page = 1,
  size = 2,
  selectedApplications = [],
  selectedTechnologies = [],
  selectedTypes = [],
  selectedOrganizations = [],
  selectedCountries = [],
  selectedDate = null,
  noFilters = false,
) {
  const elasticSearchParams = {
    index: "main",
    size: size,
    from: page,
    body: {
      query: {
        bool: {
          must: [
            q === ""
              ? { match_all: {} }
              : {
                  multi_match: {
                    query: q,
                    fields: ["abstract", "title"],
                  },
                },
          ],
          filter: {
            bool: {
              should: [
                ...(selectedApplications.length > 0
                  ? [
                      {
                        terms: {
                          "applications.keyword": selectedApplications,
                        },
                      },
                    ]
                  : []),
                ...(selectedTechnologies.length > 0
                  ? [
                      {
                        terms: {
                          "technologies.keyword": selectedTechnologies,
                        },
                      },
                    ]
                  : []),
                ...(selectedTypes.length > 0
                  ? [{ terms: { "type.keyword": selectedTypes } }]
                  : []),
                ...(selectedOrganizations.length > 0
                  ? [
                      {
                        terms: {
                          "organisation_name.keyword": selectedOrganizations,
                        },
                      },
                    ]
                  : []),
                ...(selectedCountries.length > 0
                  ? [{ terms: { "country.keyword": selectedCountries } }]
                  : []),
                ...(selectedDate.length > 0
                  ? [{ terms: { filter_date: selectedDate } }]
                  : []),
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
        unique_types: {
          terms: {
            field: "type.keyword",
          },
        },
        unique_organizations: {
          terms: {
            field: "organisation_name.keyword",
          },
        },
        unique_countries: {
          terms: {
            field: "country.keyword",
          },
        },
        unique_dates: {
          terms: {
            field: "filter_date",
          },
        },
      },
    },
  };

  let response = await client.search(elasticSearchParams);
  const data = response;
  const documents = data.hits.hits.map((hit) => hit._source);

  const total = data.hits.total;
  const uniqueApplications = data.aggregations.unique_applications.buckets.map(
    (bucket) => bucket.key,
  );
  const uniqueTechnologies = data.aggregations.unique_technologies.buckets.map(
    (bucket) => bucket.key,
  );
  const uniqueTypes = data.aggregations.unique_types.buckets.map(
    (bucket) => bucket.key,
  );
  const uniqueOrganizations =
    data.aggregations.unique_organizations.buckets.map((bucket) => bucket.key);
  const uniqueCountries = data.aggregations.unique_countries.buckets.map(
    (bucket) => bucket.key,
  );
  const uniqueDates = data.aggregations.unique_dates.buckets.map((bucket) =>
    bucket.key_as_string.substring(0, 10),
  );
  return {
    documents,
    total: total.value,
    uniqueApplications,
    uniqueTechnologies,
    uniqueTypes,
    uniqueOrganizations,
    uniqueCountries,
    uniqueDates,
  };
}
