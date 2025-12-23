# NextGlobe 🌍

A beautiful, interactive 3D globe component for Next.js applications. Built with MapLibre GL and optimized for the Next.js ecosystem.

[![npm version](https://img.shields.io/npm/v/nextglobe.svg)](https://www.npmjs.com/package/nextglobe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🌐 **Beautiful 3D Globe** - Stunning visual style with atmospheric glow effects
- ⚡ **Next.js Optimized** - Built with `'use client'` and SSR-safe dynamic imports
- 🎨 **Customizable** - Adjust center, zoom, pitch, and more
- 📦 **TypeScript** - Full type definitions included
- 🗺️ **MapLibre GL** - Powered by the open-source MapLibre GL library
- 🆓 **Free Map Tiles** - Uses OpenFreeMap and Esri basemaps

## Installation

```bash
npm install nextglobe
# or
yarn add nextglobe
# or
pnpm add nextglobe
```

## Quick Start

### Basic Usage

```tsx
import { GlobeScene } from 'nextglobe';

export default function Page() {
  return <GlobeScene />;
}
```

### With Custom Options

```tsx
import { Globe } from 'nextglobe';

export default function Page() {
  return (
    <div className="h-screen w-full">
      <Globe
        center={[0, 20]}
        zoom={2.5}
        pitch={30}
        onLoad={(map) => console.log('Globe loaded!', map)}
      />
    </div>
  );
}
```

## Components

### `<GlobeScene />`

A full-screen wrapper component with SSR-safe dynamic loading. **Recommended for most use cases.**

```tsx
import { GlobeScene } from 'nextglobe';

<GlobeScene 
  height="100vh"
  center={[-74, 40.7]} // New York
  zoom={3}
/>
```

### `<Globe />`

The core globe component. Use this when you need more control over the container.

```tsx
import { Globe } from 'nextglobe';

<div className="h-[600px] w-full">
  <Globe 
    center={[139.7, 35.7]} // Tokyo
    zoom={4}
    onLoad={(map) => {
      // Access the MapLibre map instance
      map.flyTo({ center: [2.3, 48.9], zoom: 5 });
    }}
  />
</div>
```

## Props

### GlobeProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `center` | `[number, number]` | `[-95, 38]` | Initial center coordinates [longitude, latitude] |
| `zoom` | `number` | `2.2` | Initial zoom level (0-22) |
| `pitch` | `number` | `0` | Initial pitch angle in degrees (0-85) |
| `maxPitch` | `number` | `85` | Maximum pitch angle |
| `antialias` | `boolean` | `true` | Enable antialiasing |
| `showStatus` | `boolean` | `true` | Show loading status overlay |
| `className` | `string` | `''` | Custom CSS class for the container |
| `onLoad` | `(map: Map) => void` | - | Callback when the map is loaded |
| `onError` | `(error: Error) => void` | - | Callback when an error occurs |

### GlobeSceneProps

Extends `GlobeProps` with:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | `string` | `'100vh'` | Height of the container |

## Styling

The globe uses Tailwind CSS classes by default. Make sure you have Tailwind CSS configured in your Next.js project.

If you're not using Tailwind, you can override styles using the `className` prop or by targeting the container element.

## Examples

### Fly to a Location

```tsx
import { Globe } from 'nextglobe';
import { useState } from 'react';

export default function InteractiveGlobe() {
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  const flyToParis = () => {
    map?.flyTo({
      center: [2.35, 48.85],
      zoom: 6,
      duration: 2000
    });
  };

  return (
    <div className="relative h-screen">
      <Globe onLoad={setMap} />
      <button 
        onClick={flyToParis}
        className="absolute top-4 right-4 px-4 py-2 bg-white rounded-lg"
      >
        Fly to Paris
      </button>
    </div>
  );
}
```

## Requirements

- Next.js 13.0.0 or higher
- React 18.0.0 or higher

## License

MIT © Felix Plant

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
