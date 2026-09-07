const API_URL = import.meta.env.VITE_API_URL || "/api";
const BACKEND_ORIGIN = API_URL.replace(/\/api\/?$/, "");
export function assetUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_ORIGIN}${path}`;
}
