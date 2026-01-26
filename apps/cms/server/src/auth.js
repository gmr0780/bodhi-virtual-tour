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
      // Check if user is allowed - gmr0780 is always allowed as admin
      const adminUsers = ['gmr0780']
      const settings = await prisma.setting.findUnique({ where: { key: 'allowedUsers' } })
      const allowedUsers = settings?.value || []

      // If no allowed users set or user is admin, allow them
      if (allowedUsers.length > 0 && !allowedUsers.includes(profile.username) && !adminUsers.includes(profile.username)) {
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
