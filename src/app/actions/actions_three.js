"use server";
import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: " https://6aec9ca46ed5408d922a6b08e0459821.us-central1.gcp.cloud.es.io:443",
  auth: {
    apiKey: "OW5tOUw0NEIxeUQzcUxUUXhuQmI6b2hzY0xwUHZSNXlBTkFQc3lvbnhVQQ==",
  },
});

export async function handleSearchThree(
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
          filter: noFilters
            ? []
            : {
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
        filtered: {
          filter: {
            bool: {
              should: [
                ...(selectedApplications.length > 0
                  ? [
                      {
                        terms: { "applications.keyword": selectedApplications },
                      },
                    ]
                  : []),
                ...(selectedTechnologies.length > 0
                  ? [
                      {
                        terms: { "technologies.keyword": selectedTechnologies },
                      },
                    ]
                  : []),
              ],
              minimum_should_match:
                selectedApplications.length > 0 ||
                selectedTechnologies.length > 0
                  ? 1
                  : 0,
            },
          },
          aggs: {
            unique_applications: {
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
                      : [{ match_all: {} }]),
                  ],
                  minimum_should_match: selectedApplications.length > 0 ? 1 : 0,
                },
              },
              aggs: {
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
            unique_technologies: {
              filter: {
                bool: {
                  should: [
                    ...(selectedTechnologies.length > 0
                      ? [
                          {
                            terms: {
                              "technologies.keyword": selectedTechnologies,
                            },
                          },
                        ]
                      : [{ match_all: {} }]),
                  ],
                  minimum_should_match: selectedTechnologies.length > 0 ? 1 : 0,
                },
              },
              aggs: {
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
          },
        },
      },
    },
  };
  let response = await client.search(elasticSearchParams);
  const data = response;
  const documents = data.hits.hits.map((hit) => hit._source);

  const total = data.hits.total;
  console.log(
    data.aggregations.filtered.unique_applications.unique_types.buckets,
  );

  const uniqueApplications = data.aggregations.unique_applications
    ? data.aggregations.unique_applications.buckets.map((bucket) => bucket.key)
    : [];

  const uniqueTechnologies = data.aggregations.unique_technologies
    ? data.aggregations.unique_technologies.buckets.map((bucket) => bucket.key)
    : [];

  const uniqueTypes = Array.from(
    new Set([
      ...(data.aggregations.filtered.unique_applications
        ? data.aggregations.filtered.unique_applications.unique_types.buckets.map(
            (typeBucket) => typeBucket.key,
          )
        : []),
      ...(data.aggregations.filtered.unique_technologies
        ? data.aggregations.filtered.unique_technologies.unique_types.buckets.map(
            (typeBucket) => typeBucket.key,
          )
        : []),
    ]),
  );

  const uniqueOrganizations = Array.from(
    new Set([
      ...(data.aggregations.filtered.unique_applications
        ? data.aggregations.filtered.unique_applications.unique_organizations.buckets.map(
            (orgBucket) => orgBucket.key,
          )
        : []),
      ...(data.aggregations.filtered.unique_technologies
        ? data.aggregations.filtered.unique_technologies.unique_organizations.buckets.map(
            (orgBucket) => orgBucket.key,
          )
        : []),
    ]),
  );

  const uniqueCountries = Array.from(
    new Set([
      ...(data.aggregations.filtered.unique_applications
        ? data.aggregations.filtered.unique_applications.unique_countries.buckets.map(
            (countryBucket) => countryBucket.key,
          )
        : []),
      ...(data.aggregations.filtered.unique_technologies
        ? data.aggregations.filtered.unique_technologies.unique_countries.buckets.map(
            (countryBucket) => countryBucket.key,
          )
        : []),
    ]),
  );

  const uniqueDates = Array.from(
    new Set([
      ...(data.aggregations.filtered.unique_applications
        ? data.aggregations.filtered.unique_applications.unique_dates.buckets.map(
            (dateBucket) => dateBucket.key_as_string.substring(0, 10),
          )
        : []),
      ...(data.aggregations.filtered.unique_technologies
        ? data.aggregations.filtered.unique_technologies.unique_dates.buckets.map(
            (dateBucket) => dateBucket.key_as_string.substring(0, 10),
          )
        : []),
    ]),
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