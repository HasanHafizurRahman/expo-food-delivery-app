import { fetcherRN } from "./fetcherRN";

export async function getPromotionsRN() {
  try {
    const json: any = await fetcherRN("/global/promotions");
    const promotions =
      Array.isArray(json?.data?.promotions) ? json.data.promotions :
      Array.isArray(json?.data) ? json.data :
      Array.isArray(json) ? json :
      [];
    return promotions;
  } catch (err) {
    console.error("[getPromotionsRN]", err);
    return [];
  }
}
