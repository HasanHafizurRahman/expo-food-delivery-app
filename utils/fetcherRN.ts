export async function fetcherRN(endpoint: string, options: RequestInit = {}) {
  const base =
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    "https://ecom-api.virleaf.com"; 

; // set your base in env for Expo
  const url = endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;

  const controller = new AbortController();
  const timeoutMs = 5000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // DEV-only proxy (change to a proxy you prefer)
  const DEV_PROXY_PREFIX =
    process.env.EXPO_PUBLIC_CORS_PROXY || "https://api.allorigins.win/raw?url=";

  const useProxy = typeof __DEV__ !== "undefined" && __DEV__; // only in dev

  // helper to do a single fetch
  const doFetch = async (fetchUrl: string) => {
    const res = await fetch(fetchUrl, {
      credentials: "include",
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers?.get?.("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const text = await res.text();

    if (!res.ok) {
      let errorResponse;
      try {
        errorResponse = JSON.parse(text);
      } catch {
        errorResponse = text;
      }
      const error: any = new Error(`API Error: ${res.status} ${res.statusText}`);
      error.status = res.status;
      error.response = errorResponse;
      throw error;
    }

    return isJson ? JSON.parse(text) : text;
  };

  try {
    // Try direct first (same as production)
    return await doFetch(url);
  } catch (err: any) {
    clearTimeout(timeoutId);

    // If in dev, try proxy fallback
    if (useProxy) {
      try {
        console.warn("[fetcherRN] Direct fetch failed; trying dev CORS proxy:", err?.message);
        const proxiedUrl = `${DEV_PROXY_PREFIX}${encodeURIComponent(url)}`;
        // Reset controller for second attempt
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), timeoutMs);
        const resText = await fetch(proxiedUrl, {
          credentials: "include",
          signal: controller2.signal,
          ...options,
        }).then((r) => r.text());
        clearTimeout(timeoutId2);

        // AllOrigins returns raw body; try to parse JSON
        try {
          return JSON.parse(resText);
        } catch {
          return resText;
        }
      } catch (proxyErr) {
        console.error("[fetcherRN] Proxy attempt failed:", proxyErr);
        throw proxyErr;
      }
    }

    // Not dev or proxy disabled: rethrow original error
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

// helper similar to your original
export async function fetchSlidersRN() {
  const data: any = await fetcherRN("/global/sliders");
  const items = data?.items ?? data?.data ?? [];
  return Array.isArray(items) ? items : [];
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
