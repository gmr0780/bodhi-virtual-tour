import express from 'express'
import cors from 'cors'
import session from 'express-session'
import dotenv from 'dotenv'
import passport from './auth.js'
import rolesRouter from './routes/roles.js'
import topicsRouter from './routes/topics.js'
import screensRouter from './routes/screens.js'
import hotspotsRouter from './routes/hotspots.js'
import settingsRouter from './routes/settings.js'
import publishRouter from './routes/publish.js'
import uploadRouter from './routes/upload.js'

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
export const requireAuth = (req, res, next) => {
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

// API routes
app.use('/api/roles', requireAuth, rolesRouter)
app.use('/api/topics', requireAuth, topicsRouter)
app.use('/api/screens', requireAuth, screensRouter)
app.use('/api/hotspots', requireAuth, hotspotsRouter)
app.use('/api/settings', requireAuth, settingsRouter)
app.use('/api/publish', requireAuth, publishRouter)
app.use('/api/upload', requireAuth, uploadRouter)

// Export app for adding routes in other files
export { app }

app.listen(PORT, () => {
  console.log(`CMS Server running on http://localhost:${PORT}`)
})
