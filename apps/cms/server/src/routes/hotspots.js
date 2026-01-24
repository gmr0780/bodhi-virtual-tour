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
