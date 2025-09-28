import { fetcherRN } from "./fetcherRN";

export async function fetchSlidersRN() {
  const data: any = await fetcherRN("/global/sliders");
  const items = data?.items ?? data?.data ?? [];
  return Array.isArray(items) ? items : [];
}