function parseServiceOrigin(raw: string, label: string): URL {
  const value = raw.trim();
  if (!value) {
    throw new Error(`${label} is not configured`);
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be an absolute URL`);
  }

  if (url.protocol !== "https:") {
    throw new Error(`${label} must use HTTPS`);
  }
  if (url.username || url.password) {
    throw new Error(`${label} must not contain embedded credentials`);
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(`${label} must be an origin only`);
  }

  return url;
}

export function resolveTrustedForgeOrigin(raw: string): string {
  const origin = parseServiceOrigin(raw, "BUILT_IN_FORGE_API_URL").origin;

  if (origin !== "https://forge.manus.im") {
    throw new Error(
      "BUILT_IN_FORGE_API_URL is not the approved Manus Forge origin"
    );
  }

  return "https://forge.manus.im";
}

export function resolveTrustedOAuthOrigin(raw: string): string {
  const origin = parseServiceOrigin(raw, "OAUTH_SERVER_URL").origin;

  if (origin !== "https://api.manus.im") {
    throw new Error("OAUTH_SERVER_URL is not the approved Manus OAuth origin");
  }

  return "https://api.manus.im";
}
