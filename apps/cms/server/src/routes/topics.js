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
