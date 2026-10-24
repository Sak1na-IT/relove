// .env faylını oxuyur (paketsiz). Mövcud mühit dəyişənləri üstün tutulur.
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

export const SERVER_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export function loadEnv() {
  const file = join(SERVER_DIR, '.env')
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (!m || line.trim().startsWith('#')) continue
    const value = m[2].replace(/^["']|["']$/g, '')
    if (process.env[m[1]] === undefined) process.env[m[1]] = value
  }
}

export function getConfig() {
  loadEnv()
  const isProd = process.env.NODE_ENV === 'production'
  const jwtSecret = process.env.JWT_SECRET || (isProd ? '' : 'relove-dev-secret-deyisin')
  if (!jwtSecret || (isProd && jwtSecret.length < 32)) {
    throw new Error('JWT_SECRET təyin olunmayıb və ya çox qısadır (ən azı 32 simvol).')
  }
  return {
    port: Number(process.env.PORT || 4000),
    jwtSecret,
    dbPath: resolve(SERVER_DIR, process.env.DATABASE_PATH || './data/relove.db'),
    origins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()).filter(Boolean),
  }
}
