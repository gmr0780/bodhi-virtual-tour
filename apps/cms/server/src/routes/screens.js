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
