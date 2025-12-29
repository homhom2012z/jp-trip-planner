# Japan Trip Planner

A comprehensive web application designed to help users plan their trips to Japan. This project utilizes Next.js, React, and Tailwind CSS to provide a responsive and interactive experience for exploring cities, viewing location details, and organizing itineraries.

## Features

### Interactive Map and City Guides

- Explore major cities including Tokyo, Osaka, Kyoto, and more.
- View detailed location information including opening hours, ratings, and photos.
- Filter locations by category (Dining, Attractions, Shopping).
- Mobile-friendly map interface with a floating search bar for easy navigation.

### Itinerary Planner

- Drag-and-drop interface to organize your daily activities.
- "Unscheduled" area to keep track of places you want to visit but haven't assigned to a day yet.
- Automatic distance calculation between locations on your itinerary.

### Localization

- **Language Support**: Fully bilingual interface supporting English (EN) and Thai (TH).
- **Dynamic Switching**: Instantly toggle languages using the header button.
- **Localized Content**: Navigation, menus, labels, and landing page content are fully translated.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Maps**: Google Maps Platform (Maps JavaScript API, Places API)
- **Animations**: Framer Motion
- **Icons**: Material Symbols Outlined
- **State Management**: React Context API
- **Language**: TypeScript

## Configuration

This project requires a Google Maps API key. Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Ensure your API key has the Maps JavaScript API and Places API enabled.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
