const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"

export const PUBLIC_REVALIDATE_SECONDS = 60

export function joinUrl(base: string, path: string) {
  return `${base.replace(/\/$/, "")}${path}`
}

export function apiUrl(path: string) {
  return joinUrl(API_BASE, path)
}
