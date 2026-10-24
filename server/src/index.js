// Serveri işə salır: node src/index.js
import { createServer } from 'node:http'
import { openDb } from './db.js'
import { createApp } from './app.js'
import { getConfig } from './env.js'
import { seed } from './seed.js'

const config = getConfig()
const db = openDb(config.dbPath)

// Baza boşdursa, demo məlumatla doldur (Render kimi yerlərdə ilk açılış üçün)
if (!db.prepare('SELECT 1 FROM users LIMIT 1').get()) {
  seed(db)
  console.log('Baza boş idi — demo məlumat yazıldı.')
}

const server = createServer(createApp({ db, jwtSecret: config.jwtSecret, origins: config.origins, log: true }))
server.listen(config.port, () => {
  console.log(`Relove API: http://localhost:${config.port}/api`)
})

const shutdown = () => server.close(() => { db.close(); process.exit(0) })
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
