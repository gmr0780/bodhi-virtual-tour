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
router.post('/reorder', async (req, res) => {
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
