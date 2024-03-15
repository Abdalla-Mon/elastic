"use server";
import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: " https://6aec9ca46ed5408d922a6b08e0459821.us-central1.gcp.cloud.es.io:443",
  auth: {
    apiKey: "OW5tOUw0NEIxeUQzcUxUUXhuQmI6b2hzY0xwUHZSNXlBTkFQc3lvbnhVQQ==",
  },
});

const FIELD_NAMES = {
  applications: "applications.keyword",
  technologies: "technologies.keyword",
  type: "type.keyword",
  organisation_name: "organisation_name.keyword",
  country: "country.keyword",
  filter_date: "filter_date",
};

function createTermsObject(fieldName, values) {
  return values.length ? [{ terms: { [fieldName]: values } }] : [];
}

function createRangeObject(fieldName, value) {
  return value.length
    ? [
        {
          range: {
            [fieldName]: {
              gte: `${value}-01-01`,
              lte: `${value}-12-31`,
            },
          },
        },
      ]
    : [];
}

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
  currentFilter = null,
) {
  const mustQuery = [
    q === ""
      ? { match_all: {} }
      : {
          multi_match: {
            query: q,
            fields: ["abstract", "title"],
          },
        },
  ];

  const elasticSearchParams = {
    index: "main",
    size: size,
    from: page,
    body: {
      query: {
        bool: {
          must: mustQuery,
          filter: {
            bool: {
              must: [
                ...createTermsObject(
                  FIELD_NAMES.applications,
                  selectedApplications,
                ),
                ...createTermsObject(
                  FIELD_NAMES.technologies,
                  selectedTechnologies,
                ),
                ...createTermsObject(FIELD_NAMES.type, selectedTypes),
                ...createTermsObject(
                  FIELD_NAMES.organisation_name,
                  selectedOrganizations,
                ),
                ...createTermsObject(FIELD_NAMES.country, selectedCountries),
                ...createRangeObject(FIELD_NAMES.filter_date, selectedDate),
              ],
            },
          },
        },
      },
      aggs: {
        unique_applications: {
          terms: {
            field: FIELD_NAMES.applications,
          },
        },
        unique_technologies: {
          terms: {
            field: FIELD_NAMES.technologies,
          },
        },
        unique_types: {
          terms: {
            field: FIELD_NAMES.type,
          },
        },
        unique_organizations: {
          terms: {
            field: FIELD_NAMES.organisation_name,
          },
        },
        unique_countries: {
          terms: {
            field: FIELD_NAMES.country,
          },
        },
        unique_dates: {
          date_histogram: {
            field: FIELD_NAMES.filter_date,
            calendar_interval: "year",
            format: "yyyy",
          },
        },
      },
    },
  };

  const response = await client.search(elasticSearchParams);
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
  const uniqueDates = data.aggregations.unique_dates.buckets.map(
    (bucket) => bucket.key_as_string,
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
