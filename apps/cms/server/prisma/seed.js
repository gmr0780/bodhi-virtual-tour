import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()

async function main() {
  // Read existing tourData.json
  const tourDataPath = path.join(__dirname, '../../../tour/src/data/tourData.json')
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
