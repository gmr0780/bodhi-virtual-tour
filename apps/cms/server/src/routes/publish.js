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
    cta: settings?.value || { text: 'Book a Demo', url: 'https://meetings.hubspot.com/greg-michelier/website-booking-a-meeting?uuid=c942b5d3-92ea-40a2-b382-7d9556ac33ff' }
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
