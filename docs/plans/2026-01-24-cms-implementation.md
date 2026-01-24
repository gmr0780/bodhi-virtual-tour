# Bodhi CMS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a CMS that allows a team to manage all Bodhi tour content and publish changes to GitHub.

**Architecture:** Monorepo with tour app (Vercel) and CMS app (Railway). CMS has React frontend + Node/Express API + PostgreSQL. On publish, CMS commits tourData.json and images to GitHub, triggering Vercel deploy.

**Tech Stack:** React, Tailwind CSS, Node.js, Express, PostgreSQL, Prisma ORM, GitHub OAuth, Octokit

---

## Task 1: Monorepo Setup

**Files:**
- Move: existing files → `apps/tour/`
- Create: `package.json` (workspace root)
- Create: `apps/cms/client/package.json`
- Create: `apps/cms/server/package.json`

**Step 1: Create monorepo structure**

```bash
cd /Users/gregory/Documents/bodhi-virtual-tour
mkdir -p apps/tour apps/cms/client apps/cms/server
```

**Step 2: Move tour app to apps/tour**

```bash
mv src apps/tour/
mv index.html apps/tour/
mv vite.config.js apps/tour/
mv tailwind.config.js apps/tour/
mv postcss.config.js apps/tour/
mv package.json apps/tour/
mv package-lock.json apps/tour/
```

**Step 3: Create root package.json for workspaces**

Create `package.json`:
```json
{
  "name": "bodhi-virtual-tour",
  "private": true,
  "workspaces": [
    "apps/*",
    "apps/cms/*"
  ],
  "scripts": {
    "tour:dev": "npm run dev -w apps/tour",
    "tour:build": "npm run build -w apps/tour",
    "cms:dev": "npm run dev -w apps/cms/server & npm run dev -w apps/cms/client",
    "cms:build": "npm run build -w apps/cms/client && npm run build -w apps/cms/server"
  }
}
```

**Step 4: Update tour's package.json name**

Edit `apps/tour/package.json`, change name to `@bodhi/tour`

**Step 5: Create CMS client package.json**

Create `apps/cms/client/package.json`:
```json
{
  "name": "@bodhi/cms-client",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.5.0",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.0",
    "vite": "^6.3.0"
  }
}
```

**Step 6: Create CMS server package.json**

Create `apps/cms/server/package.json`:
```json
{
  "name": "@bodhi/cms-server",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "build": "echo 'No build step needed'",
    "start": "node src/index.js",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@octokit/rest": "^21.0.0",
    "@prisma/client": "^6.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.21.0",
    "express-session": "^1.18.0",
    "multer": "^1.4.5-lts.1",
    "passport": "^0.7.0",
    "passport-github2": "^0.1.12"
  },
  "devDependencies": {
    "prisma": "^6.0.0"
  }
}
```

**Step 7: Install all dependencies**

```bash
cd /Users/gregory/Documents/bodhi-virtual-tour
npm install
cd apps/tour && npm install && cd ../..
cd apps/cms/client && npm install && cd ../../..
cd apps/cms/server && npm install && cd ../../..
```

**Step 8: Commit**

```bash
git add -A
git commit -m "refactor: convert to monorepo with tour and cms apps"
```

---

## Task 2: CMS Server - Basic Express Setup

**Files:**
- Create: `apps/cms/server/src/index.js`
- Create: `apps/cms/server/.env.example`

**Step 1: Create Express server**

Create `apps/cms/server/src/index.js`:
```javascript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`CMS Server running on http://localhost:${PORT}`)
})
```

**Step 2: Create .env.example**

Create `apps/cms/server/.env.example`:
```
PORT=3001
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/bodhi_cms
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REPO=gmr0780/bodhi-virtual-tour
GITHUB_TOKEN=your_github_token
SESSION_SECRET=your_session_secret
```

**Step 3: Test server starts**

```bash
cd apps/cms/server && npm run dev
```
Expected: "CMS Server running on http://localhost:3001"

**Step 4: Commit**

```bash
git add -A
git commit -m "feat(cms): add basic Express server setup"
```

---

## Task 3: Database Schema with Prisma

**Files:**
- Create: `apps/cms/server/prisma/schema.prisma`

**Step 1: Create Prisma schema**

Create `apps/cms/server/prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String    @id @default(uuid())
  githubId       Int       @unique
  githubUsername String
  avatarUrl      String?
  createdAt      DateTime  @default(now())
  publishes      Publish[]
}

