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

    // Return raw GitHub URL - immediately available after upload
    res.json({
      success: true,
      path: `https://raw.githubusercontent.com/${owner}/${repo}/main/public/screenshots/${filename}`
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
