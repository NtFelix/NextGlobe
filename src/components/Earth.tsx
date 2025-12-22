'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

/**
 * Custom style matching the reference image style:
 * - Playful, illustrated aesthetic (Google Maps / Apple Maps style)
 * - Soft pastel greens for land, soft cyan/blue for water
 * - Clean white/light-blue atmospheric halo
 * - Hierarchical sans-serif labels
 */
const PLAYFUL_GLOBE_STYLE = {
    version: 8,
    name: 'Playful Illustrated Globe',
    sources: {
        // Esri World Physical Map for texture + bathymetry
        terrain: {
            type: 'raster',
            tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            maxzoom: 8,
            attribution: '© Esri'
        },
        // OpenStreetMap vector data (For land shapes, water shapes, and labels)
        openmaptiles: {
            type: 'vector',
            url: 'https://tiles.openfreemap.org/planet'
        }
    },
    layers: [
        // 1. Background (Universe)
        {
            id: 'background',
            type: 'background',
            paint: {
                'background-color': 'rgb(2, 4, 8)'
            }
        },
        // 2. Base Terrain Raster (Texture Base)
        {
            id: 'terrain-raster',
            type: 'raster',
            source: 'terrain',
            paint: {
                'raster-opacity': 1,
                'raster-saturation': 0.6, // Significant boost for vibrant colors
                'raster-contrast': 0.1,
                'raster-brightness-min': 0.2 // Brighter overall
            }
        },
        // 3. Water Fill (Texture Tint)
        // Lighter blue to tint the texture, as requested
        {
            id: 'water-fill',
            type: 'fill',
            source: 'openmaptiles',
            'source-layer': 'water',
            paint: {
                'fill-color': 'rgb(60, 140, 210)', // Lighter, vibrant blue
                'fill-opacity': 0.5                // Keep texture visible
            }
        },
        // 3b. Coastal Glow (Simulates shallow water)
        // Adds a light bright turquoise fade near the coastlines
        {
            id: 'coastline-glow',
            type: 'line',
            source: 'openmaptiles',
            'source-layer': 'water',
            paint: {
                'line-color': 'rgb(160, 230, 255)', // Very light cyan/white
                'line-width': 2,
                'line-blur': 1,
                'line-opacity': 0.6
            }
        },
        // 4. Landcover Tint (Cartoon/Illustration Style Green)
        {
            id: 'landcover-green',
            type: 'fill',
            source: 'openmaptiles',
            'source-layer': 'landcover',
            paint: {
                'fill-color': 'rgb(130, 235, 120)', // Very bright, "cartoon" green
                'fill-opacity': 0.45                // Strong tint
            }
        },
        // 5. Landuse (Additional green coverage)
        {
            id: 'landuse-green',
            type: 'fill',
            source: 'openmaptiles',
            'source-layer': 'landuse',
            paint: {
                'fill-color': 'rgb(150, 230, 140)', // Matching bright green
                'fill-opacity': 0.35
            }
        },
        // 7. Labels - Continents
        {
            id: 'continent-label',
            type: 'symbol',
            source: 'openmaptiles',
            'source-layer': 'place',
            filter: ['==', 'class', 'continent'],
            layout: {
                'text-field': '{name:en}',
                'text-font': ['Noto Sans Bold'],
                'text-size': 18,
                'text-transform': 'uppercase',
                'text-letter-spacing': 0.3
            },
            paint: {
                'text-color': 'rgb(100, 110, 120)', // Soft dark gray
                'text-halo-color': 'rgba(255, 255, 255, 0.8)',
                'text-halo-width': 2
            }
        },
        // 8. Labels - Countries
        {
            id: 'country-label',
            type: 'symbol',
            source: 'openmaptiles',
            'source-layer': 'place',
            filter: ['==', 'class', 'country'],
            layout: {
                'text-field': '{name:en}',
                'text-font': ['Noto Sans Regular'],
                'text-size': ['interpolate', ['linear'], ['zoom'], 2, 10, 5, 14],
                'text-transform': 'uppercase',
                'text-letter-spacing': 0.1
            },
            paint: {
                'text-color': 'rgb(120, 130, 140)',
                'text-halo-color': 'rgba(255, 255, 255, 0.7)',
                'text-halo-width': 1.5
            }
        },
        // 9. Labels - Cities
        {
            id: 'city-label',
            type: 'symbol',
            source: 'openmaptiles',
            'source-layer': 'place',
            minzoom: 3,
            filter: ['in', 'class', 'city', 'town'],
            layout: {
                'text-field': '{name:en}',
                'text-font': ['Noto Sans Regular'],
                'text-size': ['interpolate', ['linear'], ['zoom'], 3, 9, 8, 12],
                'text-anchor': 'bottom',
                'text-offset': [0, -0.5]
            },
            paint: {
                'text-color': 'rgb(80, 90, 100)',
                'text-halo-color': 'white',
                'text-halo-width': 1
            }
        }
    ],
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sprite: 'https://tiles.openfreemap.org/sprites/ofm_f384/ofm',
    // Atmosphere configuration - Essential for the "Glowing" Look
    fog: {
        'range': [1, 15],
        'color': 'rgb(255, 255, 255)',        // White halo core
        'high-color': 'rgb(200, 230, 255)',   // Soft blue glow outer
        'horizon-blend': 0.05,                 // Very tight, crisp horizon
        'space-color': 'rgb(5, 5, 10)',       // Deep space
        'star-intensity': 0.15                  // Subtle stars
    }
};

export default function Earth() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [status, setStatus] = useState<string>('Initializing Globe...');

    useEffect(() => {
        if (mapRef.current) return;

        const container = mapContainer.current;
        if (!container) return;

        try {
            const map = new maplibregl.Map({
                container: container,
                style: PLAYFUL_GLOBE_STYLE as any,
                center: [-95, 38], // Central US
                zoom: 2.2,
                pitch: 0,
                projection: { type: 'globe' },
                attributionControl: false,
                renderWorldCopies: false,
                maxPitch: 85,
                antialias: true
            } as any);

            mapRef.current = map;

            map.on('load', () => {
                setStatus('');
                console.log("Playful Globe Style Loaded");

                // Ensure globe projection if not already active
                // @ts-ignore
                if (map.setProjection) {
                    // @ts-ignore
                    map.setProjection({ type: 'globe' });
                }
            });

            map.on('error', (e) => {
                console.error('Map Error:', e);
                // Ignore non-critical resource errors
                if (e.error?.message &&
                    !e.error.message.includes('glyph') &&
                    !e.error.message.includes('sprite')) {
                    setStatus(`Error: ${e.error.message}`);
                }
            });

        } catch (error: any) {
            setStatus(`Initialization Failed: ${error.message}`);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div className="w-full h-full relative bg-[#05050a]">
            {/* Status Overlay */}
            {status && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#05050a] text-white/50 font-mono text-sm tracking-widest uppercase">
                    <div className="animate-pulse">{status}</div>
                </div>
            )}
            <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

            {/* Overlays or Vignette can be added here if needed */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20" />
        </div>
    );
}