model Role {
  id                String   @id @default(uuid())
  name              String
  description       String
  icon              String
  videoUrl          String   @default("")
  recommendedTopics String[] @default([])
  order             Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Topic {
  id          String   @id @default(uuid())
  name        String
  description String
  icon        String
  order       Int      @default(0)
  screens     Screen[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Screen {
  id        String    @id @default(uuid())
  topicId   String
  topic     Topic     @relation(fields: [topicId], references: [id], onDelete: Cascade)
  title     String
  imagePath String    @default("")
  order     Int       @default(0)
  hotspots  Hotspot[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Hotspot {
  id          String   @id @default(uuid())
  screenId    String
  screen      Screen   @relation(fields: [screenId], references: [id], onDelete: Cascade)
  x           Float
  y           Float
  title       String
  description String
  aiPowered   Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Setting {
  key   String @id
  value Json
}

model Publish {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  commitSha   String
  publishedAt DateTime @default(now())
}
```

**Step 2: Generate Prisma client**

```bash
cd apps/cms/server && npx prisma generate
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(cms): add Prisma schema for database"
```

---

## Task 4: Database Connection & Seed Data

**Files:**
- Create: `apps/cms/server/src/db.js`
- Create: `apps/cms/server/prisma/seed.js`

**Step 1: Create database client**

Create `apps/cms/server/src/db.js`:
```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
```

**Step 2: Create seed script to import existing tourData**

Create `apps/cms/server/prisma/seed.js`:
```javascript
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()

async function main() {
  // Read existing tourData.json
  const tourDataPath = path.join(__dirname, '../../../..', 'apps/tour/src/data/tourData.json')
  const tourData = JSON.parse(fs.readFileSync(tourDataPath, 'utf-8'))

  // Clear existing data
  await prisma.hotspot.deleteMany()
  await prisma.screen.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.role.deleteMany()
  await prisma.setting.deleteMany()

  // Seed roles
  for (let i = 0; i < tourData.roles.length; i++) {
    const role = tourData.roles[i]
    await prisma.role.create({
      data: {
        id: role.id,
        name: role.name,
        description: role.description,
        icon: role.icon,
        videoUrl: role.videoUrl || '',
        recommendedTopics: role.recommendedTopics,
        order: i
      }
    })
  }

  // Seed topics with screens and hotspots
  for (let i = 0; i < tourData.topics.length; i++) {
    const topic = tourData.topics[i]

    const createdTopic = await prisma.topic.create({
      data: {
        id: topic.id,
        name: topic.name,
        description: topic.description,
        icon: topic.icon,
        order: i
      }
    })

    for (let j = 0; j < topic.screens.length; j++) {
      const screen = topic.screens[j]

      const createdScreen = await prisma.screen.create({
        data: {
          id: screen.id,
          topicId: createdTopic.id,
          title: screen.title,
          imagePath: screen.image || '',
          order: j
        }
      })

      for (let k = 0; k < screen.hotspots.length; k++) {
        const hotspot = screen.hotspots[k]

        await prisma.hotspot.create({
          data: {
            id: hotspot.id,
            screenId: createdScreen.id,
            x: hotspot.x,
            y: hotspot.y,
            title: hotspot.title,
            description: hotspot.description,
            aiPowered: hotspot.aiPowered || false,
            order: k
          }
        })
      }
    }
  }

  // Seed settings
  await prisma.setting.create({
    data: {
      key: 'cta',
      value: tourData.cta
    }
  })

  await prisma.setting.create({
    data: {
      key: 'allowedUsers',
      value: []
    }
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**Step 3: Add seed script to package.json**

Add to `apps/cms/server/package.json` scripts:
```json
"db:seed": "node prisma/seed.js"
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat(cms): add database connection and seed script"
```

---

## Task 5: GitHub OAuth Authentication

**Files:**
- Create: `apps/cms/server/src/auth.js`
- Modify: `apps/cms/server/src/index.js`

**Step 1: Create auth configuration**

Create `apps/cms/server/src/auth.js`:
```javascript
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import prisma from './db.js'

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/api/auth/github/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user is allowed
      const settings = await prisma.setting.findUnique({ where: { key: 'allowedUsers' } })
      const allowedUsers = settings?.value || []

      // If no allowed users set, allow anyone (initial setup)
      if (allowedUsers.length > 0 && !allowedUsers.includes(profile.username)) {
        return done(null, false, { message: 'User not authorized' })
      }

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { githubId: parseInt(profile.id) }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            githubId: parseInt(profile.id),
            githubUsername: profile.username,
            avatarUrl: profile.photos?.[0]?.value || null
          }
        })
      }

      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  }
))

export default passport
```

**Step 2: Update index.js with auth routes**

Replace `apps/cms/server/src/index.js`:
```javascript
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import dotenv from 'dotenv'
import passport from './auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}))
app.use(passport.initialize())
app.use(passport.session())

// Auth middleware
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).json({ error: 'Unauthorized' })
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Auth routes
app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }))

app.get('/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login?error=unauthorized' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173')
  }
)

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json(req.user)
})

app.post('/api/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true })
  })
})

// Export for adding more routes
export { app, requireAuth }

app.listen(PORT, () => {
  console.log(`CMS Server running on http://localhost:${PORT}`)
})
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(cms): add GitHub OAuth authentication"
```

---

## Task 6: API Routes - Roles CRUD

**Files:**
- Create: `apps/cms/server/src/routes/roles.js`
- Modify: `apps/cms/server/src/index.js`

**Step 1: Create roles routes**

Create `apps/cms/server/src/routes/roles.js`:
```javascript
import { Router } from 'express'
import prisma from '../db.js'

const router = Router()

// Get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { order: 'asc' }
    })
    res.json(roles)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single role
router.get('/:id', async (req, res) => {
  try {
    const role = await prisma.role.findUnique({
      where: { id: req.params.id }
    })
    if (!role) {
      return res.status(404).json({ error: 'Role not found' })
    }
    res.json(role)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create role
router.post('/', async (req, res) => {
  try {
    const { name, description, icon, videoUrl, recommendedTopics } = req.body
    const maxOrder = await prisma.role.aggregate({ _max: { order: true } })

    const role = await prisma.role.create({
      data: {
        name,
        description,
        icon,
        videoUrl: videoUrl || '',
        recommendedTopics: recommendedTopics || [],
        order: (maxOrder._max.order || 0) + 1
      }
    })
    res.status(201).json(role)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update role
router.put('/:id', async (req, res) => {
  try {
    const { name, description, icon, videoUrl, recommendedTopics, order } = req.body
    const role = await prisma.role.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        icon,
        videoUrl,
        recommendedTopics,
        order
      }
    })
    res.json(role)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete role
router.delete('/:id', async (req, res) => {
  try {
    await prisma.role.delete({
      where: { id: req.params.id }
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Reorder roles
router.put('/reorder', async (req, res) => {
  try {
    const { orderedIds } = req.body
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.role.update({
          where: { id },
          data: { order: index }
        })
      )
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
```

**Step 2: Add routes to index.js**

Add after auth routes in `apps/cms/server/src/index.js`:
```javascript
import rolesRouter from './routes/roles.js'

// ... existing code ...

// API routes (all require auth)
app.use('/api/roles', requireAuth, rolesRouter)
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(cms): add roles API routes"
```

---

## Task 7: API Routes - Topics CRUD

**Files:**
- Create: `apps/cms/server/src/routes/topics.js`
- Modify: `apps/cms/server/src/index.js`

**Step 1: Create topics routes**

Create `apps/cms/server/src/routes/topics.js`:
```javascript
import { Router } from 'express'
import prisma from '../db.js'

const router = Router()

// Get all topics with screens and hotspots
router.get('/', async (req, res) => {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { order: 'asc' },
      include: {
        screens: {
          orderBy: { order: 'asc' },
          include: {
            hotspots: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })
    res.json(topics)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single topic
router.get('/:id', async (req, res) => {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: req.params.id },
      include: {
        screens: {
          orderBy: { order: 'asc' },
          include: {
            hotspots: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' })
    }
    res.json(topic)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create topic
router.post('/', async (req, res) => {
  try {
    const { name, description, icon } = req.body
    const maxOrder = await prisma.topic.aggregate({ _max: { order: true } })

    const topic = await prisma.topic.create({
      data: {
        name,
        description,
        icon,
        order: (maxOrder._max.order || 0) + 1
      }
    })
    res.status(201).json(topic)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update topic
router.put('/:id', async (req, res) => {
  try {
    const { name, description, icon, order } = req.body
    const topic = await prisma.topic.update({
      where: { id: req.params.id },
      data: { name, description, icon, order }
    })
    res.json(topic)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete topic
router.delete('/:id', async (req, res) => {
  try {
    await prisma.topic.delete({
      where: { id: req.params.id }
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
```

**Step 2: Add to index.js**

```javascript
import topicsRouter from './routes/topics.js'

app.use('/api/topics', requireAuth, topicsRouter)
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(cms): add topics API routes"
```

---

## Task 8: API Routes - Screens CRUD

**Files:**
- Create: `apps/cms/server/src/routes/screens.js`
- Modify: `apps/cms/server/src/index.js`

**Step 1: Create screens routes**

Create `apps/cms/server/src/routes/screens.js`:
```javascript
import { Router } from 'express'
import prisma from '../db.js'

const router = Router()

// Get all screens for a topic
router.get('/topic/:topicId', async (req, res) => {
  try {
    const screens = await prisma.screen.findMany({
      where: { topicId: req.params.topicId },
      orderBy: { order: 'asc' },
      include: {
        hotspots: {
          orderBy: { order: 'asc' }
        }
      }
    })
    res.json(screens)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single screen
router.get('/:id', async (req, res) => {
  try {
    const screen = await prisma.screen.findUnique({
      where: { id: req.params.id },
      include: {
        hotspots: {
          orderBy: { order: 'asc' }
        }
      }
    })
    if (!screen) {
      return res.status(404).json({ error: 'Screen not found' })
    }
    res.json(screen)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create screen
router.post('/', async (req, res) => {
  try {
    const { topicId, title, imagePath } = req.body
    const maxOrder = await prisma.screen.aggregate({
      where: { topicId },
      _max: { order: true }
    })

    const screen = await prisma.screen.create({
      data: {
        topicId,
        title,
        imagePath: imagePath || '',
        order: (maxOrder._max.order || 0) + 1
      }
    })
    res.status(201).json(screen)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update screen
router.put('/:id', async (req, res) => {
  try {
    const { title, imagePath, order } = req.body
    const screen = await prisma.screen.update({
      where: { id: req.params.id },
      data: { title, imagePath, order }
    })
    res.json(screen)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete screen
router.delete('/:id', async (req, res) => {
  try {
    await prisma.screen.delete({
      where: { id: req.params.id }
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
```

**Step 2: Add to index.js**

```javascript
import screensRouter from './routes/screens.js'

app.use('/api/screens', requireAuth, screensRouter)
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(cms): add screens API routes"
```

---

## Task 9: API Routes - Hotspots CRUD

**Files:**
- Create: `apps/cms/server/src/routes/hotspots.js`
- Modify: `apps/cms/server/src/index.js`

**Step 1: Create hotspots routes**

Create `apps/cms/server/src/routes/hotspots.js`:
```javascript
import { Router } from 'express'
import prisma from '../db.js'

const router = Router()

// Get all hotspots for a screen
router.get('/screen/:screenId', async (req, res) => {
  try {
    const hotspots = await prisma.hotspot.findMany({
      where: { screenId: req.params.screenId },
      orderBy: { order: 'asc' }
    })
    res.json(hotspots)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create hotspot
router.post('/', async (req, res) => {
  try {
    const { screenId, x, y, title, description, aiPowered } = req.body
    const maxOrder = await prisma.hotspot.aggregate({
      where: { screenId },
      _max: { order: true }
    })

    const hotspot = await prisma.hotspot.create({
      data: {
        screenId,
        x,
        y,
        title,
        description,
        aiPowered: aiPowered || false,
        order: (maxOrder._max.order || 0) + 1
      }
    })
    res.status(201).json(hotspot)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update hotspot
router.put('/:id', async (req, res) => {
  try {
    const { x, y, title, description, aiPowered, order } = req.body
    const hotspot = await prisma.hotspot.update({
      where: { id: req.params.id },
      data: { x, y, title, description, aiPowered, order }
    })
    res.json(hotspot)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete hotspot
router.delete('/:id', async (req, res) => {
  try {
    await prisma.hotspot.delete({
      where: { id: req.params.id }
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Batch update positions (for drag-drop)
router.put('/batch-positions', async (req, res) => {
  try {
    const { updates } = req.body // [{ id, x, y }, ...]
    await Promise.all(
      updates.map(({ id, x, y }) =>
        prisma.hotspot.update({
          where: { id },
          data: { x, y }
        })
      )
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
```

**Step 2: Add to index.js**

```javascript
import hotspotsRouter from './routes/hotspots.js'

app.use('/api/hotspots', requireAuth, hotspotsRouter)
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(cms): add hotspots API routes"
```

---

## Task 10: API Routes - Settings & Publish

**Files:**
- Create: `apps/cms/server/src/routes/settings.js`
- Create: `apps/cms/server/src/routes/publish.js`
- Modify: `apps/cms/server/src/index.js`

**Step 1: Create settings routes**

Create `apps/cms/server/src/routes/settings.js`:
```javascript
import { Router } from 'express'
import prisma from '../db.js'

const router = Router()

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany()
    const settingsObj = {}
    settings.forEach(s => {
      settingsObj[s.key] = s.value
    })
    res.json(settingsObj)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update setting
router.put('/:key', async (req, res) => {
  try {
    const { value } = req.body
    const setting = await prisma.setting.upsert({
      where: { key: req.params.key },
      update: { value },
      create: { key: req.params.key, value }
    })
    res.json(setting)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
```

**Step 2: Create publish routes**

Create `apps/cms/server/src/routes/publish.js`:
```javascript
import { Router } from 'express'
import { Octokit } from '@octokit/rest'
import prisma from '../db.js'

const router = Router()

// Generate tourData.json from database
async function generateTourData() {
  const roles = await prisma.role.findMany({ orderBy: { order: 'asc' } })
  const topics = await prisma.topic.findMany({
    orderBy: { order: 'asc' },
    include: {
      screens: {
        orderBy: { order: 'asc' },
        include: {
          hotspots: { orderBy: { order: 'asc' } }
        }
      }
    }
  })
  const settings = await prisma.setting.findUnique({ where: { key: 'cta' } })

  return {
    roles: roles.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      icon: r.icon,
      videoUrl: r.videoUrl,
      recommendedTopics: r.recommendedTopics
    })),
    topics: topics.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      icon: t.icon,
      screens: t.screens.map(s => ({
        id: s.id,
        title: s.title,
        image: s.imagePath,
        hotspots: s.hotspots.map(h => ({
          id: h.id,
          x: h.x,
          y: h.y,
          title: h.title,
          description: h.description,
          aiPowered: h.aiPowered
        }))
      }))
    })),
    cta: settings?.value || { text: 'Book a Demo', url: 'https://www.gobodhi.com/contact' }
  }
}

// Preview (get generated JSON without publishing)
router.get('/preview', async (req, res) => {
  try {
    const tourData = await generateTourData()
    res.json(tourData)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Publish to GitHub
router.post('/', async (req, res) => {
  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
    const [owner, repo] = process.env.GITHUB_REPO.split('/')

    // Generate tourData
    const tourData = await generateTourData()
    const content = JSON.stringify(tourData, null, 2)

    // Get current file SHA (needed for update)
    let sha
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: 'apps/tour/src/data/tourData.json'
      })
      sha = data.sha
    } catch (e) {
      // File doesn't exist yet
    }

    // Commit the file
    const { data: commitData } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'apps/tour/src/data/tourData.json',
      message: 'Update tour content from CMS',
      content: Buffer.from(content).toString('base64'),
      sha,
      committer: {
        name: 'Bodhi CMS',
        email: 'cms@gobodhi.com'
      }
    })

    // Record publish
    await prisma.publish.create({
      data: {
        userId: req.user.id,
        commitSha: commitData.commit.sha
      }
    })

    res.json({
      success: true,
      commitSha: commitData.commit.sha,
      commitUrl: commitData.commit.html_url
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get publish history
router.get('/history', async (req, res) => {
  try {
    const history = await prisma.publish.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 20,
      include: {
        user: {
          select: { githubUsername: true, avatarUrl: true }
        }
      }
    })
    res.json(history)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
```

**Step 3: Add to index.js**

```javascript
import settingsRouter from './routes/settings.js'
import publishRouter from './routes/publish.js'

app.use('/api/settings', requireAuth, settingsRouter)
app.use('/api/publish', requireAuth, publishRouter)
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat(cms): add settings and publish API routes"
```

---

## Task 11: Image Upload Route

**Files:**
- Create: `apps/cms/server/src/routes/upload.js`
- Modify: `apps/cms/server/src/index.js`

**Step 1: Create upload routes**

Create `apps/cms/server/src/routes/upload.js`:
```javascript
import { Router } from 'express'
import multer from 'multer'
import { Octokit } from '@octokit/rest'
import path from 'path'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// Upload image to GitHub
router.post('/screenshot', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
    const [owner, repo] = process.env.GITHUB_REPO.split('/')

    // Generate filename
    const ext = path.extname(req.file.originalname) || '.png'
    const filename = req.body.filename || `screenshot-${Date.now()}${ext}`
    const filepath = `public/screenshots/${filename}`

    // Check if file exists (get SHA for update)
    let sha
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: filepath
      })
      sha = data.sha
    } catch (e) {
      // File doesn't exist
    }

    // Upload to GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filepath,
      message: `Upload screenshot: ${filename}`,
      content: req.file.buffer.toString('base64'),
      sha,
      committer: {
        name: 'Bodhi CMS',
        email: 'cms@gobodhi.com'
      }
    })

    res.json({
      success: true,
      path: `/screenshots/${filename}`
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
```

**Step 2: Add to index.js**

```javascript
import uploadRouter from './routes/upload.js'

app.use('/api/upload', requireAuth, uploadRouter)
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(cms): add image upload to GitHub route"
```

---

## Task 12: CMS Client - Setup & Auth

**Files:**
- Create: `apps/cms/client/vite.config.js`
- Create: `apps/cms/client/tailwind.config.js`
- Create: `apps/cms/client/postcss.config.js`
- Create: `apps/cms/client/index.html`
- Create: `apps/cms/client/src/main.jsx`
- Create: `apps/cms/client/src/index.css`
- Create: `apps/cms/client/src/App.jsx`
- Create: `apps/cms/client/src/lib/api.js`

**Step 1: Create Vite config**

Create `apps/cms/client/vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
```

**Step 2: Create Tailwind config**

Create `apps/cms/client/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bodhi: {
          blue: '#0066CC',
          dark: '#1a1a2e',
          light: '#f8f9fa',
          accent: '#00d4aa',
        }
      }
    }
  },
  plugins: []
}
```

**Step 3: Create PostCSS config**

Create `apps/cms/client/postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

**Step 4: Create index.html**

Create `apps/cms/client/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bodhi CMS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Step 5: Create main.jsx**

Create `apps/cms/client/src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

**Step 6: Create index.css**

Create `apps/cms/client/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}
```

**Step 7: Create API helper**

Create `apps/cms/client/src/lib/api.js`:
```javascript
const API_URL = '/api'

async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return res.json()
}

export const api = {
  // Auth
  getMe: () => fetchAPI('/auth/me'),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),

  // Roles
  getRoles: () => fetchAPI('/roles'),
  createRole: (data) => fetchAPI('/roles', { method: 'POST', body: JSON.stringify(data) }),
  updateRole: (id, data) => fetchAPI(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRole: (id) => fetchAPI(`/roles/${id}`, { method: 'DELETE' }),

  // Topics
  getTopics: () => fetchAPI('/topics'),
  createTopic: (data) => fetchAPI('/topics', { method: 'POST', body: JSON.stringify(data) }),
  updateTopic: (id, data) => fetchAPI(`/topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTopic: (id) => fetchAPI(`/topics/${id}`, { method: 'DELETE' }),

  // Screens
  getScreens: (topicId) => fetchAPI(`/screens/topic/${topicId}`),
  createScreen: (data) => fetchAPI('/screens', { method: 'POST', body: JSON.stringify(data) }),
  updateScreen: (id, data) => fetchAPI(`/screens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteScreen: (id) => fetchAPI(`/screens/${id}`, { method: 'DELETE' }),

  // Hotspots
  getHotspots: (screenId) => fetchAPI(`/hotspots/screen/${screenId}`),
  createHotspot: (data) => fetchAPI('/hotspots', { method: 'POST', body: JSON.stringify(data) }),
  updateHotspot: (id, data) => fetchAPI(`/hotspots/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHotspot: (id) => fetchAPI(`/hotspots/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => fetchAPI('/settings'),
  updateSetting: (key, value) => fetchAPI(`/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),

  // Publish
  preview: () => fetchAPI('/publish/preview'),
  publish: () => fetchAPI('/publish', { method: 'POST' }),
  getPublishHistory: () => fetchAPI('/publish/history'),

  // Upload
  uploadScreenshot: async (file, filename) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('filename', filename)

    const res = await fetch(`${API_URL}/upload/screenshot`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    if (!res.ok) throw new Error('Upload failed')
    return res.json()
  }
}
```

**Step 8: Create App.jsx with auth**

Create `apps/cms/client/src/App.jsx`:
```jsx
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { api } from './lib/api'

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-bodhi-blue mb-2">Bodhi CMS</h1>
        <p className="text-gray-600 mb-6">Sign in to manage your virtual tour content</p>
        <a
          href="/api/auth/github"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Sign in with GitHub
        </a>
      </div>
    </div>
  )
}

function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-bodhi-blue">Bodhi CMS</h1>
          <div className="flex items-center gap-4">
            <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
            <span className="text-sm text-gray-600">{user.githubUsername}</span>
            <button
              onClick={onLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600">Dashboard coming soon...</p>
      </main>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await api.logout()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-bodhi-blue border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <LoginPage />}
      />
    </Routes>
  )
}
```

**Step 9: Commit**

```bash
git add -A
git commit -m "feat(cms): add CMS client setup with auth flow"
```

---

## Task 13-18: CMS Client Pages

Due to length, these tasks cover building the remaining CMS pages:

- **Task 13:** Dashboard page (stats, publish button, history)
- **Task 14:** Roles manager page (list, add, edit, delete, reorder)
- **Task 15:** Topics manager page (list, add, edit, delete)
- **Task 16:** Screen editor page (screenshot upload, visual hotspot editor)
- **Task 17:** Settings page (CTA, allowed users)
- **Task 18:** Navigation sidebar component

Each follows the same pattern: create component file, add route, commit.

---

## Task 19: Railway Deployment Setup

**Files:**
- Create: `apps/cms/server/Dockerfile`
- Create: `railway.json`

**Step 1: Create Dockerfile for CMS server**

Create `apps/cms/server/Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

**Step 2: Create railway.json**

Create `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "apps/cms/server/Dockerfile"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(cms): add Railway deployment configuration"
```

---

## Task 20: Update Vercel Config for Monorepo

**Files:**
- Modify: `vercel.json`

**Step 1: Update vercel.json**

Replace `vercel.json`:
```json
{
  "buildCommand": "cd apps/tour && npm run build",
  "outputDirectory": "apps/tour/dist",
  "installCommand": "npm install && cd apps/tour && npm install",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Step 2: Commit and push**

```bash
git add -A
git commit -m "chore: update Vercel config for monorepo"
git push
```

---

## Summary

This plan covers:
1. Monorepo restructure
2. CMS server with Express + Prisma
3. GitHub OAuth authentication
4. Full CRUD API for roles, topics, screens, hotspots
5. Settings and publish-to-GitHub workflow
6. Image upload to GitHub
7. CMS client with React + Tailwind
8. Railway and Vercel deployment configs

Total: ~20 tasks, each with specific files and code.
