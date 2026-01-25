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
