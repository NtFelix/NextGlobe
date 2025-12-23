'use client';

// Main component exports
export { default as Globe } from './components/Earth';
export { default as GlobeScene } from './components/EarthScene';

// Re-export with original names for backwards compatibility
export { default as Earth } from './components/Earth';
export { default as EarthScene } from './components/EarthScene';

// Type exports
export type { GlobeProps } from './components/Earth';
