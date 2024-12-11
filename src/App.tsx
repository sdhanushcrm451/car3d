import React, { useEffect } from 'react';
import { Scene } from './components/Scene';
import { Gamepad } from 'lucide-react';

declare global {
  interface Window {
    keyMap: { [key: string]: boolean };
  }
}

function App() {
  useEffect(() => {
    window.keyMap = {};
    
    const handleKeyDown = (e: KeyboardEvent) => {
      window.keyMap[e.key] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      window.keyMap[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="w-full h-screen relative">
      <Scene />
      
      <div className="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Gamepad className="w-5 h-5" />
          <span className="font-bold">Controls</span>
        </div>
        <div className="space-y-1 text-sm">
          <p>↑ - Accelerate</p>
          <p>↓ - Brake/Reverse</p>
          <p>← → - Steer</p>
        </div>
      </div>
    </div>
  );
}

export default App;