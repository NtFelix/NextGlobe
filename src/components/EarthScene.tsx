'use client';

import dynamic from 'next/dynamic';
import type { GlobeProps } from './Earth';

const Earth = dynamic(() => import('./Earth'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-[#05050a] flex items-center justify-center">
            <div className="text-white/50 font-mono text-sm tracking-widest uppercase animate-pulse">
                Loading Globe...
            </div>
        </div>
    )
});

export interface GlobeSceneProps extends GlobeProps {
    /** Height of the container. Default: '100vh' */
    height?: string;
}

/**
 * A full-screen globe scene component with SSR-safe dynamic loading.
 * This is the recommended way to use the Globe component in Next.js.
 * 
 * @example
 * ```tsx
 * import { GlobeScene } from 'nextglobe';
 * 
 * export default function Page() {
 *   return <GlobeScene height="100vh" center={[0, 20]} />;
 * }
 * ```
 */
export default function EarthScene({ height = '100vh', ...props }: GlobeSceneProps) {
    return (
        <div className="w-full bg-black" style={{ height }}>
            <Earth {...props} />
        </div>
    );
}
