import { fetcherRN } from "./fetcherRN";


export async function getFeaturedCategoriesRN() {
  try {
    const json: any = await fetcherRN("/global/categories/featured");
    const categories =
      Array.isArray(json.data?.categories) ? json.data.categories :
      Array.isArray(json.data) ? json.data :
      Array.isArray(json) ? json :
      [];
    return categories;
  } catch (err) {
    console.error("[getFeaturedCategoriesRN]", err);
    return [];
  }
}
