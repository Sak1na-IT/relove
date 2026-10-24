// Backend ilə əlaqə: bütün sorğular buradan keçir.
// Server ünvanı .env-dəki VITE_API_URL-dən gəlir, yoxdursa lokal server.
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'
const TOKEN_KEY = 'relove-token'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* gizli rejimdə localStorage olmaya bilər */
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const token = getToken()
  let res
  try {
    res = await fetch(BASE_URL + path, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Serverə qoşulmaq olmadı. Server açıqdırmı?')
  }
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }
  if (!res.ok) {
    // Token etibarsızdırsa, sil — istifadəçi yenidən daxil olsun
    if (res.status === 401 && token) setToken(null)
    throw new ApiError(res.status, data?.message || 'Xəta baş verdi')
  }
  return data
}

// Bütün aktiv elanları səhifə-səhifə gətirir
export async function fetchAllListings() {
  const items = []
  for (let offset = 0; offset < 2000; offset += 100) {
    const page = await api(`/listings?limit=100&offset=${offset}`)
    items.push(...page.items)
    if (items.length >= page.total || page.items.length === 0) break
  }
  return items
}
