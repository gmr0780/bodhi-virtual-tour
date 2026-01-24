# Bodhi Virtual Tour Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an interactive virtual tour for Bodhi smart building platform with role-based entry, topic exploration, and hotspot interactions.

**Architecture:** React SPA with JSON-driven content, role selection → video intro → topic cards → interactive screenshot exploration with hotspots. Persistent navigation and CTAs throughout.

**Tech Stack:** React 18, Tailwind CSS, Vite, React Router, Vercel deployment

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css`

**Step 1: Initialize Vite React project**

Run:
```bash
cd /Users/gregory/Documents/bodhi-virtual-tour
npm create vite@latest . -- --template react
```

Select: Overwrite existing files if prompted

**Step 2: Install dependencies**

Run:
```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 3: Configure Tailwind**

Replace `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bodhi: {
          blue: '#0066CC',
          dark: '#1a1a2e',
          light: '#f8f9fa',
          accent: '#00d4aa',
        }
      }
    },
  },
  plugins: [],
}
```

**Step 4: Set up Tailwind CSS**

Replace `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-bodhi-light text-gray-900;
}
```

**Step 5: Create minimal App component**

Replace `src/App.jsx`:
```jsx
function App() {
  return (
    <div className="min-h-screen bg-bodhi-light">
      <h1 className="text-3xl font-bold text-bodhi-blue p-8">
        Bodhi Virtual Tour
      </h1>
    </div>
  )
}

export default App
```

**Step 6: Verify setup works**

Run:
```bash
npm run dev
```

