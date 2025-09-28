import { Platform } from "react-native";

export async function fetcherRN(endpoint: string, options: RequestInit = {}) {
  const base =
    process.env.EXPO_PUBLIC_API_BASE_URL || "https://ecom-api.virleaf.com";
  const url = endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;

  const timeoutMs = 8000;

  // Dev proxy (override in env if you run a local proxy)
  const DEV_PROXY_PREFIX =
    process.env.EXPO_PUBLIC_CORS_PROXY || "http://localhost:3001/proxy?url=";

  const useProxy = typeof __DEV__ !== "undefined" && __DEV__;

  const defaultCredentials = options.credentials ?? (Platform.OS === "web" ? undefined : "include");

  const makeFetch = async (fetchUrl: string, signal: AbortSignal) => {
    const fetchOptions: RequestInit = {
      ...options,
      credentials: defaultCredentials,
      signal,
    };

    const res = await fetch(fetchUrl, fetchOptions);
    const contentType = res.headers?.get?.("content-type") ?? "";
    const text = await res.text();

    if (!res.ok) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
      const error: any = new Error(`API Error: ${res.status} ${res.statusText}`);
      error.status = res.status;
      error.response = parsed;
      throw error;
    }

    return contentType.includes("application/json") ? JSON.parse(text) : text;
  };

  // First try direct
  const controller1 = new AbortController();
  const tid1 = setTimeout(() => controller1.abort(), timeoutMs);
  try {
    const result = await makeFetch(url, controller1.signal);
    clearTimeout(tid1);
    return result;
  } catch (err) {
    clearTimeout(tid1);

    // If in dev, try proxy fallback (omit credentials when going through proxy)
    if (useProxy) {
      try {
        console.warn("[fetcherRN] Direct fetch failed; trying dev CORS proxy:", (err as any)?.message ?? err);
        const controller2 = new AbortController();
        const tid2 = setTimeout(() => controller2.abort(), timeoutMs * 1.5);
        const proxiedUrl = `${DEV_PROXY_PREFIX}${encodeURIComponent(url)}`;

        const resText = await fetch(proxiedUrl, {
          // do not forward credentials through public proxy
          credentials: "omit",
          signal: controller2.signal,
        }).then((r) => r.text());

        clearTimeout(tid2);

        try {
          return JSON.parse(resText);
        } catch {
          return resText;
        }
      } catch (proxyErr) {
        clearTimeout(undefined);
        console.error("[fetcherRN] Proxy attempt failed:", proxyErr);
        throw proxyErr;
      }
    }

    // Not dev or proxy disabled
    throw err;
  }
}




















// export async function fetcherRN(endpoint: string, options: RequestInit = {}) {
//     const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecom-api.virleaf.com";
//     const url = endpoint.startsWith("/") ? `${base}${endpoint}` : endpoint;

//     const controller = new AbortController();
//     const timeoutMs = 5000;
//     const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

//     try {
//         const res = await fetch(url, {
//             credentials: "include",
//             signal: controller.signal,
//             ...options,
//         });
//         clearTimeout(timeoutId);

//         const contentType = res.headers.get?.("content-type") ?? "";
//         const isJson = contentType.includes("application/json");
//         const text = await res.text();

//         if (!res.ok) {
//             let errorResponse;
//             try {
//                 errorResponse = JSON.parse(text);
//             } catch {
//                 errorResponse = text;
//             }
//             const error: any = new Error(`API Error: ${res.status} ${res.statusText}`);
//             error.status = res.status;
//             error.response = errorResponse;
//             throw error;
//         }

//         return isJson ? JSON.parse(text) : text;
//     } catch (err: any) {
//         clearTimeout(timeoutId);
//         if (err.name === "AbortError") {
//             const timeoutError: any = new Error(`Request timed out after ${timeoutMs}ms`);
//             timeoutError.status = 504;
//             throw timeoutError;
//         }
//         if (err.status === 500) {
//             console.warn(`[fetcherRN] Server 500 on ${endpoint}, returning empty data`);
//             return { data: [] };
//         }
//         console.error("[fetcherRN] Error:", { message: err.message, url, options });
//         throw err;
//     }
// }

// // helper to match your original fetchSliders
// export async function fetchSlidersRN() {
//     const data = await fetcherRN("/global/sliders");
//     const items = (data as any).items ?? (data as any).data ?? [];
//     return Array.isArray(items) ? items : [];
// }
