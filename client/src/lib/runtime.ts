const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() || null;

function normalizeApiBaseUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error("VITE_API_BASE_URL must be a valid absolute URL.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("VITE_API_BASE_URL must use HTTP or HTTPS.");
  }

  if (import.meta.env.PROD && parsedUrl.protocol !== "https:") {
    throw new Error("VITE_API_BASE_URL must use HTTPS in production.");
  }

  parsedUrl.hash = "";
  parsedUrl.search = "";

  return parsedUrl.toString().replace(/\/+$/, "");
}

const normalizedRouterBase =
  import.meta.env.BASE_URL.replace(/\/+$/, "");

export const apiBaseUrl = normalizeApiBaseUrl(
  configuredApiBaseUrl,
);

export const hasExternalApi = apiBaseUrl !== null;

export const routerBase =
  normalizedRouterBase && normalizedRouterBase !== "/"
    ? normalizedRouterBase
    : undefined;

export function getApiUrl(path: string): string {
  const normalizedPath = path.replace(/^\/+/, "");

  if (!apiBaseUrl) {
    return `/${normalizedPath}`;
  }

  return new URL(
    normalizedPath,
    `${apiBaseUrl}/`,
  ).toString();
}