Expected: App runs at localhost:5173, shows "Bodhi Virtual Tour" in blue

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: initialize React project with Vite and Tailwind"
```

---

## Task 2: Tour Data Structure

**Files:**
- Create: `src/data/tourData.json`
- Create: `public/screenshots/.gitkeep`
- Create: `public/videos/.gitkeep`

**Step 1: Create tour data JSON**

Create `src/data/tourData.json`:
```json
{
  "roles": [
    {
      "id": "gm",
      "name": "Hotel General Manager",
      "description": "See how Bodhi improves guest satisfaction and reduces costs",
      "icon": "building",
      "videoUrl": "",
      "recommendedTopics": ["energy", "guest", "operations", "hardware"]
    },
    {
      "id": "engineering",
      "name": "Director of Engineering",
      "description": "See how Bodhi streamlines maintenance and building operations",
      "icon": "wrench",
      "videoUrl": "",
      "recommendedTopics": ["operations", "hardware", "energy", "guest"]
    },
    {
      "id": "it",
      "name": "Director of IT",
      "description": "See how Bodhi integrates with your existing systems",
      "icon": "server",
      "videoUrl": "",
      "recommendedTopics": ["hardware", "operations", "energy", "guest"]
    }
  ],
  "topics": [
    {
      "id": "energy",
      "name": "Energy & Cost Savings",
      "description": "Reduce energy costs by up to 45% with intelligent automation",
      "icon": "zap",
      "screens": [
        {
          "id": "energy-dashboard",
          "title": "Energy Dashboard",
          "image": "/screenshots/energy-dashboard.png",
          "hotspots": [
            {
              "id": "realtime-usage",
              "x": 25,
              "y": 20,
              "title": "Real-time Energy Usage",
              "description": "Monitor energy consumption across all properties in real-time. Bodhi AI identifies usage patterns and anomalies automatically.",
              "aiPowered": true
            },
            {
              "id": "savings-tracker",
              "x": 70,
              "y": 35,
              "title": "Savings Tracker",
              "description": "Track your actual savings compared to baseline. See ROI metrics and projected annual savings.",
              "aiPowered": false
            },
            {
              "id": "occupancy-automation",
              "x": 45,
              "y": 60,
              "title": "Occupancy-Based Automation",
              "description": "Automatically adjust climate and lighting based on room occupancy. Bodhi AI learns guest patterns to optimize comfort and efficiency.",
              "aiPowered": true
            }
          ]
        },
        {
          "id": "climate-controls",
          "title": "Climate Controls",
          "image": "/screenshots/climate-controls.png",
          "hotspots": [
            {
              "id": "temp-scheduling",
              "x": 30,
              "y": 25,
              "title": "Smart Temperature Scheduling",
              "description": "Set temperature schedules that automatically adjust based on check-in/check-out times and occupancy.",
              "aiPowered": true
            },
            {
              "id": "zone-control",
              "x": 65,
              "y": 50,
              "title": "Zone Control",
              "description": "Manage temperature zones across your property from a single view. Group rooms by floor, building, or custom zones.",
              "aiPowered": false
            }
          ]
        }
      ]
    },
    {
      "id": "guest",
      "name": "Guest Experience",
      "description": "Delight guests with seamless digital experiences",
      "icon": "smartphone",
      "screens": [
        {
          "id": "guest-app",
          "title": "Guest Mobile App",
          "image": "/screenshots/guest-app.png",
          "hotspots": [
            {
              "id": "mobile-key",
              "x": 50,
              "y": 30,
              "title": "Mobile Key Access",
              "description": "Guests unlock their room with their smartphone. No physical keys to manage or replace.",
              "aiPowered": false
            },
            {
              "id": "room-controls",
              "x": 50,
              "y": 55,
              "title": "In-Room Controls",
              "description": "Guests control lighting, temperature, and shades from their phone. Preferences sync automatically for return visits.",
              "aiPowered": true
            },
            {
              "id": "service-requests",
              "x": 50,
              "y": 80,
              "title": "Service Requests",
              "description": "One-tap requests for housekeeping, maintenance, or amenities. Requests route automatically to the right team.",
              "aiPowered": false
            }
          ]
        }
      ]
    },
    {
      "id": "operations",
      "name": "Property Operations",
      "description": "Proactive maintenance and centralized control",
      "icon": "layout",
      "screens": [
        {
          "id": "operations-dashboard",
          "title": "Operations Dashboard",
          "image": "/screenshots/operations-dashboard.png",
          "hotspots": [
            {
              "id": "multi-property",
              "x": 20,
              "y": 25,
              "title": "Multi-Property View",
              "description": "Manage all your properties from one dashboard. Switch between properties or view portfolio-wide metrics.",
              "aiPowered": false
            },
            {
              "id": "alerts",
              "x": 75,
              "y": 30,
              "title": "Proactive Alerts",
              "description": "Bodhi AI detects potential issues before they become problems. Get alerts for leaks, temperature anomalies, and equipment issues.",
              "aiPowered": true
            },
            {
              "id": "ticket-management",
              "x": 50,
              "y": 65,
              "title": "Ticket Management",
              "description": "Maintenance tickets auto-generate from alerts. Track status, assign staff, and monitor resolution times.",
              "aiPowered": true
            }
          ]
        },
        {
          "id": "maintenance-alerts",
          "title": "Maintenance Alerts",
          "image": "/screenshots/maintenance-alerts.png",
          "hotspots": [
            {
              "id": "leak-detection",
              "x": 35,
              "y": 40,
              "title": "Leak & Flood Detection",
              "description": "Sensors detect water issues immediately. Automatic alerts prevent costly damage.",
              "aiPowered": false
            },
            {
              "id": "predictive",
              "x": 65,
              "y": 40,
              "title": "Predictive Maintenance",
              "description": "Bodhi AI analyzes equipment patterns to predict failures before they happen. Schedule maintenance proactively.",
              "aiPowered": true
            }
          ]
        }
      ]
    },
    {
      "id": "hardware",
      "name": "Hardware & Integrations",
      "description": "Enterprise-grade devices and seamless integrations",
      "icon": "cpu",
      "screens": [
        {
          "id": "device-management",
          "title": "Device Management",
          "image": "/screenshots/device-management.png",
          "hotspots": [
            {
              "id": "device-list",
              "x": 30,
              "y": 35,
              "title": "Device Inventory",
              "description": "View and manage all connected devices. Monitor battery levels, connectivity status, and firmware versions.",
              "aiPowered": false
            },
            {
              "id": "remote-config",
              "x": 70,
              "y": 35,
              "title": "Remote Configuration",
              "description": "Update device settings remotely. Push firmware updates across your entire portfolio at once.",
              "aiPowered": false
            }
          ]
        },
        {
          "id": "integrations",
          "title": "Integrations",
          "image": "/screenshots/integrations.png",
          "hotspots": [
            {
              "id": "pms-integration",
              "x": 40,
              "y": 30,
              "title": "PMS Integration",
              "description": "Connects with Opera, Mews, and other property management systems. Guest data syncs automatically.",
              "aiPowered": false
            },
            {
              "id": "api-access",
              "x": 60,
              "y": 60,
              "title": "API Access",
              "description": "Full REST API for custom integrations. Connect Bodhi to your existing tech stack.",
              "aiPowered": false
            }
          ]
        }
      ]
    }
  ],
  "cta": {
    "text": "Book a Demo",
    "url": "https://www.gobodhi.com/contact"
  }
}
```

**Step 2: Create placeholder directories**

Run:
```bash
mkdir -p /Users/gregory/Documents/bodhi-virtual-tour/public/screenshots
mkdir -p /Users/gregory/Documents/bodhi-virtual-tour/public/videos
touch /Users/gregory/Documents/bodhi-virtual-tour/public/screenshots/.gitkeep
touch /Users/gregory/Documents/bodhi-virtual-tour/public/videos/.gitkeep
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add tour data structure and placeholder directories"
```

---

## Task 3: Layout and Navigation Components

**Files:**
- Create: `src/components/Layout.jsx`
- Create: `src/components/Header.jsx`
- Create: `src/components/ProgressBar.jsx`

**Step 1: Create Header component**

Create `src/components/Header.jsx`:
```jsx
import { Link } from 'react-router-dom'
import tourData from '../data/tourData.json'

