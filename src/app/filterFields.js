export const indexName = "main";
export const FILTER_FIELDS = [
  {
    uiName: "applications",
    filterId: "applications.keyword",
  },
  {
    uiName: "technologies",
    filterId: "technologies.keyword",
  },
  {
    uiName: "types",
    filterId: "type.keyword",
  },
  {
    uiName: "organizations",
    filterId: "organisation_name.keyword",
  },
  {
    uiName: "countries",
    filterId: "country.keyword",
  },
  {
    uiName: "dates",
    filterId: "filter_date",
  },
];
export const queryFields = ["title", "abstract"];
export const titleFields = queryFields[0];
export const descriptionField = queryFields[1];
export const displayFields = [
  {
    arrayOfData: "organisation_name",
    extra: "country",
    uiName: "Organizations",
  },
  {
    arrayOfData: "applications",
    uiName: "Applications",
  },
  {
    arrayOfData: "technologies",
    uiName: "Technologies",
  },
];
