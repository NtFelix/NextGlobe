'use client';
import dynamic from 'next/dynamic';

const Earth = dynamic(() => import('./Earth'), { ssr: false });

export default function EarthScene() {
    return (
        <div className="h-screen w-full bg-black">
            <Earth />
        </div>
    );
}