export default function Header({ completedTopics = [] }) {
  const progress = (completedTopics.length / tourData.topics.length) * 100

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-bodhi-blue">Bodhi</span>
            <span className="text-sm text-gray-500">Virtual Tour</span>
          </Link>

          <div className="flex items-center gap-6">
            {completedTopics.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-bodhi-accent transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {completedTopics.length}/{tourData.topics.length}
                </span>
              </div>
            )}

            <a
              href={tourData.cta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bodhi-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {tourData.cta.text}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
```

**Step 2: Create Layout component**

Create `src/components/Layout.jsx`:
```jsx
import Header from './Header'

export default function Layout({ children, completedTopics = [] }) {
  return (
    <div className="min-h-screen bg-bodhi-light">
      <Header completedTopics={completedTopics} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}
```

**Step 3: Install React Router**

Run:
```bash
npm install react-router-dom
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Layout and Header components with progress tracking"
```

---

## Task 4: Role Selection Page

**Files:**
- Create: `src/pages/RoleSelection.jsx`
- Create: `src/components/RoleCard.jsx`
- Create: `src/components/icons.jsx`

**Step 1: Create icons helper**

Create `src/components/icons.jsx`:
```jsx
export function BuildingIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  )
}

export function WrenchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  )
}

export function ServerIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
    </svg>
  )
}

export function ZapIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  )
}

export function SmartphoneIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  )
}

export function LayoutIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  )
}

export function CpuIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
  )
}

export function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

export function PlayIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export function ChevronRightIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}

export function ChevronLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  )
}

export function SparklesIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}

const iconMap = {
  building: BuildingIcon,
  wrench: WrenchIcon,
  server: ServerIcon,
  zap: ZapIcon,
  smartphone: SmartphoneIcon,
  layout: LayoutIcon,
  cpu: CpuIcon,
}

export function getIcon(name) {
  return iconMap[name] || BuildingIcon
}
```

**Step 2: Create RoleCard component**

Create `src/components/RoleCard.jsx`:
```jsx
import { getIcon, ChevronRightIcon } from './icons'

export default function RoleCard({ role, onClick }) {
  const Icon = getIcon(role.icon)

  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl p-8 text-left shadow-sm border border-gray-100 hover:shadow-lg hover:border-bodhi-blue transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="w-14 h-14 bg-bodhi-blue/10 rounded-xl flex items-center justify-center mb-6">
          <Icon className="w-7 h-7 text-bodhi-blue" />
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-300 group-hover:text-bodhi-blue group-hover:translate-x-1 transition-all" />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {role.name}
      </h3>
      <p className="text-gray-600">
        {role.description}
      </p>
    </button>
  )
}
```

**Step 3: Create RoleSelection page**

Create `src/pages/RoleSelection.jsx`:
```jsx
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import RoleCard from '../components/RoleCard'
import tourData from '../data/tourData.json'

