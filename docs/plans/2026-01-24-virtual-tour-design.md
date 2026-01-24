# Bodhi Interactive Virtual Tour - Design Document

## Overview

An interactive virtual tour of the Bodhi smart building operations platform for potential customers (Hotel GMs, Directors of Engineering, Directors of IT).

## Target Audience

| Role | Primary Interests |
|------|-------------------|
| Hotel General Manager | ROI, guest satisfaction, operational simplicity |
| Director of Engineering | Proactive maintenance, alerts, hardware reliability |
| Director of IT | Integrations, security, deployment ease |

## Tour Flow

### 1. Entry Point
- Welcome screen with Bodhi branding
- Three role selection cards:
  - Hotel General Manager
  - Director of Engineering
  - Director of IT

### 2. Role-Based Video Intro
- One personalized intro video per role (30-90 sec)
- Speaks directly to that role's priorities
- Videos provided by Bodhi team

### 3. Topic Navigation
After video, user sees four topic cards with "Recommended for you" badges based on role:

1. **Energy & Cost Savings** - Climate automation, occupancy detection, energy dashboards, ROI tracking
2. **Guest/Resident Experience** - Mobile app, keyless entry, room controls, service requests
3. **Property Operations** - Multi-property dashboard, maintenance alerts, leak/flood detection, ticket management
4. **Hardware & Integrations** - Thermostats, sensors, locks, PMS integrations

Bodhi AI features are highlighted within each topic (not a separate section).

## Interaction Model

### Screenshot Exploration Layout
- **Left (60%)**: Large screenshot of Bodhi app screen
- **Right (40%)**: Feature explanation panel
- **Top**: Topic title + breadcrumb navigation
- **Bottom**: Progress indicator + screen thumbnails

### Hotspot Interaction
- Pulsing numbered dots on key features
- Hover: Subtle highlight
- Click: Right panel updates with feature name, 2-3 sentence explanation, optional gif

### Guided Mode
- "Guide Me" button activates step-by-step walkthrough
- Hotspots highlight sequentially
- Next/Back navigation
- Exit to free exploration anytime

### Multiple Screens Per Topic
- 3-5 screenshots per topic
- Thumbnail strip for jumping between screens
- "Next Screen" button for sequential navigation

## Navigation & CTAs

### Persistent Elements
- Header: Bodhi logo, breadcrumb, "Book a Demo" button (always visible)
- Topic sidebar: Quick jump to any topic, checkmarks on completed

### After Completing a Topic
Completion card appears:
- Summary of what they explored
- Recommended next topic
- Links to other topics
- "Book a Demo" CTA

### Progress Tracking
- Visual progress indicator (e.g., "2 of 4 topics explored")
- Checkmarks on completed topics
- Encourages full exploration

## Technical Implementation

### Tech Stack
- **Framework**: React
- **Styling**: Tailwind CSS
- **Video**: YouTube/Vimeo embeds
- **Hosting**: Vercel

### Content Architecture
JSON-driven for easy updates:
```json
{
  "roles": [
    {
      "id": "gm",
      "name": "Hotel General Manager",
      "description": "See how Bodhi improves guest satisfaction and reduces costs",
      "videoUrl": "...",
      "recommendedTopics": ["energy", "guest", "operations", "hardware"]
    }
  ],
  "topics": [
    {
      "id": "energy",
      "name": "Energy & Cost Savings",
      "screens": [
        {
          "image": "/screenshots/energy-dashboard.png",
          "hotspots": [
            {
              "x": 25,
              "y": 40,
              "title": "Real-time Energy Usage",
              "description": "...",
              "gif": null
            }
          ]
        }
      ]
    }
  ]
}
```

### Embed Options
- Standalone page (tour.gobodhi.com)
- Iframe embed on any page
- Direct links from emails, ads, sales decks

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-responsive, optimized for desktop

## Content Requirements

### Videos (3 total)
| Role | Length | Focus |
|------|--------|-------|
| Hotel GM | 30-90 sec | ROI, guest satisfaction, operational simplicity |
| Director of Engineering | 30-90 sec | Proactive maintenance, alerts, hardware reliability |
| Director of IT | 30-90 sec | Integrations, security, deployment ease |

### Screenshots (12-20 total)
- **Energy & Cost Savings** (3-5): Energy dashboard, occupancy settings, savings reports, climate controls
- **Guest/Resident Experience** (3-5): Mobile app screens, keyless entry, room controls, service requests
- **Property Operations** (3-5): Multi-property dashboard, maintenance alerts, ticket management, leak detection
- **Hardware & Integrations** (3-5): Device list, PMS integrations, sensor views, thermostat controls

### Hotspot Content
- 3-6 hotspots per screenshot
- Each: Title (5-10 words) + Description (2-3 sentences)
- Optional: Gif/animation showing feature in action
- Highlight "Powered by Bodhi AI" where relevant

## Deliverables

1. Complete React application
2. Placeholder content structure
3. `tourData.json` for easy content updates
4. Vercel deployment configuration
5. Instructions for swapping in real content

## Design Style

Match gobodhi.com branding:
- Color palette from main site
- Clean, modern aesthetic
- Professional feel appropriate for B2B hospitality buyers
