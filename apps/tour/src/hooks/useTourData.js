import { useState, useEffect } from 'react'
import fallbackData from '../data/tourData.json'

const TOUR_DATA_URL = 'https://raw.githubusercontent.com/gmr0780/bodhi-virtual-tour/main/apps/tour/src/data/tourData.json'

export function useTourData() {
  const [tourData, setTourData] = useState(fallbackData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Add cache-busting query param
        const res = await fetch(`${TOUR_DATA_URL}?t=${Date.now()}`)
        if (res.ok) {
          const data = await res.json()
          setTourData(data)
        }
      } catch (err) {
        // Use fallback data on error
        console.warn('Failed to fetch tour data, using fallback:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { tourData, loading, error }
}