export default function RoleSelection() {
  const navigate = useNavigate()

  const handleRoleSelect = (roleId) => {
    navigate(`/intro/${roleId}`)
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Bodhi
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how Bodhi's smart building platform can transform your property operations. Select your role to get a personalized tour.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tourData.roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onClick={() => handleRoleSelect(role.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add RoleSelection page with RoleCard components"
```

---

## Task 5: Video Intro Page

**Files:**
- Create: `src/pages/VideoIntro.jsx`
- Create: `src/components/VideoPlayer.jsx`

**Step 1: Create VideoPlayer component**

Create `src/components/VideoPlayer.jsx`:
```jsx
import { useState } from 'react'
import { PlayIcon } from './icons'

export default function VideoPlayer({ videoUrl, onComplete, placeholderText }) {
  const [isPlaying, setIsPlaying] = useState(false)

  // If no video URL, show placeholder
  if (!videoUrl) {
    return (
      <div className="relative aspect-video bg-bodhi-dark rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <PlayIcon className="w-10 h-10 text-white/50" />
          </div>
          <p className="text-lg text-white/70 mb-2">{placeholderText || 'Video Coming Soon'}</p>
          <p className="text-sm text-white/50">Your personalized intro video will appear here</p>
          <button
            onClick={onComplete}
            className="mt-8 bg-bodhi-accent text-bodhi-dark px-6 py-3 rounded-lg font-medium hover:bg-bodhi-accent/90 transition-colors"
          >
            Skip to Tour
          </button>
        </div>
      </div>
    )
  }

  // Determine if it's YouTube or Vimeo
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const isVimeo = videoUrl.includes('vimeo.com')

  const getEmbedUrl = () => {
    if (isYouTube) {
      const videoId = videoUrl.includes('youtu.be')
        ? videoUrl.split('/').pop()
        : new URL(videoUrl).searchParams.get('v')
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    }
    if (isVimeo) {
      const videoId = videoUrl.split('/').pop()
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    }
    return videoUrl
  }

  if (!isPlaying) {
    return (
      <div className="relative aspect-video bg-bodhi-dark rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center group"
        >
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <PlayIcon className="w-10 h-10 text-white ml-1" />
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="relative aspect-video bg-bodhi-dark rounded-2xl overflow-hidden">
      <iframe
        src={getEmbedUrl()}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
      <button
        onClick={onComplete}
        className="absolute bottom-4 right-4 bg-bodhi-accent text-bodhi-dark px-4 py-2 rounded-lg font-medium hover:bg-bodhi-accent/90 transition-colors"
      >
        Continue to Tour
      </button>
    </div>
  )
}
```

**Step 2: Create VideoIntro page**

Create `src/pages/VideoIntro.jsx`:
```jsx
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import VideoPlayer from '../components/VideoPlayer'
import tourData from '../data/tourData.json'

export default function VideoIntro() {
  const { roleId } = useParams()
  const navigate = useNavigate()

  const role = tourData.roles.find(r => r.id === roleId)

  if (!role) {
    navigate('/')
    return null
  }

  const handleVideoComplete = () => {
    navigate(`/topics/${roleId}`)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <p className="text-bodhi-blue font-medium mb-2">Welcome, {role.name}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Here's what Bodhi can do for you
          </h1>
        </div>

        <VideoPlayer
          videoUrl={role.videoUrl}
          onComplete={handleVideoComplete}
          placeholderText={`${role.name} Introduction`}
        />

        <div className="mt-8 text-center">
          <button
            onClick={handleVideoComplete}
            className="text-gray-500 hover:text-gray-700 underline"
          >
            Skip video
          </button>
        </div>
      </div>
    </Layout>
  )
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add VideoIntro page with VideoPlayer component"
```

---

## Task 6: Topic Selection Page

**Files:**
- Create: `src/pages/TopicSelection.jsx`
- Create: `src/components/TopicCard.jsx`

**Step 1: Create TopicCard component**

Create `src/components/TopicCard.jsx`:
```jsx
import { getIcon, CheckIcon } from './icons'

export default function TopicCard({ topic, isRecommended, isCompleted, onClick }) {
  const Icon = getIcon(topic.icon)

  return (
    <button
      onClick={onClick}
      className={`group relative bg-white rounded-2xl p-6 text-left shadow-sm border transition-all duration-200 ${
        isCompleted
          ? 'border-bodhi-accent/50 bg-bodhi-accent/5'
          : 'border-gray-100 hover:shadow-lg hover:border-bodhi-blue'
      }`}
    >
      {isRecommended && !isCompleted && (
        <span className="absolute -top-3 left-4 bg-bodhi-blue text-white text-xs font-medium px-3 py-1 rounded-full">
          Recommended for you
        </span>
      )}

      {isCompleted && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-bodhi-accent rounded-full flex items-center justify-center">
          <CheckIcon className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isCompleted ? 'bg-bodhi-accent/20' : 'bg-bodhi-blue/10'
        }`}>
          <Icon className={`w-6 h-6 ${isCompleted ? 'text-bodhi-accent' : 'text-bodhi-blue'}`} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {topic.name}
          </h3>
          <p className="text-sm text-gray-600">
            {topic.description}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {topic.screens.length} screens to explore
          </p>
        </div>
      </div>
    </button>
  )
}
```

**Step 2: Create TopicSelection page**

Create `src/pages/TopicSelection.jsx`:
```jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import TopicCard from '../components/TopicCard'
import tourData from '../data/tourData.json'

export default function TopicSelection() {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const [completedTopics, setCompletedTopics] = useState([])

  const role = tourData.roles.find(r => r.id === roleId)

  useEffect(() => {
    // Load completed topics from localStorage
    const saved = localStorage.getItem('bodhi-tour-completed')
    if (saved) {
      setCompletedTopics(JSON.parse(saved))
    }
  }, [])

  if (!role) {
    navigate('/')
    return null
  }

  const handleTopicSelect = (topicId) => {
    navigate(`/explore/${roleId}/${topicId}`)
  }

  // Sort topics by recommended order for this role
  const sortedTopics = [...tourData.topics].sort((a, b) => {
    const aIndex = role.recommendedTopics.indexOf(a.id)
    const bIndex = role.recommendedTopics.indexOf(b.id)
    return aIndex - bIndex
  })

  return (
    <Layout completedTopics={completedTopics}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-bodhi-blue font-medium mb-2">
            {completedTopics.length > 0
              ? `${completedTopics.length} of ${tourData.topics.length} topics explored`
              : 'Choose a topic to explore'
            }
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What would you like to explore?
          </h1>
          <p className="text-gray-600">
            Topics are ordered based on what's most relevant for your role. Explore any topic in any order.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {sortedTopics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isRecommended={index === 0 && !completedTopics.includes(topic.id)}
              isCompleted={completedTopics.includes(topic.id)}
              onClick={() => handleTopicSelect(topic.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add TopicSelection page with recommended ordering"
```

---

## Task 7: Interactive Screenshot Explorer

**Files:**
- Create: `src/pages/Explorer.jsx`
- Create: `src/components/ScreenshotView.jsx`
- Create: `src/components/Hotspot.jsx`
- Create: `src/components/FeaturePanel.jsx`
- Create: `src/components/ScreenThumbnails.jsx`

**Step 1: Create Hotspot component**

Create `src/components/Hotspot.jsx`:
```jsx
import { SparklesIcon } from './icons'

export default function Hotspot({ hotspot, index, isActive, onClick, isGuided, isGuidedActive }) {
  return (
    <button
      onClick={onClick}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
        isGuided && !isGuidedActive ? 'opacity-30' : ''
      }`}
    >
      <div className={`relative flex items-center justify-center ${
        isActive
          ? 'scale-110'
          : 'hover:scale-110'
      }`}>
        {/* Pulse animation */}
        <div className={`absolute w-10 h-10 rounded-full ${
          isActive ? 'bg-bodhi-blue' : 'bg-bodhi-blue/50'
        } animate-ping`} />

        {/* Main dot */}
        <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          isActive
            ? 'bg-bodhi-blue text-white'
            : 'bg-white text-bodhi-blue border-2 border-bodhi-blue'
        }`}>
          {hotspot.aiPowered ? (
            <SparklesIcon className="w-4 h-4" />
          ) : (
            index + 1
          )}
        </div>
      </div>
    </button>
  )
}
```

**Step 2: Create FeaturePanel component**

Create `src/components/FeaturePanel.jsx`:
```jsx
import { SparklesIcon, ChevronLeftIcon, ChevronRightIcon } from './icons'

export default function FeaturePanel({
  hotspot,
  isGuided,
  guidedIndex,
  totalHotspots,
  onNext,
  onPrev,
  onExitGuided
}) {
  if (!hotspot) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div>
          <p className="text-gray-500 mb-2">Click a hotspot to learn more</p>
          <p className="text-sm text-gray-400">Or use "Guide Me" for a step-by-step walkthrough</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex-1">
        {hotspot.aiPowered && (
          <div className="flex items-center gap-2 text-bodhi-accent mb-3">
            <SparklesIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Bodhi AI</span>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {hotspot.title}
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {hotspot.description}
        </p>
      </div>

      {isGuided && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              Step {guidedIndex + 1} of {totalHotspots}
            </span>
            <button
              onClick={onExitGuided}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Exit guide
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onPrev}
              disabled={guidedIndex === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={onNext}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-bodhi-blue text-white rounded-lg hover:bg-blue-700"
            >
              {guidedIndex === totalHotspots - 1 ? 'Finish' : 'Next'}
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

**Step 3: Create ScreenThumbnails component**

Create `src/components/ScreenThumbnails.jsx`:
```jsx
import { CheckIcon } from './icons'

export default function ScreenThumbnails({ screens, currentIndex, viewedScreens, onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {screens.map((screen, index) => (
        <button
          key={screen.id}
          onClick={() => onSelect(index)}
          className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
            index === currentIndex
              ? 'border-bodhi-blue'
              : 'border-transparent hover:border-gray-300'
          }`}
        >
          {screen.image ? (
            <img
              src={screen.image}
              alt={screen.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-400">{index + 1}</span>
            </div>
          )}

          {viewedScreens.includes(screen.id) && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-bodhi-accent rounded-full flex items-center justify-center">
              <CheckIcon className="w-3 h-3 text-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
```

**Step 4: Create ScreenshotView component**

Create `src/components/ScreenshotView.jsx`:
```jsx
import { useState } from 'react'
import Hotspot from './Hotspot'
import FeaturePanel from './FeaturePanel'

export default function ScreenshotView({ screen, onAllHotspotsViewed }) {
  const [activeHotspot, setActiveHotspot] = useState(null)
  const [viewedHotspots, setViewedHotspots] = useState([])
  const [isGuided, setIsGuided] = useState(false)
  const [guidedIndex, setGuidedIndex] = useState(0)

  const handleHotspotClick = (hotspot, index) => {
    setActiveHotspot(hotspot)

    if (!viewedHotspots.includes(hotspot.id)) {
      const newViewed = [...viewedHotspots, hotspot.id]
      setViewedHotspots(newViewed)

      if (newViewed.length === screen.hotspots.length) {
        onAllHotspotsViewed?.()
      }
    }

    if (isGuided) {
      setGuidedIndex(index)
    }
  }

  const startGuided = () => {
    setIsGuided(true)
    setGuidedIndex(0)
    handleHotspotClick(screen.hotspots[0], 0)
  }

  const exitGuided = () => {
    setIsGuided(false)
  }

  const nextGuided = () => {
    if (guidedIndex < screen.hotspots.length - 1) {
      const nextIndex = guidedIndex + 1
      setGuidedIndex(nextIndex)
      handleHotspotClick(screen.hotspots[nextIndex], nextIndex)
    } else {
      exitGuided()
    }
  }

  const prevGuided = () => {
    if (guidedIndex > 0) {
      const prevIndex = guidedIndex - 1
      setGuidedIndex(prevIndex)
      handleHotspotClick(screen.hotspots[prevIndex], prevIndex)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Screenshot area */}
      <div className="flex-1 lg:w-3/5">
        <div className="relative aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden">
          {screen.image ? (
            <img
              src={screen.image}
              alt={screen.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <p className="text-gray-400 mb-2">Screenshot Placeholder</p>
                <p className="text-sm text-gray-300">{screen.title}</p>
              </div>
            </div>
          )}

          {/* Hotspots */}
          {screen.hotspots.map((hotspot, index) => (
            <Hotspot
              key={hotspot.id}
              hotspot={hotspot}
              index={index}
              isActive={activeHotspot?.id === hotspot.id}
              onClick={() => handleHotspotClick(hotspot, index)}
              isGuided={isGuided}
              isGuidedActive={isGuided && guidedIndex === index}
            />
          ))}
        </div>

        {/* Guide Me button */}
        {!isGuided && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {viewedHotspots.length} of {screen.hotspots.length} features explored
            </p>
            <button
              onClick={startGuided}
              className="text-bodhi-blue hover:underline text-sm font-medium"
            >
              Guide Me →
            </button>
          </div>
        )}
      </div>

      {/* Feature panel */}
      <div className="lg:w-2/5 bg-white rounded-xl border border-gray-100 min-h-[300px]">
        <FeaturePanel
          hotspot={activeHotspot}
          isGuided={isGuided}
          guidedIndex={guidedIndex}
          totalHotspots={screen.hotspots.length}
          onNext={nextGuided}
          onPrev={prevGuided}
          onExitGuided={exitGuided}
        />
      </div>
    </div>
  )
}
```

**Step 5: Create Explorer page**

Create `src/pages/Explorer.jsx`:
```jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ScreenshotView from '../components/ScreenshotView'
import ScreenThumbnails from '../components/ScreenThumbnails'
import { ChevronLeftIcon, ChevronRightIcon, getIcon } from '../components/icons'
import tourData from '../data/tourData.json'

export default function Explorer() {
  const { roleId, topicId } = useParams()
  const navigate = useNavigate()
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)
  const [viewedScreens, setViewedScreens] = useState([])
  const [completedTopics, setCompletedTopics] = useState([])
  const [showCompletion, setShowCompletion] = useState(false)

  const role = tourData.roles.find(r => r.id === roleId)
  const topic = tourData.topics.find(t => t.id === topicId)

  useEffect(() => {
    const saved = localStorage.getItem('bodhi-tour-completed')
    if (saved) {
      setCompletedTopics(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (topic && !viewedScreens.includes(topic.screens[currentScreenIndex]?.id)) {
      setViewedScreens(prev => [...prev, topic.screens[currentScreenIndex]?.id])
    }
  }, [currentScreenIndex, topic])

  if (!role || !topic) {
    navigate('/')
    return null
  }

  const currentScreen = topic.screens[currentScreenIndex]
  const TopicIcon = getIcon(topic.icon)

  const markTopicComplete = () => {
    if (!completedTopics.includes(topicId)) {
      const newCompleted = [...completedTopics, topicId]
      setCompletedTopics(newCompleted)
      localStorage.setItem('bodhi-tour-completed', JSON.stringify(newCompleted))
    }
    setShowCompletion(true)
  }

  const handleAllHotspotsViewed = () => {
    // Check if this is the last screen and all screens have been viewed
    if (viewedScreens.length === topic.screens.length - 1 ||
        (viewedScreens.length === topic.screens.length && currentScreenIndex === topic.screens.length - 1)) {
      markTopicComplete()
    }
  }

  const nextScreen = () => {
    if (currentScreenIndex < topic.screens.length - 1) {
      setCurrentScreenIndex(prev => prev + 1)
    } else {
      markTopicComplete()
    }
  }

  const prevScreen = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(prev => prev - 1)
    }
  }

  const getNextTopic = () => {
    const currentIndex = role.recommendedTopics.indexOf(topicId)
    const remainingTopics = role.recommendedTopics
      .slice(currentIndex + 1)
      .filter(id => !completedTopics.includes(id))

    if (remainingTopics.length > 0) {
      return tourData.topics.find(t => t.id === remainingTopics[0])
    }
    return null
  }

  const nextTopic = getNextTopic()

  if (showCompletion) {
    return (
      <Layout completedTopics={completedTopics}>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-bodhi-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <TopicIcon className="w-8 h-8 text-bodhi-accent" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You've explored {topic.name}
          </h1>

          <p className="text-gray-600 mb-8">
            {completedTopics.length} of {tourData.topics.length} topics completed
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {nextTopic && (
              <Link
                to={`/explore/${roleId}/${nextTopic.id}`}
                onClick={() => setShowCompletion(false)}
                className="bg-bodhi-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Next: {nextTopic.name}
              </Link>
            )}

            <Link
              to={`/topics/${roleId}`}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View All Topics
            </Link>

            <a
              href={tourData.cta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bodhi-accent text-bodhi-dark px-6 py-3 rounded-lg font-medium hover:bg-bodhi-accent/90 transition-colors"
            >
              {tourData.cta.text}
            </a>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout completedTopics={completedTopics}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-bodhi-blue">Home</Link>
          <span>/</span>
          <Link to={`/topics/${roleId}`} className="hover:text-bodhi-blue">Topics</Link>
          <span>/</span>
          <span className="text-gray-900">{topic.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bodhi-blue/10 rounded-lg flex items-center justify-center">
              <TopicIcon className="w-5 h-5 text-bodhi-blue" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currentScreen.title}</h1>
              <p className="text-sm text-gray-500">
                Screen {currentScreenIndex + 1} of {topic.screens.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevScreen}
              disabled={currentScreenIndex === 0}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextScreen}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Screenshot View */}
        <ScreenshotView
          key={currentScreen.id}
          screen={currentScreen}
          onAllHotspotsViewed={handleAllHotspotsViewed}
        />

        {/* Thumbnails */}
        <div className="mt-6">
          <ScreenThumbnails
            screens={topic.screens}
            currentIndex={currentScreenIndex}
            viewedScreens={viewedScreens}
            onSelect={setCurrentScreenIndex}
          />
        </div>
      </div>
    </Layout>
  )
}
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add interactive Explorer with hotspots, guided mode, and completion flow"
```

---

## Task 8: Wire Up Routing

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`

**Step 1: Update main.jsx with BrowserRouter**

Replace `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

**Step 2: Update App.jsx with routes**

Replace `src/App.jsx`:
```jsx
import { Routes, Route } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection'
import VideoIntro from './pages/VideoIntro'
import TopicSelection from './pages/TopicSelection'
import Explorer from './pages/Explorer'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/intro/:roleId" element={<VideoIntro />} />
      <Route path="/topics/:roleId" element={<TopicSelection />} />
      <Route path="/explore/:roleId/:topicId" element={<Explorer />} />
    </Routes>
  )
}

export default App
```

**Step 3: Verify the app runs**

Run:
```bash
npm run dev
```

Expected: App runs, role selection shows, clicking a role navigates to video intro, then topics, then explorer

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire up React Router with all page routes"
```

---

## Task 9: Vercel Deployment Setup

**Files:**
- Create: `vercel.json`
- Update: `package.json` (if needed)

**Step 1: Create vercel.json for SPA routing**

Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Step 2: Build and test locally**

Run:
```bash
npm run build
npm run preview
```

Expected: Production build runs at localhost:4173, all routes work

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Vercel configuration for SPA routing"
```

**Step 4: Deploy to Vercel (manual)**

Instructions for user:
1. Go to vercel.com and sign in
2. Click "Add New Project"
3. Import the `bodhi-virtual-tour` git repository
4. Vercel auto-detects Vite, click Deploy
5. Once deployed, get the URL (e.g., bodhi-virtual-tour.vercel.app)

---

## Task 10: Placeholder Screenshots

**Files:**
- Create: `scripts/generate-placeholders.js`

**Step 1: Create placeholder generation script**

Create `scripts/generate-placeholders.js`:
```javascript
import fs from 'fs'
import path from 'path'

const screenshotDir = './public/screenshots'

const placeholders = [
  'energy-dashboard.png',
  'climate-controls.png',
  'guest-app.png',
  'operations-dashboard.png',
  'maintenance-alerts.png',
  'device-management.png',
  'integrations.png'
]

// Ensure directory exists
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true })
}

// Create placeholder SVGs as PNG stand-ins
placeholders.forEach(filename => {
  const filepath = path.join(screenshotDir, filename)
  if (!fs.existsSync(filepath)) {
    // Create a simple placeholder text file (user will replace with real screenshots)
    fs.writeFileSync(
      filepath.replace('.png', '.txt'),
      `Placeholder for ${filename}\n\nReplace this with your actual screenshot.`
    )
    console.log(`Created placeholder note for: ${filename}`)
  }
})

console.log('\nTo complete the tour, replace placeholder files with actual screenshots.')
console.log('Screenshot files needed:', placeholders)
```

**Step 2: Add script to package.json**

Add to `package.json` scripts:
```json
"generate-placeholders": "node scripts/generate-placeholders.js"
```

**Step 3: Run script**

Run:
```bash
npm run generate-placeholders
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add placeholder screenshot generation script"
```

---

## Summary: Content Checklist for User

After implementation, the user needs to provide:

1. **Videos (3)**: Upload to YouTube/Vimeo, add URLs to `tourData.json`
   - `roles[0].videoUrl` - GM intro
   - `roles[1].videoUrl` - Engineering intro
   - `roles[2].videoUrl` - IT intro

2. **Screenshots (7+)**: Add to `public/screenshots/`
   - energy-dashboard.png
   - climate-controls.png
   - guest-app.png
   - operations-dashboard.png
   - maintenance-alerts.png
   - device-management.png
   - integrations.png

3. **Hotspot positions**: Adjust x/y percentages in `tourData.json` to match actual screenshot content

4. **CTA URL**: Update `tourData.cta.url` if different from gobodhi.com/contact
